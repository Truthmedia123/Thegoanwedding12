/**
 * Cloudflare Pages Function: Search Google News
 * GET /api/news/search?q=vendor+name
 * Returns news articles from Google News RSS (100% FREE)
 */

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
  image?: string;
}

export async function onRequestGet(context: { request: Request }) {
  const { request } = context;

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return new Response(JSON.stringify({ 
        error: 'q parameter is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`📰 Searching Google News for: ${query}`);

    // Try multiple search strategies to find articles
    const searchStrategies = [
      query, // Exact vendor name
      `${query} Goa`, // With location
      `${query} wedding`, // With wedding
      `${query} India`, // With country
    ];

    let xml = '';
    let searchQuery = query;

    // Try each strategy until we find articles
    for (const strategy of searchStrategies) {
      console.log(`🔍 Trying search: ${strategy}`);
      
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(strategy)}&hl=en-IN&gl=IN&ceid=IN:en`;

      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (response.ok) {
        const responseXml = await response.text();
        
        // Check if this strategy found articles
        const hasArticles = responseXml.includes('<item>');
        
        if (hasArticles) {
          xml = responseXml;
          searchQuery = strategy;
          console.log(`✅ Found articles with strategy: ${strategy}`);
          break;
        } else {
          console.log(`⚠️ No articles found with: ${strategy}`);
        }
      }
    }

    if (!xml) {
      console.log(`❌ No articles found with any search strategy`);
      return new Response(JSON.stringify({ 
        articles: [],
        query: searchQuery,
        message: 'No news articles found for this vendor'
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Parse RSS XML
    const articles: NewsArticle[] = [];
    const itemMatches = xml.matchAll(/<item>(.*?)<\/item>/gs);

    console.log(`📄 Parsing XML response...`);

    for (const match of itemMatches) {
      const item = match[1];
      
      // Extract title (try both CDATA and plain text)
      let titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      if (!titleMatch) {
        titleMatch = item.match(/<title>(.*?)<\/title>/);
      }
      const title = titleMatch ? titleMatch[1] : '';
      
      // Extract link
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const link = linkMatch ? linkMatch[1].trim() : '';
      
      // Extract publication date
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      const pubDate = pubDateMatch ? pubDateMatch[1] : new Date().toISOString();
      
      // Extract source (from title - Google News format: "Title - Source")
      const sourceParts = title.split(' - ');
      const source = sourceParts.length > 1 ? sourceParts[sourceParts.length - 1] : 'Google News';
      const cleanTitle = sourceParts.length > 1 ? sourceParts.slice(0, -1).join(' - ') : title;
      
      // Extract description (try both CDATA and plain text)
      let descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s);
      if (!descMatch) {
        descMatch = item.match(/<description>(.*?)<\/description>/s);
      }
      let description = descMatch ? descMatch[1] : '';
      
      // Try to extract image from description before cleaning HTML
      const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/);
      const image = imgMatch ? imgMatch[1] : undefined;
      
      // Clean HTML from description
      description = description.replace(/<[^>]*>/g, '').trim();
      
      // Decode HTML entities
      description = description
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      if (title && link) {
        articles.push({
          title: cleanTitle,
          link,
          pubDate,
          source,
          description: description.substring(0, 200), // Limit description length
          image,
        });
        
        console.log(`📰 Article found: ${cleanTitle.substring(0, 50)}...`);
      }

      // Limit to 10 articles
      if (articles.length >= 10) break;
    }

    console.log(`✅ Successfully parsed ${articles.length} news articles`);

    return new Response(JSON.stringify({ 
      articles,
      query: searchQuery,
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
      },
    });
  } catch (error: any) {
    console.error('❌ News search error:', error);
    return new Response(JSON.stringify({ 
      articles: [],
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
