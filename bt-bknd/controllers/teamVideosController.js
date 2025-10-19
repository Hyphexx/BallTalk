const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const getTeamVideos = async (req, res) => {
  try {
    const { team } = req.query;
    
    if (!team) {
      return res.status(400).json({ 
        msg: 'Team parameter is required',
        example: '/api/team-videos?team=Ravens'
      });
    }

    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key missing');
      return res.status(500).json({ 
        msg: 'YouTube API key not configured'
      });
    }

    console.log(`🎯 Searching for ${team} NFL videos...`);

    // Better search query
    const searchQuery = `${team} NFL highlights 2024`;
    
    const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
    
    // Get current date and date from 3 months ago for recency
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    
    const searchParams = {
      part: 'snippet',
      q: searchQuery,
      type: 'video',
      order: 'date',
      maxResults: 15, // Get more to filter down
      key: YOUTUBE_API_KEY,
      publishedAfter: threeMonthsAgo.toISOString(), // Fixed: Use recent date
      relevanceLanguage: 'en'
    };

    const response = await axios.get(searchUrl, { params: searchParams });
    
    if (!response.data.items || response.data.items.length === 0) {
      console.log(`No videos found for ${team}`);
      return res.json([]);
    }

    console.log(`✅ Found ${response.data.items.length} videos for ${team}`);

    // More flexible filtering
    const teamLower = team.toLowerCase();
    const videos = response.data.items
      .filter(item => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        
        // More flexible matching - team name in title OR description
        const hasTeam = title.includes(teamLower) || description.includes(teamLower);
        const hasFootballContent = title.includes('nfl') || 
                                 title.includes('football') ||
                                 title.includes('highlight') ||
                                 description.includes('nfl') ||
                                 description.includes('football');
        
        return hasTeam && hasFootballContent;
      })
      .slice(0, 10) // Limit to 10 videos
      .map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        url: `https://www.youtube.com/embed/${item.id.videoId}`,
        watchUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));

    console.log(`🎯 Final: ${videos.length} videos for ${team}`);
    
    res.json(videos);

  } catch (error) {
    console.error('Error fetching team videos:', error.message);
    
    if (error.response) {
      console.error('YouTube API Error:', error.response.data);
    }
    
    // Return empty array instead of error for frontend compatibility
    res.json([]);
  }
};

module.exports = { getTeamVideos };