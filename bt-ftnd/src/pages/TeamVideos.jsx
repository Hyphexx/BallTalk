import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TeamVideos.module.css";

function TeamVideos() {
  const [selectedTeam, setSelectedTeam] = useState("Ravens");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const nflTeams = [
    "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
    "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
    "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
    "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
    "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
    "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
    "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
    "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
  ];

  // Filter teams based on search
  const filteredTeams = nflTeams.filter(team =>
    team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchTeamVideos = async (teamName) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/team-videos?team=${teamName}`);
      setVideos(res.data);
      console.log(`Loaded ${res.data.length} videos for ${teamName}`);
    } catch (err) {
      console.error("Error fetching team videos:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamVideos(selectedTeam);
  }, [selectedTeam]);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setSearchTerm("");
  };

  const openVideo = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>📺 NFL Team Videos</h1>
        <p className={styles.subtitle}>Latest videos for your favorite team</p>
      </div>

      {/* Team Search/Select */}
      <div className={styles.teamSelector}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for a team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        {searchTerm && (
          <div className={styles.teamDropdown}>
            {filteredTeams.slice(0, 8).map((team) => (
              <div
                key={team}
                className={styles.teamOption}
                onClick={() => handleTeamSelect(team)}
              >
                {team}
              </div>
            ))}
            {filteredTeams.length === 0 && (
              <div className={styles.noTeams}>No teams found</div>
            )}
          </div>
        )}
        
        <div className={styles.currentTeam}>
          Currently showing: <strong>{selectedTeam}</strong>
        </div>
      </div>

      {/* Videos Grid */}
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loadingGrid}>
            {Array(6).fill().map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonThumbnail}></div>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonChannel}></div>
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className={styles.videosGrid}>
            {videos.map((video) => (
              <div 
                key={video.videoId} 
                className={styles.videoCard}
                onClick={() => openVideo(video.watchUrl)}
              >
                <div className={styles.thumbnailContainer}>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className={styles.thumbnail}
                  />
                  <div className={styles.playOverlay}>
                    <div className={styles.playButton}>▶</div>
                  </div>
                </div>
                
                <div className={styles.videoInfo}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <p className={styles.channel}>{video.channelTitle}</p>
                  <p className={styles.date}>
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noVideos}>
            <div className={styles.noVideosIcon}>📹</div>
            <h3>No videos found for {selectedTeam}</h3>
            <p>Try selecting a different team or check back later.</p>
          </div>
        )}
      </div>

      {/* Quick Team Buttons */}
      <div className={styles.quickTeams}>
        <h4>Popular Teams:</h4>
        <div className={styles.teamButtons}>
          {["Chiefs", "Ravens", "49ers", "Cowboys", "Packers", "Steelers"].map(team => (
            <button
              key={team}
              className={styles.teamButton}
              onClick={() => handleTeamSelect(team)}
            >
              {team}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamVideos;