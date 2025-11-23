import styles from "./HomePage.module.scss";
import Navigator from "@/components/Navigator";

import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import SkillsTechnologies from "@/components/SkillsTechnologies";


export default function HomePage() {
    return (
        <>
            <Navigator
                targets={[
                    { id: "about-me" },
                    { id: "projects" },
                    { id: "skills-technologies" },
                ]}
            />
            <main className={styles.homeMain}>
                <AboutMe />
                <Projects />
                <SkillsTechnologies />
            </main>
        </>
    );
}