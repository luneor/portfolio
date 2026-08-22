"use client";

import { useEffect, useRef } from "react";

/*
  The hero's gradient field.

  Modelled on resend.com/forward, which turned out not to be drawing blobs at
  all. The first attempt here was a handful of blurred radial gradients drifting
  around, and it always read as exactly that: a handful of blurred circles. The
  reference reads as folded light because it works the other way round.

  It lays down a few flat bands of colour, then DISTORTS THE COORDINATE SPACE
  those bands are sampled from, by the analytic derivative of a 3D value-noise
  field:

      position = warped + noiseGradient(warped, seed) * displacement

  Warping space folds straight bands into organic lobes, and since nothing
  round is ever drawn, there is nothing round to recognise. Three things follow
  from that, and they're what the CSS version couldn't reach:

  - Endless movement: the noise is 3D and `seed` is its third axis, so
    advancing the seed travels through a noise volume rather than looping a
    path. The field keeps rearranging and never repeats.
  - A huge interactive area: space is pulled toward the cursor over a radius
    larger than the viewport, so the whole field leans rather than a small
    spotlight sliding about.
  - Grain that doesn't grey the page: it's added per-pixel in the shader, so on
    a black ground the negative half of the noise clamps away and the blacks
    stay black. A CSS overlay can only sit on top and wash them out.

  Cost: this needs WebGL. `HeroGlow` renders a static CSS field instead when
  the context can't be created.
*/

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/*
  `hash` and `noised3` are the standard Inigo Quilez value-noise-with-analytic-
  derivatives formulation. The derivative is the whole point: it's a smooth
  vector field, so using it to displace coordinates warps space continuously
  instead of tearing it the way raw noise would.
*/
const FRAG = `
precision highp float;

uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_seed;
uniform float u_rotation;
uniform vec2  u_offset;
uniform float u_layerMix;
uniform vec3  u_bg, u_c1, u_c2, u_c3, u_c4, u_c5;
uniform vec2  u_p1, u_p2, u_p3, u_p4;
uniform float u_scale, u_noiseSize, u_displacement, u_spread, u_grain;

varying vec2 v_uv;

float hash(vec2 p) {
  p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
  return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
}

vec4 noised3(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  vec3 u  = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec3 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);

  float a = hash(i.xy + vec2(0.0, 0.0) + i.z);
  float b = hash(i.xy + vec2(1.0, 0.0) + i.z);
  float c = hash(i.xy + vec2(0.0, 1.0) + i.z);
  float d = hash(i.xy + vec2(1.0, 1.0) + i.z);
  float e = hash(i.xy + vec2(0.0, 0.0) + i.z + 1.0);
  float g = hash(i.xy + vec2(1.0, 0.0) + i.z + 1.0);
  float h = hash(i.xy + vec2(0.0, 1.0) + i.z + 1.0);
  float k = hash(i.xy + vec2(1.0, 1.0) + i.z + 1.0);

  float k0 = a;
  float k1 = b - a;
  float k2 = c - a;
  float k3 = e - a;
  float k4 = a - b - c + d;
  float k5 = a - b - e + g;
  float k6 = a - c - e + h;
  float k7 = -a + b + c - d + e - g - h + k;

  return vec4(
    k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.x*u.z + k6*u.y*u.z + k7*u.x*u.y*u.z,
    du * vec3(
      k1 + k4*u.y + k5*u.z + k7*u.y*u.z,
      k2 + k4*u.x + k6*u.z + k7*u.x*u.z,
      k3 + k5*u.x + k6*u.y + k7*u.x*u.y
    )
  );
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c) * v;
}

/*
  The domain warp. One field on wide screens, three lattices on tall ones.

  The problem being solved is a crease. Value noise interpolates with the
  quintic u = 6f^5 - 15f^4 + 10f^3, and the displacement here is that curve's
  derivative, du = 30f^2(f-1)^2. du is zero at both ends of every cell and its
  own second derivative is largest exactly there, so the warp both collapses
  and kinks along every integer lattice plane. At this frequency the field
  spans barely one cell on a phone, so the only two such planes sat dead centre,
  vertically and horizontally, and -- the lattice being welded to screen space,
  since u_rotation and u_offset are applied AFTER the warp -- they never moved.
  Two static seams across the middle of the hero, which is what showed up on a
  phone screenshot.

  It is not fixable inside one lattice. Gradient (Perlin) noise was the obvious
  candidate, since its derivative doesn't vanish at lattice points, and it makes
  no difference: measured, the curvature peak still lands exactly on the
  boundary, because the kink comes from the quintic's own second derivative,
  which both noises share. The crease needs more than one lattice.

  So LAYER 0 IS THE ORIGINAL FIELD, byte for byte -- sampled straight off p,
  no rotation, no offset -- and at u_layerMix 0 this function returns precisely
  what the single noised3 call returned, down to the opening composition on
  first load. That is deliberate and it is the thing to preserve: the layered
  version is a fix for a phone-shaped viewport, not an improvement on the look,
  and wide screens are left alone.

  The two extra lattices are at THE SAME FREQUENCY as layer 0, not detail
  octaves above it. That is also deliberate. The first attempt used proper fBm,
  octaves at 2.13x and 4.5x with falling amplitude, and it did kill the seam,
  but detail octaves are detail: it came out four times busier by measurement
  and read as a fussy, distracting background. Same-frequency layers buy the one
  thing actually needed -- three lattices in different places -- and add no
  detail at all: measured busyness at full mix is fractionally BELOW the
  original's.

  Each is turned off-axis (so what little crease survives falls on a diagonal,
  which reads as composition where a line down the middle of the screen reads as
  a bug) and shifted, so no two share a plane. Worst-case seam coherence,
  measured across every orientation: 3.70x at mix 0, 2.53x at mix 1.
*/
const float GOLDEN = 2.39996;
const float TILT = 0.61;

vec2 warpField(vec2 p, float seed) {
  vec2 total = noised3(vec3(p * u_noiseSize, seed)).yzw.xz;

  /*
    u_layerMix is a uniform, so every pixel takes the same side of this branch
    and it costs a wide screen nothing: the extra two samples are not merely
    weighted to zero there, they are never taken.
  */
  if (u_layerMix > 0.0) {
    for (int i = 1; i < 3; i++) {
      float angle = TILT + float(i - 1) * GOLDEN;
      vec2 q = rotate(p, angle);
      vec3 g = noised3(vec3(
        q * u_noiseSize + vec2(float(i) * 7.31, float(i) * 3.77),
        seed + float(i) * 31.4
      )).yzw;
      // Turned back out of this layer's own frame, so all three displace the
      // same space rather than each pulling in its own direction.
      total += rotate(g.xz, -angle) * u_layerMix;
    }
    total /= 1.0 + 2.0 * u_layerMix;
  }

  return total;
}

void main() {
  /*
    min(1.0, aspect), NOT the aspect itself. Every colour below sits on the
    y axis, so scaling x by a full 2:1 aspect pushes most of a wide viewport
    beyond the reach of any of them and the field collapses into a thin ribbon
    down the middle with black either side. Clamping at 1 means a wide screen
    simply stretches the field to fill it, and only taller-than-square
    viewports get corrected.
  */
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float xScale = min(1.0, aspect);
  vec2 uv = v_uv;
  uv.x *= xScale;
  uv /= max(u_scale, 0.001);

  vec2 m = u_mouse;
  m.x *= xScale;
  m /= max(u_scale, 0.001);

  // Space leans toward the cursor. The radius is deliberately larger than the
  // viewport, which is what makes the whole field feel reachable rather than
  // one small spot under the pointer.
  vec2 toMouse = m - uv;
  float dist = length(toMouse);
  vec2 warped = uv + toMouse * (smoothstep(2.4, 0.0, dist) * 0.40);

  // The domain warp itself.
  vec2 pos = rotate(warped + warpField(warped, u_seed) * u_displacement + u_offset, -u_rotation);

  /*
    Four colours, each anchored at its own point, folded into lobes by the warp
    above. Mixing FROM the background means anywhere no colour reaches stays
    background, so the page keeps its black.

    The anchors are full uniforms rather than a single spacing value stepped
    along the y axis, which is what they used to be. That only ever gave a
    stack of parallel bands; letting each one move in x as well is what allows
    the randomiser to produce genuinely different compositions instead of the
    same arrangement in a new order.
  */
  vec3 color = u_bg;
  color = mix(u_c1, color, smoothstep(0.0, u_spread, distance(pos, u_p1)));
  color = mix(u_c2, color, smoothstep(0.0, u_spread, distance(pos, u_p2)));
  color = mix(u_c3, color, smoothstep(0.0, u_spread, distance(pos, u_p3)));
  color = mix(u_c4, color, smoothstep(0.0, u_spread, distance(pos, u_p4)));
  color = mix(color, u_c5, 0.5 * (1.0 - smoothstep(0.0, u_spread * 0.7, distance(pos, vec2(0.0)))));

  /*
    Signed grain, added rather than composited: the negative half clamps off
    against the black ground instead of lifting it to grey.

    Keyed to v_uv ALONE, deliberately. Feeding the seed in as well re-rolls
    every pixel on every frame, which isn't grain at all, it's television
    static, and it read as a constant flicker over the whole hero. Fixed to
    position, it behaves like grain on a print: the colour moves underneath it
    and the grain itself sits still.
  */
  color += hash(v_uv * 900.0) * u_grain;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

/** Reads a CSS custom property off an element and returns it as RGB 0..1, so
 *  the palette stays owned by the tokens in globals.css. */
function readColour(styles: CSSStyleDeclaration, name: string): [number, number, number] {
  const raw = styles.getPropertyValue(name).trim();
  const hex = raw.replace("#", "");
  if (hex.length === 6) {
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }
  const m = raw.match(/-?\d*\.?\d+/g);
  if (m && m.length >= 3) {
    return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
  }
  return [0, 0, 0];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Hero gradient shader failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/*
  Field tuning. `SPREAD` against `SCALE` is the balance that decides how much
  black survives, and it is easy to get badly wrong in the bright direction:
  each colour is a point on the y axis whose reach is SPREAD, while SCALE sets
  how much of the coordinate plane the viewport covers. Reach comparable to the
  visible extent means every pixel is within range of some colour and the field
  floods edge to edge, which reads as a coloured page rather than a dark one
  with light moving through it. Kept well under, so most of the frame is
  background and the colour has somewhere to arrive from.
*/
const SCALE = 0.82;
const NOISE_SIZE = 0.7;
/*
  0.9 is the original figure and the one a wide screen still gets, unchanged.

  A tall screen mixes in two more lattices (see `warpField`), which partly
  cancel each other, so the same number there would buy about three quarters of
  the fold depth and flatten the field into a wash. 1.236 is what restores it,
  set by matching the RMS displacement of the single-field original rather than
  by eye, so the folds are the depth they always were and no more.
*/
const DISPLACEMENT = 0.9;
const DISPLACEMENT_LAYERED = 1.236;

/*
  How tall a viewport has to be before the crease is worth spending two extra
  noise samples on. Phones (~0.46) are fully in, anything square or landscape is
  fully out, and a portrait tablet sits partway. Interpolated rather than
  switched so that rotating a tablet cross-fades instead of popping; the
  displacement is lerped straight across the band, which undershoots the true
  normalisation by ~10% in the middle of it, and that only exists mid-rotation.
*/
const LAYER_ASPECT_OFF = 0.95;
const LAYER_ASPECT_FULL = 0.65;
const SPREAD = 1.0;
const GRAIN = 0.055;

/* Seed units per second: how fast the warp field evolves. */
const SEED_SPEED = 0.055;
/* Pointer smoothing per second. Low, so the field trails the cursor. */
const POINTER_EASE = 2.2;

/*
  The palette the randomiser draws from, split into temperature families.

  Cream counts as neither: it's a highlight rather than a temperature, so
  letting it satisfy "there is a warm colour present" would defeat the recovery
  rule below.
*/
const PALETTE = [
  { token: "--brand-grad-1", family: "warm" },
  { token: "--brand-grad-2", family: "warm" },
  { token: "--brand-grad-3", family: "cool" },
  { token: "--brand-grad-4", family: "cool" },
  { token: "--brand-grad-5", family: "neutral" },
] as const;

type Family = (typeof PALETTE)[number]["family"];

/** The four anchors at rest: evenly stacked, which is the arrangement the
 *  field had before any of this was randomisable. */
const BASE_POSITIONS: [number, number][] = [
  [0, 0.825],
  [0, 0.275],
  [0, -0.275],
  [0, -0.825],
];

/** How long a randomised change takes to cross-fade in. */
const TWEEN_MS = 1600;

/*
  A colour family that gets wiped out by a random draw comes back on its own
  after somewhere in this window, so the field can wander off into all-warm or
  all-cool for a while and still find its way back without another press.
*/
const RECOVERY_MIN_MS = 5000;
const RECOVERY_MAX_MS = 10000;

/*
  Touch gets both of the things a pointer would otherwise be doing for it.

  Without this the field on a phone only has its own seed drift: nothing leans
  it, and the button that reshuffles the bands is desktop-only, so the whole
  interactive half of the effect simply isn't there. So on a device with no
  hover the pointer is driven along a wandering path of its own, and the field
  reshuffles itself on a timer.
*/
const AUTO_REACH = 0.85;
const AUTO_FREQ = 0.021;
const AUTO_SHUFFLE_MIN_MS = 9000;
const AUTO_SHUFFLE_MAX_MS = 16000;

/*
  A hybrid device can report no hover and still have a mouse attached. Real
  pointer input this recently takes precedence, so the automatic path doesn't
  fight someone actually moving a cursor.
*/
const POINTER_GRACE_MS = 3000;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Smoothstep, so a randomise eases in and out rather than starting and
 *  stopping abruptly. */
function ease(t: number) {
  return t * t * (3 - 2 * t);
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

/*
  How far an anchor may sit from centre, and the least it must travel on a
  press. The minimum is the important one: without it a fresh uniform draw can
  land next to where the anchor already was, and that press does nothing
  visible.
*/
const SHIFT_X = 0.7;
const SHIFT_Y = 1.2;
const MIN_SHIFT = 0.85;

/** A palette index other than the one this slot already holds. */
function pickOtherIndex(current: number) {
  const i = randomInt(PALETTE.length - 1);
  return i >= current ? i + 1 : i;
}

/**
 * A new anchor at least MIN_SHIFT away from the current one. Rejection
 * sampling rather than adding a fixed offset to the old position: an offset
 * would need clamping back into range, which quietly shrinks the move for any
 * anchor already near an edge, exactly where a big move reads best. Falls back
 * to the furthest of the attempts so this always terminates.
 */
function pickAnchor(from: number[]): number[] {
  let best: number[] = from;
  let bestDistance = -1;

  for (let attempt = 0; attempt < 12; attempt++) {
    const candidate = [
      (Math.random() * 2 - 1) * SHIFT_X,
      (Math.random() * 2 - 1) * SHIFT_Y,
    ];
    const distance = Math.hypot(candidate[0] - from[0], candidate[1] - from[1]);
    if (distance >= MIN_SHIFT) return candidate;
    if (distance > bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }

  return best;
}

export function HeroGradient({
  onUnsupported,
  randomizeRef,
}: {
  onUnsupported: () => void;
  /** Filled in with a function that reshuffles the field, for the button in
   *  the hero to call. */
  randomizeRef?: React.MutableRefObject<(() => void) | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const failedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { antialias: false, alpha: false }) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      failedRef.current = true;
      onUnsupported();
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !program) {
      failedRef.current = true;
      onUnsupported();
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Hero gradient link failed:", gl.getProgramInfoLog(program));
      failedRef.current = true;
      onUnsupported();
      return;
    }
    gl.useProgram(program);

    // One full-screen quad.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uResolution = u("u_resolution");
    const uMouse = u("u_mouse");
    const uSeed = u("u_seed");
    const uRotation = u("u_rotation");
    const uOffset = u("u_offset");
    const uLayerMix = u("u_layerMix");
    const uDisplacement = u("u_displacement");
    const uColours = [u("u_c1"), u("u_c2"), u("u_c3"), u("u_c4")];
    const uPositions = [u("u_p1"), u("u_p2"), u("u_p3"), u("u_p4")];

    // Palette straight from the tokens, so globals.css stays the one source.
    const styles = getComputedStyle(document.documentElement);
    const swatches = PALETTE.map((entry) => readColour(styles, entry.token));
    gl.uniform3fv(u("u_bg"), readColour(styles, "--background"));
    gl.uniform3fv(u("u_c5"), readColour(styles, "--brand-grad-5"));
    gl.uniform1f(u("u_scale"), SCALE);
    gl.uniform1f(u("u_noiseSize"), NOISE_SIZE);
    gl.uniform1f(u("u_spread"), SPREAD);
    gl.uniform1f(u("u_grain"), GRAIN);

    /*
      The four slots, each holding which palette entry it shows and where it
      sits. `from` and `to` are what a randomise cross-fades between; `slots`
      is the authority on which palette entry is currently chosen, which is
      what the temperature check below reads.
    */
    const slots = [0, 1, 2, 3];
    const from = {
      colours: slots.map((i) => [...swatches[i]] as number[]),
      positions: BASE_POSITIONS.map((p) => [...p] as number[]),
    };
    const to = {
      colours: from.colours.map((c) => [...c]),
      positions: from.positions.map((p) => [...p]),
    };
    let tween = 1; // 1 = settled.
    let recoveryTimer: ReturnType<typeof setTimeout> | undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** Which temperature families are currently on screen. */
    const familiesPresent = () => {
      const present = new Set<Family>();
      slots.forEach((i) => present.add(PALETTE[i].family));
      return present;
    };

    const beginTween = () => {
      if (reduce) {
        // No cross-fade under reduced motion: the change still happens, it
        // just doesn't slide the anchors across the screen to get there.
        from.colours = to.colours.map((c) => [...c]);
        from.positions = to.positions.map((p) => [...p]);
        tween = 1;
      } else {
        tween = 0;
      }
    };

    /*
      If a whole temperature has been knocked out, put one back after a while.
      Scheduled after every change, including its own, so a recovery that
      happens to wipe out the other family will itself be recovered from.
    */
    const scheduleRecovery = () => {
      clearTimeout(recoveryTimer);
      const present = familiesPresent();
      const missing: Family[] = (["warm", "cool"] as const).filter(
        (f) => !present.has(f)
      );
      if (missing.length === 0) return;

      const delay =
        RECOVERY_MIN_MS + Math.random() * (RECOVERY_MAX_MS - RECOVERY_MIN_MS);
      recoveryTimer = setTimeout(() => {
        const family = missing[randomInt(missing.length)];
        const candidates = PALETTE.map((entry, i) => ({ entry, i })).filter(
          ({ entry }) => entry.family === family
        );
        const pick = candidates[randomInt(candidates.length)].i;
        const slot = randomInt(slots.length);

        // Snapshot where the fade is starting from, or a change landing
        // mid-tween would jump back to the previous target.
        from.colours = to.colours.map((c) => [...c]);
        from.positions = to.positions.map((p) => [...p]);
        slots[slot] = pick;
        to.colours[slot] = [...swatches[pick]];
        beginTween();
        scheduleRecovery();
      }, delay);
    };

    const randomize = () => {
      from.colours = to.colours.map((c) => [...c]);
      from.positions = to.positions.map((p) => [...p]);

      for (let i = 0; i < slots.length; i++) {
        /*
          Both the colour and the anchor are forced to actually change. Drawing
          each freely meant a press could land a slot on the colour it already
          had, or an anchor a hair from where it already was, so a good share
          of presses barely altered the field at all.

          Repeats ACROSS slots are still possible, which is what keeps an
          all-warm or all-cool draw reachable and gives the recovery rule
          something to do; it's only repeating a slot's own previous value
          that's ruled out.
        */
        slots[i] = pickOtherIndex(slots[i]);
        to.colours[i] = [...swatches[slots[i]]];
        to.positions[i] = pickAnchor(to.positions[i]);
      }

      beginTween();
      scheduleRecovery();
    };

    if (randomizeRef) randomizeRef.current = randomize;

    /*
      Touch devices reshuffle themselves, since there's no button for them to
      press. Self-rescheduling with a fresh random delay each time rather than
      a fixed interval, so it doesn't settle into an obvious rhythm.
    */
    const autoDrive = window.matchMedia("(hover: none)").matches && !reduce;
    let shuffleTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleShuffle = () => {
      shuffleTimer = setTimeout(
        () => {
          randomize();
          scheduleShuffle();
        },
        AUTO_SHUFFLE_MIN_MS + Math.random() * (AUTO_SHUFFLE_MAX_MS - AUTO_SHUFFLE_MIN_MS)
      );
    };
    if (autoDrive) scheduleShuffle();

    /*
      Rendered at CSS pixels, not device pixels. On a 2x display that's a
      quarter of the fragment work for a field that is almost entirely soft
      gradient, where the upscale is invisible. Grain is the only thing that
      softens, and it's still plainly there.
    */
    let width = 0;
    let height = 0;
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth));
      const h = Math.max(1, Math.round(canvas.clientHeight));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResolution, w, h);

      // Both of these are functions of the viewport shape and nothing else, so
      // this is the only place they can change.
      const aspect = w / h;
      const mix = Math.min(
        1,
        Math.max(
          0,
          (LAYER_ASPECT_OFF - aspect) / (LAYER_ASPECT_OFF - LAYER_ASPECT_FULL)
        )
      );
      gl.uniform1f(uLayerMix, mix);
      gl.uniform1f(
        uDisplacement,
        DISPLACEMENT + (DISPLACEMENT_LAYERED - DISPLACEMENT) * mix
      );
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Pointer in -1..1, y flipped to match clip space.
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let lastPointerAt = -Infinity;
    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      lastPointerAt = performance.now();
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    // Paused while the hero is off-screen: this is a full-viewport fragment
    // shader and there's no reason to run it behind the rest of the page.
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    let seed = 12.7;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!visible) return;

      /*
        With no pointer to follow, walk one around instead. Two incommensurate
        sines per axis, the same trick the orbs used to use: one sine is a
        visible loop, two that don't divide into each other beat against each
        other and wander. It feeds `target`, so it's smoothed by exactly the
        same easing a real cursor gets.
      */
      if (autoDrive && now - lastPointerAt > POINTER_GRACE_MS) {
        const s = now / 1000;
        const tau = Math.PI * 2;
        target.x =
          AUTO_REACH *
          (Math.sin(s * AUTO_FREQ * tau) * 0.6 + Math.sin(s * AUTO_FREQ * 2.7 * tau + 1.3) * 0.4);
        target.y =
          AUTO_REACH *
          (Math.sin(s * AUTO_FREQ * 1.4 * tau + 2.1) * 0.6 +
            Math.sin(s * AUTO_FREQ * 3.3 * tau + 0.7) * 0.4);
      }

      const k = 1 - Math.exp(-dt * POINTER_EASE);
      eased.x += (target.x - eased.x) * k;
      eased.y += (target.y - eased.y) * k;

      if (!reduce) seed += dt * SEED_SPEED;

      /*
        Colours and anchors are pushed every frame rather than only while a
        tween is running. They're ten cheap uniform writes, and doing it
        unconditionally means a resize, a context restore or a randomise landing
        on the same frame can't leave the GPU holding a stale set.
      */
      if (tween < 1) tween = Math.min(1, tween + (dt * 1000) / TWEEN_MS);
      const t = ease(tween);
      for (let i = 0; i < 4; i++) {
        gl.uniform3f(
          uColours[i],
          lerp(from.colours[i][0], to.colours[i][0], t),
          lerp(from.colours[i][1], to.colours[i][1], t),
          lerp(from.colours[i][2], to.colours[i][2], t)
        );
        gl.uniform2f(
          uPositions[i],
          lerp(from.positions[i][0], to.positions[i][0], t),
          lerp(from.positions[i][1], to.positions[i][1], t)
        );
      }

      resize();
      gl.uniform1f(uSeed, seed);
      gl.uniform2f(uMouse, eased.x, eased.y);
      // A slow turn and drift on top of the warp, so the composition itself
      // travels instead of churning in place.
      gl.uniform1f(uRotation, reduce ? 0.4 : seed * 0.55);
      gl.uniform2f(uOffset, Math.sin(seed * 0.7) * 0.28, Math.cos(seed * 0.53) * 0.22);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // One frame regardless, so reduced-motion users still get the field.
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(recoveryTimer);
      clearTimeout(shuffleTimer);
      if (randomizeRef) randomizeRef.current = null;
      observer.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [onUnsupported, randomizeRef]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
