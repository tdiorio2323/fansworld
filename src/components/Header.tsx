import { useEffect, useState } from "react";
export default function Header() {
  const [scrolled, setS] = useState(false);
  useEffect(() => {
    const onScroll = () => setS(window.scrollY > 8);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "backdrop-blur-md py-1" : "py-3"}`}>
      <div className="mx-auto max-w-7xl px-4">
        <img src="/logo.svg" alt="Cabana" className={`h-8 transition-all ${scrolled ? "scale-90" : "scale-100"}`} />
      </div>
    </header>
  );
}
