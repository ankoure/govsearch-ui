import { useState } from "react";
import { searchAPI } from "./lib/api";
import type { components } from "./types/api";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Search, ExternalLink, Loader2 } from "lucide-react";

type SearchResult = components["schemas"]["SearchResult"];

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: apiError } = await searchAPI.hybridSearch({
        q: query,
        k: 10,
        use_semantic: true,
      });

      if (apiError) {
        setError("Search failed");
        return;
      }

      setResults(data?.results || []);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const hasSearched = results.length > 0 || error !== null;

  return (
    <div className="min-h-screen bg-white">
      <div className={`container mx-auto px-4 max-w-4xl ${hasSearched ? 'py-8' : 'flex items-center justify-center min-h-screen'}`}>
        <div className={hasSearched ? '' : 'w-full max-w-2xl'}>
          <div className={`mb-8 ${hasSearched ? '' : 'text-center'}`}>
            <h1 className="text-4xl font-bold mb-2 text-black">Government Search</h1>
            <p className="text-muted-foreground">
              Search across government documents and resources
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for government documents..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {results.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              Found {results.length} results
            </p>
          )}
          {results.map((result) => (
            <Card key={result.url} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary flex items-start gap-2"
                  >
                    <span className="flex-1">{result.title}</span>
                    <ExternalLink className="h-5 w-5 flex-shrink-0 mt-1" />
                  </a>
                </CardTitle>
                {result.source_name && (
                  <CardDescription className="flex items-center gap-2">
                    <span className="font-medium">{result.source_name}</span>
                    {result.domain && (
                      <span className="text-xs">• {result.domain}</span>
                    )}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{result.snippet}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Score: {result.score.toFixed(2)}</span>
                  {result.crawled_at && (
                    <span>
                      Crawled: {new Date(result.crawled_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {result.keywords && result.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                {result.matched_chunks && result.matched_chunks.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Relevant sections:
                    </p>
                    {result.matched_chunks.slice(0, 2).map((chunk, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground mb-2 pl-3 border-l-2 border-muted">
                        {chunk.text}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
