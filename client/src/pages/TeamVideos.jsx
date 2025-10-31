import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TeamVideos.module.css";

function TeamVideos() {
  const [selectedTeam, setSelectedTeam] = useState("Cowboys");
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

  const filteredTeams = nflTeams.filter(t =>
    t.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  const fetchTeamVideos = async (teamName) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/team-videos?team=${encodeURIComponent(teamName)}`);
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamVideos(selectedTeam);
  }, [selectedTeam]);

  const openVideo = (url) => window.open(url, "_blank");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>📺 NFL Team Videos</h1>
        <p className={styles.subtitle}>Latest videos from your favorite team</p>
      </div>

      <div className={styles.teamSelector}>
        <input
          type="text"
          placeholder="Search for a team..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        {searchTerm && (
          <div className={styles.teamDropdown}>
            {filteredTeams.slice(0, 8).map((team) => (
              <div
                key={team}
                onClick={() => {
                  setSelectedTeam(team);
                  setSearchTerm("");
                }}
                className={styles.teamOption}
              >
                {team}
              </div>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p>Loading videos...</p>
      ) : videos.length > 0 ? (
        <div className={styles.videosGrid}>
          {videos.map((video) => (
            <div
              key={video.videoId}
              className={styles.videoCard}
              onClick={() => openVideo(video.watchUrl)}
            >
              <img src={video.thumbnail} alt={video.title} className={styles.thumbnail} />
              <h3>{video.title}</h3>
              <p>{video.channelTitle}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No videos found for {selectedTeam}</p>
      )}
    </div>
  );
}

export default TeamVideos;
