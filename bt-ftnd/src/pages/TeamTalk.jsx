import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import themes from "../themes/themes";
import styles from "./TeamTalk.module.css";

const teamSubreddits = {
  "Ravens": "ravens",
  "49ers": "49ers",
  "Bengals": "bengals",
  "Bills": "buffalobills",
  "Broncos": "DenverBroncos",
  "Browns": "Browns",
  "Buccaneers": "buccaneers",
  "Cardinals": "AZCardinals",
  "Chargers": "Chargers",
  "Chiefs": "KansasCityChiefs",
  "Colts": "Colts",
  "Cowboys": "cowboys",
  "Dolphins": "miamidolphins",
  "Eagles": "eagles",
  "Falcons": "falcons",
  "Giants": "NYGiants",
  "Jaguars": "Jaguars",
  "Jets": "nyjets",
  "Lions": "detroitlions",
  "Packers": "GreenBayPackers",
  "Panthers": "panthers",
  "Patriots": "Patriots",
  "Raiders": "raiders",
  "Rams": "LosAngelesRams",
  "Saints": "Saints",
  "Seahawks": "Seahawks",
  "Steelers": "steelers",
  "Texans": "Texans",
  "Titans": "Tennesseetitans",
  "Bears": "CHIBears",
  "Commanders": "Commanders"
};

