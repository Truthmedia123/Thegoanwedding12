import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
  image?: string;
}

interface NewsArticlesProps {
  vendorName: string;
}

export function NewsArticles({ vendorName }: NewsArticlesProps) {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['news', vendorName],
    queryFn: async () => {
      console.log(`📰 Fetching news for vendor: ${vendorName}`);
      const response = await fetch(`/api/news/search?q=${encodeURIComponent(vendorName)}`);
      
      console.log(`📡 News API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ News API error: ${response.status} - ${errorText}`);
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      console.log(`📊 News API response:`, data);
      console.log(`📰 Articles loaded: ${data.articles?.length || 0}`);
      
      return data as { articles: NewsArticle[] };
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  console.log('NewsArticles component state:', { 
    isLoading, 
    hasError: !!error, 
    articlesCount: articles?.articles?.length || 0,
    vendorName 
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="w-24 h-24 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="fas fa-exclamation-circle text-3xl mb-2"></i>
        <p>Unable to load news articles</p>
      </div>
    );
  }

  if (!articles || articles.articles.length === 0) {
    console.log('⚠️ No articles to display');
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="fas fa-newspaper text-3xl mb-2"></i>
        <p>No recent news articles found</p>
        <p className="text-sm mt-1">
          {articles?.message || 'Check back later for updates'}
        </p>
      </div>
    );
  }

  console.log(`✅ Rendering ${articles.articles.length} news articles`);

  return (
    <div className="space-y-4">
      {articles.articles.map((article, index) => (
        <a
          key={index}
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-4">
              {article.image && (
                <div className="flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="font-medium">{article.source}</span>
                  <span>•</span>
                  <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                </div>
                {article.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-blue-600 text-sm mt-2">
                  <span>Read more</span>
                  <i className="fas fa-external-link-alt text-xs"></i>
                </div>
              </div>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
}
