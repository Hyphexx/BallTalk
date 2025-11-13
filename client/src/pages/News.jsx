import React, { useState, useEffect } from "react"; // Import React core and hooks
import axios from "axios"; // Import Axios for HTTP requests
import styles from "./News.module.css"; // Import CSS module styles

function News() {
  // 🧠 STATE HOOKS
  const [selectedTeam, setSelectedTeam] = useState("Ravens"); // The currently selected team name
  const [articles, setArticles] = useState([]); // Array of fetched news articles
  const [loading, setLoading] = useState(true); // Loading state to show skeletons/spinners
  const [error, setError] = useState(null); // Error message if fetching fails

  // 🏈 List of all NFL teams (alphabetically sorted for dropdown)
  const teams = [
    "Ravens", "Steelers", "Browns", "Bengals",
    "Chiefs", "Raiders", "Broncos", "Chargers",
    "Bills", "Dolphins", "Patriots", "Jets",
    "Cowboys", "Eagles", "Giants", "Commanders",
    "Packers", "Vikings", "Bears", "Lions",
    "49ers", "Seahawks", "Rams", "Cardinals"
  ].sort();

  // 📡 Function to fetch news from backend
  const fetchNews = async (teamName) => {
    setLoading(true); // Begin loading state before fetch
    setError(null); // Reset error before new request

    try {
      // Fetch articles from backend using team name
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/news/${teamName}`
      );

      // Store returned data in state
      setArticles(res.data || []);
    } catch (err) {
      console.error("Error fetching news:", err);
      // Set a friendly fallback message on failure
      setError("Failed to load latest news. Showing sample articles.");
      setArticles([]); // Clear previous results
    } finally {
      setLoading(false); // End loading state (✅ ensures setLoading is defined and used properly)
    }
  };

  // 🧭 useEffect to fetch data whenever the selected team changes
  useEffect(() => {
    fetchNews(selectedTeam);
  }, [selectedTeam]);

  // ⚙️ Handler for changing selected team
  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
  };

  // 🎨 UI rendering logic
  return (
    <div className={styles.page}>
      {/* Header section */}
      <div className={styles.header}>
        <h1 className={styles.title}>NFL News</h1>
        <p className={styles.subtitle}>Latest updates from your favorite teams</p>

        {/* Dropdown selector for teams */}
        <div className={styles.selectorContainer}>
          <label htmlFor="team-select" className={styles.label}>
            Team:
          </label>
          <select
            id="team-select"
            value={selectedTeam}
            onChange={handleTeamChange}
            className={styles.dropdown}
          >
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className={styles.errorBanner}>
          {error}
        </div>
      )}

      {/* Main container for content */}
      <div className={styles.container}>
        {/* 🕓 Loading skeletons while fetching */}
        {loading ? (
          Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonImage}></div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonBody}></div>
                  <div className={styles.skeletonMeta}></div>
                </div>
              </div>
            ))
        ) : articles.length > 0 ? (
          // 📰 Render each news article
          articles.map((article, i) => (
            <article key={i} className={styles.card}>
              <div className={styles.imageContainer}>
                <img
                  src={article.image}
                  alt={article.title}
                  className={styles.image}
                  onError={(e) => {
                    // Fallback image if article image fails to load
                    e.target.src =
                      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop";
                  }}
                />
              </div>

              <div className={styles.content}>
                <h2 className={styles.articleTitle}>{article.title}</h2>
                <p className={styles.articleBody}>{article.body}</p>

                {/* Meta info */}
                <div className={styles.meta}>
                  <div className={styles.metaLeft}>
                    <span className={styles.site}>{article.site}</span>
                    <span className={styles.time}>{article.timeAgo}</span>
                  </div>
                  <div className={styles.metaRight}>
                    <span className={styles.author}>{article.author}</span>
                  </div>
                </div>

                {/* Read more link */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.readMore}
                >
                  Read full story
                </a>
              </div>
            </article>
          ))
        ) : (
          // 🚫 No articles fallback message
          <div className={styles.noArticles}>
            <h3>No articles found</h3>
            <p>Try selecting a different team or check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default News;
