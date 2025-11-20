import styles from "./AboutMe.module.scss";
import photo1 from "@assets/bio_photos/honors.png";
import photo2 from "@assets/bio_photos/bridge.png";
import photo3 from "@assets/bio_photos/tree.png";

export default function AboutMe() {

    const photosSize = 200;

    return (
        <section className={styles.aboutMe}>
            <h1>About Me</h1>
            <div className={styles.bio}>
                <div className={styles.bioText}>
                    <h2>Bio</h2>
                    <p>
                        <b>I'm Steven.</b> I am a computer science student with many interests. I
                        have been fascinated by technology forever and have been coding for 9 years
                        now. I've developed simulations, web applications, video games, robotics
                        controllers, and more. Apart from software development, my hobbies and
                        interests include history, music, geography, political science, martial
                        arts, video games, and soccer.
                    </p>
                </div>
                <div className={styles.photoContainer}><img className={styles.photo} src={photo1} alt="" width={photosSize} height={photosSize} /></div>
            </div>
            <div className={styles.bio}>
                <div className={styles.bioText}>
                    <h2>Past</h2>
                    <p>
                        My first exploration in programming was in middle school. Starting with block
                        and visual coding, I began writing scripts for classes and competitions and
                        soon learned my first Python. In high school, I joined the Robotics team and
                        became the team's lead coder in the same year, writing VEX code in C++. By
                        senior year, I had started to learn Java and toolkits like Swing. Through my
                        first college courses, Java became my preferred coding language, and I have
                        continued to develop in a range of languages including Java, C and C++, Python,
                        Ruby, and JavaScript. Most recently, I have done a lot of web app dev using
                        Vanilla JS, Angular, and React.
                    </p>
                </div>
                <div className={styles.photoContainer}><img className={styles.photo} src={photo3} alt="" width={photosSize} height={photosSize} /></div>
            </div>
            <div className={styles.bio}>
                <div className={styles.bioText}>
                    <h2>Now</h2>
                    <p>
                        I am currently an undergrad student at <a href="https://www.pfw.edu/">Purdue
                        University Fort Wayne</a>. I will graduate in Spring of 2026 with a dachelor's
                        in Computer Science. In Fall of 2025, I also started earning a postgraduate
                        degree through dual-enrollment. I hope to earn my master's degree in Computer
                        Science in Spring of 2027. I am an honors student with a cumulative GPA of 3.70.
                    </p>
                </div>
                <div className={styles.photoContainer}><img className={styles.photo} src={photo2} alt="" width={photosSize} height={photosSize} /></div>
            </div>
        </section>
    );
}