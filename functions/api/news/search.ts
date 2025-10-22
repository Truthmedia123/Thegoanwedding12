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

    // Use Google News RSS feed (100% FREE, no API key needed)
    // Add "Goa" or "India" to make results more relevant for wedding vendors
    const searchQuery = `${query} Goa wedding`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-IN&gl=IN&ceid=IN:en`;

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`❌ Google News RSS error: ${response.status}`);
      return new Response(JSON.stringify({ 
        articles: [] 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const xml = await response.text();
    
    // Parse RSS XML
    const articles: NewsArticle[] = [];
    const itemMatches = xml.matchAll(/<item>(.*?)<\/item>/gs);

    for (const match of itemMatches) {
      const item = match[1];
      
      // Extract title
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const title = titleMatch ? titleMatch[1] : '';
      
      // Extract link
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const link = linkMatch ? linkMatch[1] : '';
      
      // Extract publication date
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      const pubDate = pubDateMatch ? pubDateMatch[1] : '';
      
      // Extract source (from title - Google News format: "Title - Source")
      const sourceParts = title.split(' - ');
      const source = sourceParts.length > 1 ? sourceParts[sourceParts.length - 1] : 'Google News';
      const cleanTitle = sourceParts.length > 1 ? sourceParts.slice(0, -1).join(' - ') : title;
      
      // Extract description
      const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
      let description = descMatch ? descMatch[1] : '';
      
      // Clean HTML from description
      description = description.replace(/<[^>]*>/g, '').trim();
      
      // Try to extract image from description
      const imgMatch = item.match(/<img[^>]+src="([^">]+)"/);
      const image = imgMatch ? imgMatch[1] : undefined;

      if (title && link) {
        articles.push({
          title: cleanTitle,
          link,
          pubDate,
          source,
          description: description.substring(0, 200), // Limit description length
          image,
        });
      }

      // Limit to 10 articles
      if (articles.length >= 10) break;
    }

    console.log(`✅ Found ${articles.length} news articles`);

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
