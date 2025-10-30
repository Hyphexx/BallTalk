import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./News.module.css";

function News() {
  const [selectedTeam, setSelectedTeam] = useState("Ravens");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const teams = [
    "Ravens", "Steelers", "Browns", "Bengals", 
    "Chiefs", "Raiders", "Broncos", "Chargers",
    "Bills", "Dolphins", "Patriots", "Jets",
    "Cowboys", "Eagles", "Giants", "Commanders",
    "Packers", "Vikings", "Bears", "Lions",
    "49ers", "Seahawks", "Rams", "Cardinals"
  ].sort();

  const fetchNews = async (teamName) => {
    setLoading(true);
    setError(null);
    try {
     const res = await axios.get(
  `${process.env.REACT_APP_API_BASE_URL}/news/${teamName}`
);

      setArticles(res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load latest news. Showing sample articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedTeam);
  }, [selectedTeam]);

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>NFL News</h1>
        <p className={styles.subtitle}>Latest updates from your favorite teams</p>
        
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

      {error && (
        <div className={styles.errorBanner}>
          {error}
        </div>
      )}

      <div className={styles.container}>
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
          articles.map((article, i) => (
            <article key={i} className={styles.card}>
              <div className={styles.imageContainer}>
                <img 
                  src={article.image} 
                  alt={article.title}
                  className={styles.image}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop';
                  }}
                />
              </div>
              
              <div className={styles.content}>
                <h2 className={styles.articleTitle}>{article.title}</h2>
                <p className={styles.articleBody}>{article.body}</p>
                
                <div className={styles.meta}>
                  <div className={styles.metaLeft}>
                    <span className={styles.site}>{article.site}</span>
                    <span className={styles.time}>{article.timeAgo}</span>
                  </div>
                  <div className={styles.metaRight}>
                    <span className={styles.author}>{article.author}</span>
                  </div>
                </div>
                
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