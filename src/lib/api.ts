import createClient from "openapi-fetch";
import type { paths } from "../types/api";

// Create a typed client
export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_OPEN_SEARCH_API_BASE_URL,
});

export const searchAPI = {
  // Hybrid search with full type safety
  hybridSearch: (params: {
    q: string;
    k?: number;
    use_semantic?: boolean;
    source?: string | null;
    keyword_weight?: number;
  }) => {
    return api.GET("/search", { params: { query: params } });
  },

  // Keyword search
  keywordSearch: (params: {
    q: string;
    k?: number;
    source?: string | null;
  }) => {
    return api.GET("/search/keyword", { params: { query: params } });
  },

  // Semantic search
  semanticSearch: (params: {
    q: string;
    k?: number;
    source?: string | null;
  }) => {
    return api.GET("/search/semantic", { params: { query: params } });
  },

  // Get sources
  getSources: (limit?: number) => {
    return api.GET("/sources", {
      params: { query: limit ? { limit } : undefined },
    });
  },

  // Get stats
  getStats: () => {
    return api.GET("/stats");
  },

  // Get document by ID
  getDocument: (docId: string) => {
    return api.GET("/document/{doc_id}", {
      params: { path: { doc_id: docId } },
    });
  },

  // Health check
  healthCheck: () => {
    return api.GET("/");
  },
};
