
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchCommand = ({ open, setOpen }: SearchCommandProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { suggestions, loading, searchProducts } = useSearchSuggestions(query);

  const handleSelect = async (value: string) => {
    setQuery(value);
    const results = await searchProducts(value);
    setOpen(false);
    
    // Navigate to products page with search results
    navigate('/products', { state: { searchResults: results, searchQuery: value } });
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    const results = await searchProducts(query);
    setOpen(false);
    navigate('/products', { state: { searchResults: results, searchQuery: query } });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Search medicines, healthcare products..."
            value={query}
            onValueChange={setQuery}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </div>
        <CommandList>
          <CommandEmpty>
            {query ? (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">No suggestions found</p>
                <Button onClick={handleSearch} size="sm">
                  Search for "{query}"
                </Button>
              </div>
            ) : (
              "Start typing to search..."
            )}
          </CommandEmpty>
          {suggestions.length > 0 && (
            <CommandGroup heading="Suggestions">
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.id}
                  value={suggestion.text}
                  onSelect={() => handleSelect(suggestion.text)}
                  className="cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {suggestion.text}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default SearchCommand;
