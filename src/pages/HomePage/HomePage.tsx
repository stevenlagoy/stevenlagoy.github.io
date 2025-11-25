import styles from "./HomePage.module.scss";
import Navigator from "@/components/Navigator";

import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import SkillsTechnologies from "@/components/SkillsTechnologies";
import ContactMe from "@/components/ContactMe";

export default function HomePage() {
    return (
        <>
            <Navigator
                targets={[
                    { id: "about-me" },
                    { id: "projects" },
                    { id: "skills-technologies" },
                    { id: "contact-me" },
                ]}
            />
            <main className={styles.homeMain}>
                <AboutMe />
                <Projects />
                <SkillsTechnologies />
                <ContactMe />
            </main>
        </>
    );
}