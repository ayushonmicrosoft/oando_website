import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

export const ciscoSans = localFont({
  src: [
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeue-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeue-Roman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeue-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/helvetica-neue/HelveticaNeue-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cisco",
  display: "swap",
});
export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
