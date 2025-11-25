import styles from "./Navigator.module.scss";
import { useEffect, useState } from "react";

export interface NavTarget {
    id: string
}

interface NavigatorProps {
    targets: NavTarget[];
}

export default function Navigator({ targets }: NavigatorProps) {
    const [activeId, setActiveId] = useState<string | null>(null);


    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;

        const headerHeight = document.querySelector("header")?.clientHeight || 0;

        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 40;

        window.scrollTo({
            top,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        targets.forEach((t) => {
            const el = document.getElementById(t.id);
            if (!el) return;

            const headerHeight = document.querySelector("header")?.clientHeight || 0;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(t.id);
                        }
                    });
                },
                {
                    root: null,
                    threshold: 0, // Trigger as soon as any part enters viewport
                    rootMargin: `-${headerHeight}px 0px -50% 0px`,
                }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [targets]);

    return (
        <nav className={styles.navigator}>
            {targets.map((t, i) => (
                <div key={t.id} className={styles.item} title={t.id} >
                    {/* <span className={styles.label}>{t.id}</span> */}
                    <div className={styles.anchorWrapper}>
                        <svg
                            className={styles.anchor}
                            viewBox="0 0 80 75"
                            width="80"
                            height="80"
                            onClick={() => scrollTo(t.id)}
                        >
                            <title>{t.id.replace('-', ' ').toUpperCase()}</title>
                            <circle cx="40" cy="40" r="30" className={t.id === activeId ? styles.activeFill : styles.inactiveFill} />
                        </svg>
                        {i < targets.length - 1 && (
                            <div className={styles.connector} />
                        )}
                    </div>
                </div>
            ))}
        </nav>
    )
}