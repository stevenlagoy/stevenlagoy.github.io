import MandelbrotCanvas from "../MandelbrotCanvas";
import styles from "./Fractal.module.scss";

export default function Fractal() {
    return (
        <div className={styles.fractal}>
            <MandelbrotCanvas />
            <h1 className={styles.title}>Steven LaGoy</h1>
        </div>
    );
}