import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import CustomCursor from "../components/CustomCursor";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ThemeProvider from "../components/ThemeProvider";

export const metadata = {
  title: "Tales by VIVI | Creative Partner",
  description:
    "Your creative partner for Animation & Imagery. Digital Artists. World-class. Nothing else.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SmoothScroll>
            <CustomCursor />
            <Header />
            {children}
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
