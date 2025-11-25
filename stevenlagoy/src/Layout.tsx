import styles from "./Layout.module.scss";

import { useEffect, type ReactNode } from 'react';
import Fractal from "./components/Fractal";
import Header from "./components/Header";

export const Layout = ({ children }: { children: ReactNode }) => {

  const parallax_speed = 0.1;

  useEffect(() => {
    const el = document.getElementById("content") as HTMLElement | null;
    if (!el) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const offset = window.scrollY * parallax_speed;
          el.style.backgroundPositionY = `-${offset}px`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallax_speed]);

  return (
    <>
      <Fractal />
      <Header />
      <div className={styles.content} id="content">
        {children}
      </div>
    </>
  );
};