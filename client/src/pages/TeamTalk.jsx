import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import themes from "../themes/themes";
import styles from "./TeamTalk.module.css";

const teamSubreddits = {
  "Ravens": "ravens", "49ers": "49ers", "Bengals": "bengals", "Bills": "buffalobills",
  "Broncos": "DenverBroncos", "Browns": "Browns", "Buccaneers": "buccaneers", "Cardinals": "AZCardinals",
  "Chargers": "Chargers", "Chiefs": "KansasCityChiefs", "Colts": "Colts", "Cowboys": "cowboys",
  "Dolphins": "miamidolphins", "Eagles": "eagles", "Falcons": "falcons", "Giants": "NYGiants",
  "Jaguars": "Jaguars", "Jets": "nyjets", "Lions": "detroitlions", "Packers": "GreenBayPackers",
  "Panthers": "panthers", "Patriots": "Patriots", "Raiders": "raiders", "Rams": "LosAngelesRams",
  "Saints": "Saints", "Seahawks": "Seahawks", "Steelers": "steelers", "Texans": "Texans",
  "Titans": "Tennesseetitans", "Bears": "CHIBears", "Commanders": "Commanders"
};

function TeamTalk() {
  const { team, setTeam } = useContext(ThemeContext);
  const [selectedTeam, setSelectedTeam] = useState(team || "Ravens");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


  const saveFavoriteTeam = (teamName) => localStorage.setItem("favoriteTeam", teamName);
  const loadFavoriteTeam = () => localStorage.getItem("favoriteTeam") || "Ravens";

  
  const fetchPosts = async (teamName, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setRefreshing(isRefresh);
    setError(null);

    try {
      console.log(`🚀 Fetching posts for: ${teamName}`);
      const response = await axios.get(`/api/reddit/team/${encodeURIComponent(teamName)}`, {
        timeout: 10000,
      });

      if (response.data.success) {
        setPosts(response.data.data || []);
        console.log(`✅ Loaded ${response.data.data?.length || 0} posts`);
      } else {
        throw new Error(response.data.message || "Failed to fetch posts");
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      let errorMessage = "Failed to load posts.";
      if (err.code === "ECONNREFUSED") errorMessage = "Backend not responding.";
      else if (err.response?.status === 404) errorMessage = `No subreddit found for ${teamName}`;
      else if (err.response?.status === 429) errorMessage = "Rate limit hit. Please wait.";
      else if (err.message?.includes("timeout")) errorMessage = "Request timed out.";
      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  
  useEffect(() => {
    const favorite = loadFavoriteTeam();
    setSelectedTeam(favorite);
    setTeam(favorite);
    fetchPosts(favorite);
  }, []);

  useEffect(() => {
    if (selectedTeam && selectedTeam !== team) {
      setTeam(selectedTeam);
      saveFavoriteTeam(selectedTeam);
      fetchPosts(selectedTeam);
    }
  }, [selectedTeam]);

  const handleTeamChange = (t) => setSelectedTeam(t);
  const handleRefresh = () => fetchPosts(selectedTeam, true);
  const openRedditPost = (permalink, e) => {
    e.stopPropagation();
    window.open(permalink, "_blank", "noopener,noreferrer");
  };

  const currentTheme = themes[selectedTeam] || themes.Ravens;

  const formatNumber = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : n);

  return (
    <div className={styles.page} style={{ background: currentTheme.background }}>
     
      <div
        className={styles.heroSection}
        style={{
          background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
          color: currentTheme.text,
        }}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Team Talk</h1>
            <p className={styles.heroSubtitle}>Live discussions from team subreddits</p>
          </div>

          <div className={styles.teamSelectorContainer}>
            <div className={styles.selectorHeader}>
              <span className={styles.selectorIcon}>🏈</span>
              <span>Select Team</span>
            </div>

            <select
              value={selectedTeam}
              onChange={(e) => handleTeamChange(e.target.value)}
              className={styles.teamSelector}
              style={{ borderColor: currentTheme.text, color: currentTheme.primary }}
            >
              {Object.keys(themes).sort().map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <div className={styles.selectedTeamInfo}>
              <span className={styles.subredditTag}>r/{teamSubreddits[selectedTeam]}</span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={styles.refreshButton}
                style={{ background: currentTheme.text, color: currentTheme.primary }}
              >
                {refreshing ? "🔄" : "↻"} Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContainer}>
        {loading && !refreshing && (
          <div className={styles.loadingState}>
            <div className={styles.footballSpinner}></div>
            <h3>Loading r/{teamSubreddits[selectedTeam]}</h3>
          </div>
        )}

        {error && !loading && (
          <div className={styles.errorState}>
            <div className={styles.errorIllustration}>🚨</div>
            <p>{error}</p>
            <button onClick={() => fetchPosts(selectedTeam)}>Try Again</button>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className={styles.postsGrid}>
            {posts.map((post, i) => (
              <div
                key={i}
                className={styles.postCard}
                onClick={(e) => openRedditPost(post.permalink, e)}
              >
                <h3>{post.title}</h3>
                <p>u/{post.author}</p>
                <span>{formatNumber(post.score)} upvotes</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamTalk;
