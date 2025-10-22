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

// Helper function to parse articles from XML
function parseArticlesFromXML(xml: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const itemMatches = xml.matchAll(/<item>(.*?)<\/item>/gs);

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
        description: description.substring(0, 200),
        image,
      });
    }
  }

  return articles;
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

    // Extract vendor name parts for better matching
    const vendorNameLower = query.toLowerCase();
    const vendorWords = vendorNameLower.split(' ').filter(w => w.length > 2); // Ignore short words like "the", "a"

    // Better search strategies with exact matching
    const searchStrategies = [
      `"${query}" Goa wedding`, // Most specific - exact name in quotes
      `"${query}" Goa`, // Exact name with location
      `"${query}" wedding`, // Exact name with wedding
      `"${query}"`, // Just exact name
      `${query} Goa wedding`, // Without quotes as fallback
    ];

    let allRelevantArticles: NewsArticle[] = [];
    let usedStrategy = '';

    // Try each strategy until we find RELEVANT articles
    for (const strategy of searchStrategies) {
      console.log(`🔍 Trying search: ${strategy}`);
      
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(strategy)}&hl=en-IN&gl=IN&ceid=IN:en`;

      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) continue;

      const xml = await response.text();
      const hasArticles = xml.includes('<item>');
      
      if (!hasArticles) {
        console.log(`⚠️ No articles found with: ${strategy}`);
        continue;
      }

      // Parse articles from this strategy
      const articles = parseArticlesFromXML(xml);
      
      // FILTER: Only include articles that actually mention the vendor name
      const relevantArticles = articles.filter(article => {
        const titleLower = article.title.toLowerCase();
        const descLower = (article.description || '').toLowerCase();
        const combined = `${titleLower} ${descLower}`;
        
        // Check if vendor name or significant parts appear in article
        const hasExactMatch = combined.includes(vendorNameLower);
        const hasSignificantWords = vendorWords.filter(word => combined.includes(word)).length >= Math.min(2, vendorWords.length);
        
        return hasExactMatch || hasSignificantWords;
      });

      console.log(`📊 Found ${articles.length} total, ${relevantArticles.length} relevant articles`);

      if (relevantArticles.length >= 2) {
        allRelevantArticles = relevantArticles;
        usedStrategy = strategy;
        console.log(`✅ Found ${relevantArticles.length} relevant articles with: ${strategy}`);
        break; // Stop at first strategy with relevant results
      } else if (relevantArticles.length > 0) {
        // Keep these but try next strategy for more
        allRelevantArticles = relevantArticles;
        usedStrategy = strategy;
      }
    }

    if (allRelevantArticles.length === 0) {
      console.log(`❌ No relevant articles found for vendor: ${query}`);
      return new Response(JSON.stringify({ 
        articles: [],
        query: query,
        message: 'No news articles found mentioning this vendor'
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ Returning ${allRelevantArticles.length} relevant articles (strategy: ${usedStrategy})`);

    // Return only relevant articles (limit to 10)
    const finalArticles = allRelevantArticles.slice(0, 10);

    return new Response(JSON.stringify({ 
      articles: finalArticles,
      query: usedStrategy,
      totalFound: allRelevantArticles.length,
      relevanceFiltered: true,
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
