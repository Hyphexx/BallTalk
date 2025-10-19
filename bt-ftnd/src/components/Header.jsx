import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import styles from "./Header.module.css";

function Header() {
  const location = useLocation();
  const { team, theme } = useContext(ThemeContext);
  
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  return (
    <header 
      className={styles.header}
      style={{
        backgroundColor: theme.primary,
        color: theme.text
      }}
    >
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>BallTalk 🏈</div>
          <div className={styles.teamBadge} style={{ background: theme.accent }}>
            {team}
          </div>
        </div>
        
        <nav className={styles.nav}>
          <Link to="/teamtalk" className={styles.navLink}>
            <span className={styles.navIcon}>💬</span>
            TeamTalk
          </Link>
          <Link to="/news" className={styles.navLink}>
            <span className={styles.navIcon}>📰</span>
            News
          </Link>
          <Link to="/highlights" className={styles.navLink}>
            <span className={styles.navIcon}>🎥</span>
            Highlights
          </Link>
          <Link to="/settings" className={styles.navLink}>
            <span className={styles.navIcon}>⚙️</span>
            Settings
          </Link>
        </nav>
        
        <div className={styles.userSection}>
          <div className={styles.userAvatar} style={{ background: theme.accent }}>
            {team?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;