import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import TeamTalk from "./pages/TeamTalk.jsx";
import News from "./pages/News";
import TeamVideos from "./pages/TeamVideos.jsx"; 


import { ThemeProvider } from "./context/ThemeContext";
import styles from "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className={styles.app}>
          <Routes>
            
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<TeamTalk />} />
                    <Route path="/teamtalk" element={<TeamTalk />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/highlights" element={<TeamVideos />} /> 
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;