


import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";


function Header() {

  
  return (
    <header
      className={styles.header}
      style={{
        backgroundColor: "#5A2D91", 
        color: "#FFFFFF",          
      }}
    >
      <div className={styles.headerContent}>
        
      
        <div className={styles.logoSection}>
          <div className={styles.logo}>BallTalk 🏈</div>
        </div>

       
        <nav className={styles.nav}>
      
          <Link to="/news" className={styles.navLink}>
            <span className={styles.navIcon}>📰</span>
            News
          </Link>

         
          <Link to="/teamtalk" className={styles.navLink}>
            <span className={styles.navIcon}>💬</span>
            TeamTalk
          </Link>

 
          <Link to="/highlights" className={styles.navLink}>
            <span className={styles.navIcon}>🎥</span>
            Highlights
          </Link>
        </nav>

      </div>
    </header>
  );
}


export default Header;
