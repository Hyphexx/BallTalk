const snoowrap = require('snoowrap');

// Create Reddit client with your credentials
const reddit = new snoowrap({
  userAgent: 'BallTalk/1.0.0 by u/Hyphex__',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
});

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
  "Commanders": "Commanders",
  "Vikings" : "minnesotavikings"
};

const getTimeAgo = (createdUtc) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdUtc;
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return 'long ago';
};

const getPostImage = (post) => {
  try {
    // Check for preview images
    if (post.preview && post.preview.images && post.preview.images[0]) {
      const image = post.preview.images[0].source.url.replace(/&amp;/g, '&');
      if (image && image.startsWith('http')) return image;
    }
    
    // Check for gallery images
    if (post.media_metadata) {
      const firstImageId = Object.keys(post.media_metadata)[0];
      const imageUrl = post.media_metadata[firstImageId]?.s?.u;
      if (imageUrl) return imageUrl.replace(/&amp;/g, '&');
    }
    
    // Check thumbnail (excluding default Reddit thumbnails)
    if (post.thumbnail && 
        post.thumbnail.startsWith('http') && 
        !post.thumbnail.includes('reddit.com/static') &&
        post.thumbnail !== 'self' &&
        post.thumbnail !== 'default' &&
        post.thumbnail !== 'image') {
      return post.thumbnail;
    }
    
    // Check for external link preview
    if (post.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(post.url)) {
      return post.url;
    }
    
    return null;
  } catch (error) {
    console.log('Error getting image:', error);
    return null;
  }
};

exports.getTeamPosts = async (req, res) => {
  try {
    const { team } = req.params;
    
    console.log(`🔍 Fetching posts for team: ${team}`);
    
    if (!team) {
      return res.status(400).json({ 
        success: false,
        message: "Team parameter is required" 
      });
    }

    const subreddit = teamSubreddits[team];

    if (!subreddit) {
      return res.status(404).json({ 
        success: false,
        message: `No subreddit found for team: ${team}` 
      });
    }

    console.log(`🌐 Using snoowrap to fetch from r/${subreddit}`);
    
    // Use snoowrap to get hot posts
    const posts = await reddit.getSubreddit(subreddit).getHot({ limit: 15 });
    
    console.log(`✅ Snoowrap returned ${posts.length} posts`);

    const formattedPosts = posts
      .map((post) => {
        // Skip stickied posts and removed posts
        if (post.stickied || post.removed) return null;
        
        const image = getPostImage(post);
        
        return {
          id: post.id,
          title: post.title,
          url: post.url,
          author: post.author.name,
          score: post.score || 0,
          comments: post.num_comments || 0,
          image: image,
          created: post.created_utc,
          timeAgo: getTimeAgo(post.created_utc),
          permalink: `https://reddit.com${post.permalink}`,
          subreddit: post.subreddit.display_name,
          isSelf: post.is_self,
          isVideo: post.is_video || false,
          domain: post.domain,
          spoiler: post.spoiler || false,
          over_18: post.over_18 || false
        };
      })
      .filter(post => 
        post !== null && 
        post.title && 
        !post.spoiler &&
        !post.over_18
      )
      .slice(0, 12);

    console.log(`📝 Formatted ${formattedPosts.length} posts for frontend`);

    res.json({
      success: true,
      data: formattedPosts,
      team: team,
      subreddit: subreddit,
      count: formattedPosts.length,
      source: 'snoowrap'
    });

  } catch (err) {
    console.error("❌ Snoowrap Error:", err.message);
    console.error("Error details:", err);
    
    if (err.message.includes('401')) {
      return res.status(401).json({ 
        success: false,
        message: "Reddit API authentication failed. Check your credentials in .env file.",
        details: "Verify REDDIT_CLIENT_ID, REDDIT_SECRET, REDDIT_USER, and REDDIT_PASS are correct"
      });
    }
    
    if (err.message.includes('403')) {
      return res.status(403).json({ 
        success: false,
        message: "Access forbidden. The subreddit may be private or banned."
      });
    }
    
    if (err.message.includes('404')) {
      return res.status(404).json({ 
        success: false,
        message: "Subreddit not found or doesn't exist."
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Failed to fetch posts using snoowrap",
      error: err.message
    });
  }
};

// Test endpoint to verify Reddit connection
exports.testRedditConnection = async (req, res) => {
  try {
    console.log('🧪 Testing Reddit connection with snoowrap...');
    
    // Test by fetching from a popular subreddit
    const testPosts = await reddit.getSubreddit('nfl').getHot({ limit: 3 });
    
    res.json({
      success: true,
      message: "Reddit connection successful!",
      credentials: {
        clientId: process.env.REDDIT_CLIENT_ID ? '✅ Set' : '❌ Missing',
        clientSecret: process.env.REDDIT_SECRET ? '✅ Set' : '❌ Missing', 
        username: process.env.REDDIT_USER ? '✅ Set' : '❌ Missing',
        userAgent: '✅ BallTalk/1.0.0'
      },
      testData: {
        subreddit: 'nfl',
        postsReceived: testPosts.length,
        firstPost: testPosts[0] ? testPosts[0].title : 'No posts'
      }
    });
    
  } catch (err) {
    console.error('❌ Reddit connection test failed:', err.message);
    
    res.status(500).json({
      success: false,
      message: "Reddit connection test failed",
      error: err.message,
      troubleshooting: [
        "Check your Reddit credentials in .env file",
        "Verify REDDIT_CLIENT_ID and REDDIT_SECRET are correct",
        "Ensure REDDIT_USER and REDDIT_PASS are correct",
        "Make sure your Reddit app has the right permissions",
        "Check if your Reddit account can access the API"
      ]
    });
  }
};