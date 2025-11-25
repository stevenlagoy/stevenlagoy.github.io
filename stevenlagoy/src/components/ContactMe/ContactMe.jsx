import styles from "./ContactMe.module.scss";

// https://www.svgrepo.com/svg/479773/email-8
import emailIcon from "@assets/icons/email-8-svgrepo-com-mono.svg";
// https://www.svgrepo.com/svg/509923/facebook
import facebookIcon from "@assets/icons/facebook-svgrepo-com-mono.svg";
// https://www.svgrepo.com/svg/504388/github
import githubIcon from "@assets/icons/github-svgrepo-com-mono.svg";
// https://www.svgrepo.com/svg/504546/linkedin
import linkedinIcon from "@assets/icons/linkedin-svgrepo-com-mono.svg";

export default function ContactMe() {

    const linkIconDimension = 35;

    return (
        <section className={styles.contactMe} id="contact-me">
            <h1>Contact Me</h1>
            <p className={styles.subheader}>Click a link to contact me or see one of my social profiles</p>
            <div className={styles.contactLink}>
                <a href="mailto:stevenlagoy@gmail.com">
                    <div className={styles.imageWrapper}>
                        <img src={emailIcon} alt="Email" width={linkIconDimension} height={linkIconDimension} />
                    </div>
                    <p>Email:</p><p>stevenlagoy@gmail.com</p>
                </a>
            </div>
            <div className={styles.contactLink}>
                <a href="https://github.com/stevenlagoy">
                    <div className={styles.imageWrapper}>
                        <img src={githubIcon} alt="GitHub" width={linkIconDimension} height={linkIconDimension} />
                    </div>
                    <p>GitHub:</p><p>stevenlagoy</p>
                </a>
            </div>
            <div className={styles.contactLink}>
                <a href="https://www.linkedin.com/in/steven-lagoy/">
                    <div className={styles.imageWrapper}>
                        <img src={linkedinIcon} alt="LinkedIn" width={linkIconDimension} height={linkIconDimension} />
                    </div>
                    <p>LinkedIn:</p><p>steven-lagoy</p>
                </a>
            </div>
            <div className={styles.contactLink}>
                <a href="https://www.facebook.com/profile.php?id=100094507308928">
                    <div className={styles.imageWrapper}>
                        <img src={facebookIcon} alt="Facebook" width={linkIconDimension} height={linkIconDimension} />
                    </div>
                    <p>Facebook:</p><p>Steven LaGoy</p>
                </a>
            </div>
        </section>
    );
}