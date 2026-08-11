import { JetBrains_Mono, Anton, Bricolage_Grotesque, Archivo } from "next/font/google";

/*
  Throwaway exploration routes for hero design directions. Isolated fonts,
  isolated colors, so nothing here touches the live site theme. Delete once a
  direction is chosen. The <style> hides the real site header so these
  mockups can be judged clean (only applies while an /explore route is mounted).
*/
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", weight: ["400", "500", "700"] });
const anton = Anton({ subsets: ["latin"], variable: "--f-anton", weight: "400" });
const bric = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bric", weight: ["400", "600", "700", "800"] });
const archivo = Archivo({ subsets: ["latin"], variable: "--f-archivo", weight: ["400", "500", "700"] });

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${mono.variable} ${anton.variable} ${bric.variable} ${archivo.variable}`}>
      <style>{`header { display: none !important; }`}</style>
      {children}
    </div>
  );
}
