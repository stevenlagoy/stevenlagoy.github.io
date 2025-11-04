import styles from "./Header.module.scss";

export default function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.headerText}>Steven LaGoy</h1>
        </header>
    )
}