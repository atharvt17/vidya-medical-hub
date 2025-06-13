
import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

interface Suggestion {
  id: string;
  text: string;
  manufacturer: string;
}

interface SearchResult {
  id: string;
  name: string;
  description: string;
}

export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setSearchResults([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/suggest?q=${encodeURIComponent(debouncedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) return [];

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        return data;
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
    return [];
  };

  return {
    suggestions,
    searchResults,
    loading,
    searchProducts
  };
};
