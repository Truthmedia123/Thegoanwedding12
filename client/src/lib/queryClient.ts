import { QueryClient } from "@tanstack/react-query";
import { vendorService, categoryService, blogService } from "./supabase-service";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { Vendor, BlogPost } from "@shared/schema";

export async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

// Function to fetch data from static JSON files
async function fetchStaticData<T>(path: string): Promise<T> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch static data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching static data from", path, ":", error);
    throw error;
  }
}

// Updated query function to use Directus SDK with static fallback
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: QueryFunctionContext) => Promise<T> =
  <T>(options: { on401: UnauthorizedBehavior }) =>
  async ({ queryKey }: QueryFunctionContext) => {
    try {
      // Map query keys to Supabase API calls
      switch (queryKey[0]) {
        case "/api/vendors/featured":
          try {
            // Try Supabase API first
            const featuredResult = await vendorService.getFeatured();
            if (featuredResult.error) {
              throw new Error(featuredResult.error);
            }
            return featuredResult.data as unknown as T;
          } catch (supabaseError) {
            console.warn("Supabase API failed, falling back to static data:", supabaseError);
            // Fallback to static JSON
            try {
              const staticVendors = await fetchStaticData<Vendor[]>('/data/vendors.json');
              return staticVendors.slice(0, 6) as unknown as T;
            } catch (staticError) {
              console.error("Both Supabase and static fallback failed:", staticError);
              throw staticError;
            }
          }
          
        case "/api/blog":
          try {
            // Try Supabase API first
            const blogResult = await blogService.getAll(true);
            if (blogResult.error) {
              throw new Error(blogResult.error);
            }
            return blogResult.data?.slice(0, 5) as unknown as T;
          } catch (supabaseError) {
            console.warn("Supabase API failed, falling back to static data:", supabaseError);
            // Fallback to static JSON
            try {
              const staticBlogPosts = await fetchStaticData<BlogPost[]>('/data/blog.json');
              return staticBlogPosts.slice(0, 5) as unknown as T;
            } catch (staticError) {
              console.error("Both Supabase and static fallback failed:", staticError);
              throw staticError;
            }
          }
          
        default:
          // For other endpoints, we'll need to implement specific handlers
          // For now, we'll throw an error to identify unhandled cases
          throw new Error(`Unhandled query key: ${queryKey[0]}`);
      }
    } catch (error) {
      console.error(`Error fetching from ${queryKey[0]}:`, error);
      // Re-throw the error so the UI can handle it properly
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Changed to "returnNull" to be more lenient
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});