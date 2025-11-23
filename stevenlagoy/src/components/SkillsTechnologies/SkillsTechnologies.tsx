import styles from "./SkillsTechnologies.module.scss";
import { skills_technologies } from "@/data/skills_technologies";
import { useState, useEffect } from "react";

export default function SkillsTechnologies() {
    const [categories, setCategories] = useState<Set<string>>(() => new Set());
    interface SkillTechnology {
        name: string;
        img: string;
        category: string;
    }

    const [skillsTechnologies, setSkillsTechnologies] = useState<SkillTechnology[]>([]);

    useEffect(() => {
        setCategories(new Set(Object.keys(skills_technologies)));
        const temp: SkillTechnology[] = [];
        Object.keys(skills_technologies).forEach((c) => {
            skills_technologies[c].forEach((st: { name: string; img: string; }) => {
                temp.push({
                    name: st.name,
                    img: st.img,
                    category: c
                });
            });
        });
        setSkillsTechnologies([...temp]);
        console.log(skillsTechnologies)
    }, []);

    useEffect(() => {console.log(skillsTechnologies)}, [skillsTechnologies]);

    return (
        <div className={styles.skillsTechnologies} id="skills-technologies">
            <h1>Skills & Technologies</h1>
            {[...categories].map((c, i) => (
                <div className={styles.skillsCategory} key={i}>
                    <h2>{c}</h2>
                    {skillsTechnologies.filter((st) => st.category === c).map((st, index) => (
                        <div className={styles.skill} key={index}>
                            <img src={st.img} alt={st.name} width="20" height="20" />
                            <p className={styles.skillName}>{st.name}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}