function TeamTalk() {
  const { team, setTeam } = useContext(ThemeContext);
  const [selectedTeam, setSelectedTeam] = useState(team || "Ravens");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const saveFavoriteTeam = (teamName) => {
    localStorage.setItem("favoriteTeam", teamName);
  };

  const loadFavoriteTeam = () => {
    return localStorage.getItem("favoriteTeam") || "Ravens";
  };

  const fetchPosts = async (teamName, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setRefreshing(isRefresh);
    setError(null);

    try {
      console.log(`🚀 Fetching posts for: ${teamName}`);
      const response = await axios.get(
        `http://localhost:5000/api/reddit/team/${encodeURIComponent(teamName)}`,
        { timeout: 10000 }
      );

      if (response.data.success) {
        setPosts(response.data.data || []);
        console.log(`✅ Loaded ${response.data.data?.length || 0} posts`);
      } else {
        throw new Error(response.data.message || "Failed to fetch posts");
      }
    } catch (err) {
      console.error("❌ API Error:", err);

      let errorMessage = "Failed to load posts";
      if (err.code === "NETWORK_ERROR" || err.code === "ECONNREFUSED") {
        errorMessage = "Backend server not running. Start: 'npm start' in backend folder";
      } else if (err.response?.status === 404) {
        errorMessage = `No subreddit found for ${teamName}`;
      } else if (err.response?.status === 429) {
        errorMessage = "Reddit rate limit hit. Wait 60 seconds.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message?.includes("timeout")) {
        errorMessage = "Request timeout. Check your connection.";
      }

      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const favoriteTeam = loadFavoriteTeam();
    setSelectedTeam(favoriteTeam);
    setTeam(favoriteTeam);
    fetchPosts(favoriteTeam);
  }, []);

  useEffect(() => {
    if (selectedTeam && selectedTeam !== team) {
      setTeam(selectedTeam);
      saveFavoriteTeam(selectedTeam);
      fetchPosts(selectedTeam);
    }
  }, [selectedTeam]);

  const handleTeamChange = (newTeam) => setSelectedTeam(newTeam);
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchPosts(selectedTeam);
  };
  const handleRefresh = () => fetchPosts(selectedTeam, true);

  const openRedditPost = (permalink, event) => {
    event.stopPropagation();
    window.open(permalink, "_blank", "noopener,noreferrer");
  };

  const getTeamOptions = () => Object.keys(themes).sort();
  const currentTheme = themes[selectedTeam] || themes.Ravens;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

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
            <p className={styles.heroSubtitle}>
              Real-time discussions from NFL team subreddits
            </p>

           
          </div>

         
          <div className={styles.teamSelectorContainer}>
            <div className={styles.selectorHeader}>
              <span className={styles.selectorIcon}>🏈</span>
              <span>Select Your Team</span>
            </div>

            <select
              value={selectedTeam}
              onChange={(e) => handleTeamChange(e.target.value)}
              className={styles.teamSelector}
              style={{
                borderColor: currentTheme.text,
                color: currentTheme.primary,
                background: "rgba(255, 255, 255, 0.95)",
              }}
            >
              {getTeamOptions().map((teamName) => (
                <option key={teamName} value={teamName}>
                  {teamName}
                </option>
              ))}
            </select>

            <div className={styles.selectedTeamInfo}>
              <span className={styles.subredditTag}>
                r/{teamSubreddits[selectedTeam]}
              </span>
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

      {/* ===== MAIN CONTENT ===== */}
      <div className={styles.mainContainer}>
        {loading && !refreshing && (
          <div className={styles.loadingState}>
            <div className={styles.loadingAnimation}>
              <div className={styles.footballSpinner}></div>
            </div>
            <h3>Loading Community Posts</h3>
            <p>Fetching latest from r/{teamSubreddits[selectedTeam]}...</p>
          </div>
        )}

        {error && !loading && (
          <div className={styles.errorState}>
            <div className={styles.errorIllustration}>🚨</div>
            <h3>Connection Issue</h3>
            <p>{error}</p>
            <div className={styles.errorActions}>
              <button onClick={handleRetry} className={styles.primaryButton}>
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className={styles.secondaryButton}
              >
                Reload Page
              </button>
            </div>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>📭</div>
            <h3>No Posts Available</h3>
            <p>No recent posts found for {selectedTeam}'s community.</p>
            <button onClick={handleRetry} className={styles.primaryButton}>
              Check Again
            </button>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className={styles.contentArea}>
           
            <div className={styles.postsGrid}>
              {posts.map((post, index) => (
                <div
                  key={`${post.id}-${index}`}
                  className={styles.postCard}
                  onClick={() => window.open(post.permalink, "_blank")}
                >
                  <div className={styles.postHeader}>
                    <div className={styles.userInfo}>
                      <div
                        className={styles.avatar}
                        style={{ background: currentTheme.primary }}
                      >
                        {post.author?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className={styles.userDetails}>
                        <span className={styles.username}>u/{post.author}</span>
                        <span className={styles.timestamp}>{post.timeAgo}</span>
                      </div>
                    </div>
                    <div className={styles.domainTag}>{post.domain}</div>
                  </div>

                  <div className={styles.postContent}>
                    <h3 className={styles.postTitle}>{post.title}</h3>

                    {post.image && (
                      <div className={styles.imageContainer}>
                        <img
                          src={post.image}
                          alt="Post content"
                          className={styles.postImage}
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className={styles.postFooter}>
                    <div className={styles.engagement}>
                      <div
                        className={styles.engagementItem}
                        onClick={(e) => openRedditPost(post.permalink, e)}
                      >
                        <span className={styles.engagementIcon}>⬆️</span>
                        <span>{formatNumber(post.score)}</span>
                      </div>
                      <div
                        className={styles.engagementItem}
                        onClick={(e) => openRedditPost(post.permalink, e)}
                      >
                        <span className={styles.engagementIcon}>💬</span>
                        <span>{formatNumber(post.comments)}</span>
                      </div>
                    </div>
                    <button
                      className={styles.openButton}
                      onClick={(e) => openRedditPost(post.permalink, e)}
                      style={{
                        background: currentTheme.primary,
                        color: currentTheme.text,
                      }}
                    >
                      Open in Reddit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {refreshing && (
              <div className={styles.refreshOverlay}>
                <div className={styles.refreshSpinner}></div>
                <span>Refreshing feed...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamTalk;
