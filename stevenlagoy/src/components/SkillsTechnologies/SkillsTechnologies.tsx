import styles from "./SkillsTechnologies.module.scss";
import { skills_technologies } from "@/data/skills_technologies";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SkillsTechnologies() {
    const [categories, setCategories] = useState<Set<string>>(() => new Set());
    interface SkillTechnology {
        name: string; // Name of the technology. "Java", "C++", "GitHub"
        img: string; // An image icon representing the technology
        background: string; // Background color of the icon badge (border color will be opposite)
        category: string; // Experience category
        link: string; // Link to a project using the technology
    }

    const [skillsTechnologies, setSkillsTechnologies] = useState<SkillTechnology[]>([]);

    useEffect(() => {
        setCategories(new Set(Object.keys(skills_technologies)));
        const temp: SkillTechnology[] = [];
        Object.keys(skills_technologies).forEach((c) => {
            const cKey = c as keyof typeof skills_technologies; // Reassure the transpiler that I know what I'm doing
            skills_technologies[cKey].forEach((st: { name: string; img: string; background: string, link: string }) => {
                temp.push({
                    name: st.name,
                    img: st.img,
                    background: st.background,
                    category: c,
                    link: st.link,
                });
            });
        });
        setSkillsTechnologies([...temp]);
    }, []);

    useEffect(() => {console.log(skillsTechnologies)}, [skillsTechnologies]);

    return (
        <section className={styles.skillsTechnologies} id="skills-technologies">
            <h1>Skills & Technologies</h1>
            <p className={styles.subheader}>Click on a skill or technology to see a project using that technology</p>
            {[...categories].map((c, i) => (
                <div className={styles.skillsCategory} key={i}>
                    <h2>{c}</h2>
                    <div className={styles.skills}>
                        {skillsTechnologies.filter((st) => st.category === c).map((st, index) => (
                            <Link to={st.link} className={styles.skill} key={index}>
                                <div className={`${styles.skillImageWrapper} ${st.background === 'white' ? styles.white : styles.black}`}>
                                    <img className={styles.skillImage} src={st.img} alt={st.name} width="20" height="20" />
                                </div>
                                <p className={styles.skillName}>{st.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}