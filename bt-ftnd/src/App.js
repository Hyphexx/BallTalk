import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Settings from "./pages/Settings";
import TeamTalk from "./pages/TeamTalk.jsx";
import News from "./pages/News";
import TeamVideos from "./pages/TeamVideos.jsx"; // CHANGE THIS LINE
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import { ThemeProvider } from "./context/ThemeContext";
import styles from "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className={styles.app}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<TeamTalk />} />
                    <Route path="/teamtalk" element={<TeamTalk />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/highlights" element={<TeamVideos />} /> {/* CHANGE THIS LINE */}
                    <Route path="/settings" element={<Settings />} />
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