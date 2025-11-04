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
                    <p className={styles.projectDate}>{projectDate}</p>
                    <p className={styles.technologies}>{technologies}</p>
                    <p className={styles.projectDesc}>{projectDesc}</p>
                </div>
            </Link>
        </div>
    );
}