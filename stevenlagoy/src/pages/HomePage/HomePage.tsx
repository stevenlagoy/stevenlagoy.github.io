import styles from "./HomePage.module.scss";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@data/projects";

export default function HomePage() {
    return (
        <div className={styles.projectCards}>
            {projects.map((project, idx) => (
                <ProjectCard
                    key={idx}
                    imgSrc={project.imgSrc}
                    projectName={project.projectName}
                    projectDate={project.projectDate}
                    technologies={project.technologies}
                    projectDesc={project.projectDesc}
                    projectPath={project.projectPath}
                />
            ))}
        </div>
    );
}