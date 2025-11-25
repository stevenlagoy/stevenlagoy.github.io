import styles from "./TwochrePage.module.scss";

export default function TwochrePage() {
    return (
        <iframe className={styles.twochreFrame}
            src="/twochre/gameScreen.html"
            title="Twochre"
            width="400px"
            height="400px"
            style={{ border:"none" }}
        />
    );
}