import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    // Design expects check to mean 'night/dark', unchecked to mean 'day/light' based on the CSS logic
    // "input:checked + .slider" -> black background/stars (Night)
    // Default unchecked -> blue background/clouds (Day)
    // BUT the provided CSS "input:checked + .slider" sets background to black (Night)
    // My app default is 'dark'. 
    // If theme is 'dark', we want the toggle to be checked (Night mode).
    // If theme is 'light', we want the toggle to be unchecked (Day mode).
    const isDark = theme === 'dark';

    return (
        <label className={styles.switch} aria-label="Toggle Dark Mode">
            <input
                type="checkbox"
                className={styles.input}
                checked={isDark}
                onChange={toggleTheme}
            />
            <div className={`${styles.slider} ${styles.round}`}>

                {/* Sun/Moon Wrapper */}
                <div className={styles.sunMoon}>
                    {/* Moon Dots (Visible only in dark mode via CSS) */}
                    <svg className={`${styles.moonDot} ${styles.moonDot1}`} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" />
                    </svg>
                    <svg className={`${styles.moonDot} ${styles.moonDot2}`} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" />
                    </svg>
                    <svg className={`${styles.moonDot} ${styles.moonDot3}`} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50" />
                    </svg>
                </div>

                {/* Sun Light Rays (Visible in Day mode) */}
                {/* We use simple paths or circles for rays as placeholders if actual svg paths aren't critical, 
            but for "rays" usually they are radial. Let's make them circles for simplicity or simple stars. */}
                <svg className={styles.lightRay1} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50" />
                </svg>
                <svg className={styles.lightRay2} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50" />
                </svg>
                <svg className={styles.lightRay3} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50" />
                </svg>

                {/* Clouds (Visible in Day mode) */}
                {/* Using simple cloud-like paths */}
                <svg className={`${styles.cloudLight} ${styles.cloud1}`} viewBox="0 0 100 100">
                    <path d="M25,60 a20,20 0 0,1 0,-40 a20,20 0 0,1 50,0 a20,20 0 0,1 0,40 z" />
                </svg>
                <svg className={`${styles.cloudLight} ${styles.cloud2}`} viewBox="0 0 100 100">
                    <path d="M25,60 a20,20 0 0,1 0,-40 a20,20 0 0,1 50,0 a20,20 0 0,1 0,40 z" />
                </svg>
                <svg className={`${styles.cloudLight} ${styles.cloud3}`} viewBox="0 0 100 100">
                    <path d="M25,60 a20,20 0 0,1 0,-40 a20,20 0 0,1 50,0 a20,20 0 0,1 0,40 z" />
                </svg>

                <svg className={`${styles.cloudDark} ${styles.cloud4}`} viewBox="0 0 100 100">
                    <path d="M25,60 a20,20 0 0,1 0,-40 a20,20 0 0,1 50,0 a20,20 0 0,1 0,40 z" />
                </svg>
                <svg className={`${styles.cloudDark} ${styles.cloud5}`} viewBox="0 0 100 100">
                    <path d="M25,60 a20,20 0 0,1 0,-40 a20,20 0 0,1 50,0 a20,20 0 0,1 0,40 z" />
                </svg>
                <svg className={`${styles.cloudDark} ${styles.cloud6}`} viewBox="0 0 100 100">
                    <path d="M25,60 a20,20 0 0,1 0,-40 a20,20 0 0,1 50,0 a20,20 0 0,1 0,40 z" />
                </svg>

                {/* Stars (Visible in Night mode) */}
                <div className={styles.stars}>
                    <svg className={`${styles.star} ${styles.star1}`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <svg className={`${styles.star} ${styles.star2}`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <svg className={`${styles.star} ${styles.star3}`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <svg className={`${styles.star} ${styles.star4}`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>

            </div>
        </label>
    );
};

export default ThemeToggle;
