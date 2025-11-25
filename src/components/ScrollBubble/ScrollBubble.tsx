import styles from "./ScrollBubble.module.scss";

// https://www.svgrepo.com/svg/486227/down-arrow-backup-2
import downArrow from "@assets/down-arrow-backup-2-svgrepo-com.svg";

export default function ScrollBubble() {

    const handleClick = () => {
        const el = document.querySelector('#content > main');
        if (!el) return;
        console.log(el);

        const top = el.getBoundingClientRect().top + window.scrollY - 40;

        window.scrollTo({
            top,
            behavior: "smooth",
        });
    };

    return (
        <div className={styles.scrollBubble} onClick={handleClick} title="Click to scroll down" >
            <img src={downArrow} alt="Scroll down" width="50" height="50" />
        </div>
    );
}