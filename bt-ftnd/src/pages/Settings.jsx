import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import styles from "./Settings.module.css";

function Settings() {
  const { team, changeTeam } = useContext(ThemeContext);

  const handleSignOut = () => {
    localStorage.removeItem("favTeam");
    window.location.href = "/login";
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      <label className={styles.label}>Favorite Team</label>
      <select
        className={styles.dropdown}
        value={team}
        onChange={(e) => changeTeam(e.target.value)}
      >
        {Object.keys(require("../themes/themes").default).map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <button className={styles.signout} onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}

export default Settings;
