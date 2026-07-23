"""
Regenerates Hanru_Wehmeyer_CV.pdf.

Reconstructed from the previously-generated PDF's extracted text/layout
(font, size, color, x/baseline-y position for every line, plus the
decorative rule lines), with a single content change: the Stori/NHS
project date line, updated to match index.html's on-site CV section
("Sept 2024-2024 . Stori project, NHS-sponsored").
"""

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

OUTPUT = "Hanru_Wehmeyer_CV.pdf"

TEXT = (0.1059, 0.0941, 0.0824)      # --color-text #1B1815
MUTED = (0.3333, 0.3137, 0.2941)     # --color-text-muted #55504B
ACCENT = (0.8314, 0.3961, 0.2353)    # --color-accent-dark #D4653C
ACCENT_LINE = (0.94902, 0.509804, 0.360784)   # --color-accent #F2825C
RULE = (0.945098, 0.92549, 0.905882)          # --color-bg-alt #F1ECE7

BULLET = "•"

c = canvas.Canvas(OUTPUT, pagesize=A4)
c.setTitle("Hanru Wehmeyer - CV")
c.setAuthor("Hanru Wehmeyer")
c.setSubject("(unspecified)")
c.setKeywords("")


def hline(x0, x1, y, color, width):
    c.setStrokeColorRGB(*color)
    c.setLineWidth(width)
    c.line(x0, y, x1, y)


def text(x, y, s, font, size, color):
    c.setFillColorRGB(*color)
    c.setFont(font, size)
    c.drawString(x, y, s)


# ---------------------------------------------------------------- PAGE 1
LEFT = 62.693
BULLET_X = 74.693
RIGHT = 532.58

text(LEFT, 770.205, "Hanru Wehmeyer", "Helvetica-Bold", 26.0, TEXT)
text(LEFT, 751.205, "UX Designer", "Helvetica-Bold", 13.0, ACCENT)
text(LEFT, 732.705, "Scotland  ·  [PORTFOLIO LINK]  ·  [EMAIL]  ·  [LINKEDIN]",
     "Helvetica", 9.5, MUTED)

hline(LEFT, RIGHT, 719.5998, ACCENT_LINE, 1.6)

text(LEFT, 697.105, "PROFILE", "Helvetica-Bold", 12.5, TEXT)
for y, s in [
    (680.105, "UX Designer shaping how educators manage and understand their students at scale, currently designing admin"),
    (667.105, "tooling at Genio. I default to asking why before how, on feature decisions, on process, on tooling. That same"),
    (654.105, "instinct shapes my view on AI in design: I use it deliberately, but I'm wary of it replacing authentic collaboration"),
    (641.105, "or letting a project drift on assumptions nobody's verified."),
]:
    text(LEFT, y, s, "Helvetica", 9.5, TEXT)

hline(LEFT, RIGHT, 606.5998, RULE, 1.0)

text(LEFT, 615.105, "EXPERIENCE", "Helvetica-Bold", 12.5, TEXT)

text(LEFT, 590.105, "UX Designer, Genio", "Helvetica-Bold", 10.5, TEXT)
text(LEFT, 578.605, "June 2, 2025 – Present  ·  Full-time", "Helvetica-Oblique", 9.0, MUTED)
text(LEFT, 565.005, "Contract title: Junior UX Designer.", "Helvetica-Oblique", 7.6, MUTED)

