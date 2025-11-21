import styles from "./Header.module.scss";
import ThemeToggle from "../ThemeToggle";
import headshot from "@assets/headshot.png";
// https://www.svgrepo.com/svg/479773/email-8
import emailIcon from "@assets/icons/email-8-svgrepo-com.svg";
// https://www.svgrepo.com/svg/509923/facebook
import facebookIcon from "@assets/icons/facebook-svgrepo-com.svg";
// https://www.svgrepo.com/svg/488590/github
import githubIcon from "@assets/icons/github-svgrepo-com.svg";
// https://www.svgrepo.com/svg/504546/linkedin
import linkedinIcon from "@assets/icons/linkedin-svgrepo-com.svg";

export default function Header() {

    const linkIconDimension = 35;

    return (
        <header className={styles.header}>
            <div className={styles.profile}>
                <img src={headshot} alt="Profile" width="75" height="75" />
                <h1 className={styles.headerText}>Steven LaGoy</h1>
                <div className={styles.profileLinks}>
                    <div className={styles.emailLink}>
                        <a href="mailto:stevenlagoy@gmail.com">
                            <img src={emailIcon} alt="Email" width={linkIconDimension} height={linkIconDimension} />
                        </a>
                    </div>
                    <div className={styles.githubLink}>
                        <a href="https://github.com/stevenlagoy">
                            <img src={githubIcon} alt="GitHub" width={linkIconDimension} height={linkIconDimension} />
                        </a>
                    </div>
                    <div className={styles.linkedinLink}>
                        <a href="https://www.linkedin.com/in/steven-lagoy/">
                            <img src={linkedinIcon} alt="LinkedIn" width={linkIconDimension} height={linkIconDimension} />
                        </a>
                    </div>
                    <div className={styles.facebookLink}>
                        <a href="https://www.facebook.com/profile.php?id=100094507308928">
                            <img src={facebookIcon} alt="Facebook" width={linkIconDimension} height={linkIconDimension} />
                        </a>
                    </div>
                </div>
            </div>
            <ThemeToggle />
        </header>
    )
}