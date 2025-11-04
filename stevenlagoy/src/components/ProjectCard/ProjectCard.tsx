import styles from "./ProjectCard.module.scss";
import { Link } from "react-router-dom";

type Props = {
    imgSrc: string,
    projectName: string,
    projectDate: string,
    technologies: string,
    projectDesc: string,
    projectPath: string
}

export default function ProjectCard({imgSrc, projectName, projectDate, technologies, projectDesc, projectPath}: Props ) {
    return (
        <div className={styles.projectCard}>
            <Link to={projectPath}>
                <div className={styles.thumbnailWrapper}>
                    <img className={styles.thumbnail} src={imgSrc} width="400px" height="400px" />
                    <div className={styles.overlay}></div>
                    <div className={styles.hoverOverlay}></div>
                    <h2 className={styles.projectName}>{projectName}</h2>
                    <h3 className={styles.projectDate}>{projectDate}</h3>
                    <h3 className={styles.technologies}>{technologies}</h3>
                    <h3 className={styles.projectDesc}>{projectDesc}</h3>
                </div>
            </Link>
        </div>
    );
}