genio_bullets = [
    ["Played a lead UX role in reaching WCAG 2.1 AA compliance, including a complex redesign of the",
     "audio-capture (“audio bubbles”) interface, balancing colour contrast requirements against cognitive load",
     "through many iterations, with input up to CEO level, and pushed for the specific direction I believed was right",
     "through to a concrete decision."],
    ["Operate as design lead within a cross-functional squad trio (product manager, tech lead, engineering",
     "manager), including stepping up to cover core PM responsibilities during an absence: consolidating scattered",
     "stakeholder input into a single source of truth and driving the squad to a concrete direction during a period of",
     "shifting priorities."],
    ["Introduced a lightweight, asynchronous feedback workflow for the UX team, replacing the in-person “quick",
     "question” habit lost to remote work, structured around clearly framing the problem and narrowing exactly what",
     "feedback is being sought."],
    ["Consistently push teams to interrogate the why behind a feature request or technical shortcut before",
     "committing to a how, keeping decisions grounded in verified user need rather than convenience or assumption."],
    ["Design for Admin's full range of users (internal super admins, organisation admins, account managers),",
     "pushing the platform beyond a purely utilitarian feel toward something considered and pleasant to use."],
    ["Refreshed App Store assets with a sharper, more CTA-driven design than previous versions."],
]
genio_ys = [
    [549.305, 536.705, 524.105, 511.505],
    [495.405, 482.805, 470.205, 457.605],
    [441.505, 428.905, 416.305],
    [400.205, 387.605],
    [371.505, 358.905],
    [342.805],
]
for bullet_lines, ys in zip(genio_bullets, genio_ys):
    for i, (y, s) in enumerate(zip(ys, bullet_lines)):
        if i == 0:
            text(BULLET_X, y, f"{BULLET}  {s}", "Helvetica", 9.3, TEXT)
        else:
            text(BULLET_X, y, s, "Helvetica", 9.3, TEXT)

text(LEFT, 322.505, "UX Research & Prototyping, University of Dundee", "Helvetica-Bold", 10.5, TEXT)
# Client confirmed start date; exact end date unconfirmed (matches index.html cv section)
text(LEFT, 311.005, "Sept 2024–2024  ·  Stori project, NHS-sponsored", "Helvetica-Oblique", 9.0, MUTED)

stori_bullets = [
    ["Selected to continue a 3rd-year concept into a sponsored research project targeting NHS neonatal units,",
     "enabling parents to send recorded audio messages to premature or hospitalised infants."],
    ["Designed low- and high-fidelity prototypes, ran user interviews, analysed findings, and authored a full",
     "research report on impact."],
]
stori_ys = [
    [295.705, 283.105],
    [267.005, 254.405],
]
for bullet_lines, ys in zip(stori_bullets, stori_ys):
    for i, (y, s) in enumerate(zip(ys, bullet_lines)):
        if i == 0:
            text(BULLET_X, y, f"{BULLET}  {s}", "Helvetica", 9.3, TEXT)
        else:
            text(BULLET_X, y, s, "Helvetica", 9.3, TEXT)

hline(LEFT, RIGHT, 220.0998, RULE, 1.0)

text(LEFT, 228.605, "SKILLS", "Helvetica-Bold", 12.5, TEXT)
text(LEFT, 204.605, "Figma  /  Lucidboard  /  Jira (cross-squad)  /  FigJam  /  Adobe Illustrator  /  Adobe Photoshop  /  Claude  / ",
     "Helvetica", 9.5, TEXT)
text(LEFT, 191.605, "Google AI Studio", "Helvetica", 9.5, TEXT)

hline(LEFT, RIGHT, 157.0998, RULE, 1.0)

text(LEFT, 165.605, "EDUCATION", "Helvetica-Bold", 12.5, TEXT)
text(LEFT, 140.605, "BSc (Hons) Digital Interaction Design, 1st Class", "Helvetica-Bold", 10.5, TEXT)
text(LEFT, 129.105, "University of Dundee  ·  2021–2024", "Helvetica-Oblique", 9.0, MUTED)
text(LEFT, 108.605, "HND User Experience Design, A Grade", "Helvetica-Bold", 10.5, TEXT)
text(LEFT, 97.105, "Edinburgh College  ·  2019–2021", "Helvetica-Oblique", 9.0, MUTED)

hline(LEFT, RIGHT, 64.0998, RULE, 1.0)

text(LEFT, 72.605, "ACHIEVEMENTS & INTERESTS", "Helvetica-Bold", 12.5, TEXT)

c.showPage()

# ---------------------------------------------------------------- PAGE 2
text(LEFT, 786.705, "Dundee Uni Men's Hockey 1st XI Captain (2024)", "Helvetica", 9.5, TEXT)
text(LEFT, 768.705,
     "Graphic design  /  Mixed media art  /  Data visualisation  /  Field hockey  /  Travel  /  Video games  /  Music",
     "Helvetica", 9.5, TEXT)

c.showPage()
c.save()
print("wrote", OUTPUT)
