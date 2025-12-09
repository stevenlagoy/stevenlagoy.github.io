import styles from "./Projects.module.scss";

import ProjectCard from "@/components/ProjectCard";
import { projects } from "@data/projects";
import { useEffect, useState } from "react";

export default function Projects() {
    const [categories, setCategories] = useState<Set<string>>(() => new Set());

    useEffect(() => {
        projects.forEach(p => setCategories(prev => { return new Set(prev).add(p.type)}));
    }, []);

    return (
        <section className={styles.projects} id="projects">
            <h1>Projects</h1>
            <p className={styles.subheader}>Hover on a project to see details, and click to see the project</p>
            <div className={styles.projectsContainers}>
                {[...categories].map((category: string, idx: number) => (
                    <div className={styles.categoryContainer} key={idx}>
                        <h2>{category}</h2>
                        <div className={styles.categoryProjects}>
                            {projects.filter(p => p.type === category).map((project, jdx) => (
                                <ProjectCard
                                    key={jdx}
                                    imgSrc={project.imgSrc}
                                    projectName={project.projectName}
                                    projectDate={project.projectDate}
                                    technologies={project.technologies}
                                    projectDesc={project.projectDesc}
                                    projectPath={project.projectPath}
                                    publicPath={project.publicPath}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}