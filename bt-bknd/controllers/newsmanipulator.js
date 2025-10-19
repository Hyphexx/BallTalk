const axios = require("axios");

// Get NFL news for a team
exports.getNFLNews = async (req, res) => {
  try {
    const { team } = req.params;

    const NEWSAPI_AI_KEY = process.env.NEWSAPI_AI_KEY;
    
    if (!NEWSAPI_AI_KEY) {
      return res.status(500).json({ 
        msg: 'NewsAPI.ai key not configured. Please set NEWSAPI_AI_KEY in .env file.'
      });
    }

    console.log(`📰 Fetching news for ${team} from NewsAPI.ai...`);

    // NewsAPI.ai endpoint and required format
    const url = "https://eventregistry.org/api/v1/article/getArticles";
    
    const requestBody = {
      action: "getArticles",
      keyword: `${team} NFL`,
      articlesPage: 1,
      articlesCount: 20,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      lang: "eng",
      dataType: ["news", "blog"],
      apiKey: NEWSAPI_AI_KEY
    };

    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('NewsAPI.ai response:', response.data);

    // NewsAPI.ai response structure is different
    if (!response.data.articles || !response.data.articles.results) {
      console.log('No articles found in response');
      return res.json(getMockNews(team));
    }

    const rawArticles = response.data.articles.results;

    const articles = rawArticles
      .filter(article => article.title && article.url)
      .map((article) => ({
        title: article.title,
        body: article.body || article.description || 'Click to read more...',
        image: article.image || article.thumbnail || '/api/placeholder/300/200',
        site: article.source?.title || article.source?.uri || 'Unknown Source',
        author: article.author || article.source?.title || 'Unknown Author',
        publishedAt: article.date || article.dateTime || new Date().toISOString(),
        timeAgo: getTimeAgo(article.date || article.dateTime),
        url: article.url
      }));

    console.log(`✅ Found ${articles.length} articles for ${team}`);
    res.json(articles);

  } catch (err) {
    console.error('❌ NewsAPI.ai Error:', err.response?.data || err.message);
    
    // Return mock data as fallback
    const mockArticles = getMockNews(req.params.team);
    res.json(mockArticles);
  }
};

// Helper function to calculate time ago
function getTimeAgo(dateString) {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
}

// Mock data fallback
function getMockNews(team) {
  const currentDate = new Date();
  return [
    {
      title: `${team} Dominate in Recent Game`,
      body: `The ${team} showed incredible performance in their latest matchup, demonstrating strong offensive strategies and solid defense.`,
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&h=200&fit=crop',
      site: 'NFL News',
      author: 'Sports Analyst',
      publishedAt: currentDate.toISOString(),
      timeAgo: '2h ago',
      url: '#'
    },
    {
      title: `Key Player from ${team} Sets New Record`,
      body: `Star player achieves remarkable statistics, breaking previous franchise records in an outstanding display of skill and determination.`,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
      site: 'Football Daily',
      author: 'Game Reporter',
      publishedAt: new Date(currentDate.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      timeAgo: '4h ago',
      url: '#'
    },
    {
      title: `${team} Coaching Strategy Pays Off`,
      body: `The coaching team's innovative approach to this season is already showing promising results and fan approval across the league.`,
      image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=300&h=200&fit=crop',
      site: 'Sports Insider',
      author: 'Team Correspondent',
      publishedAt: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      timeAgo: '1d ago',
      url: '#'
    },
    {
      title: `${team} Fans Rally Behind Team`,
      body: `Massive fan support continues to grow as the team demonstrates strong potential for the championship this season.`,
      image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=300&h=200&fit=crop',
      site: 'Fan Zone',
      author: 'Community Reporter',
      publishedAt: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      timeAgo: '2d ago',
      url: '#'
    }
  ];
}