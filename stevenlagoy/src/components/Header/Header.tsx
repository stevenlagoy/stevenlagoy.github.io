import styles from "./Header.module.scss";
import ThemeToggle from "../ThemeToggle";
import { useEffect } from "react";

export default function Header() {
    useEffect(() => {
        const header = document.querySelector("header");
        const onScroll = () => {
            const scroll = window.scrollY;
            const maxScroll = window.innerHeight / 2;
            const progress = Math.min(scroll / maxScroll, 1);
            const startHeight = window.innerHeight;
            const endHeight = window.innerHeight * 0.05;
            if (header) {
                header.style.height = `${startHeight - (startHeight - endHeight) * progress}px`;
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`${styles.header}`}>
            <h1 className={styles.headerText}>Steven LaGoy</h1>
            <ThemeToggle />
        </header>
    )
}