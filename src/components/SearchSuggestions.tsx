"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb, Search, X } from "lucide-react";
import { suggestCorrections, generateSearchVariants } from "@/lib/smart-search";
interface SearchSuggestionsProps {
  searchTerm: string;
  onSuggestionClick: (suggestion: string) => void;
  show: boolean;
  onDismiss: () => void;
}
export function SearchSuggestions({
  searchTerm,
  onSuggestionClick,
  show,
  onDismiss,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [variants, setVariants] = useState<string[]>([]);
  useEffect(() => {
    if (searchTerm && searchTerm.length > 1) {
      const corrections = suggestCorrections(searchTerm);
      const searchVariants = generateSearchVariants(searchTerm);
      setSuggestions(corrections);
      setVariants(searchVariants.filter((v) => v !== searchTerm.toLowerCase()));
    } else {
      setSuggestions([]);
      setVariants([]);
    }
  }, [searchTerm]);
  if (!show || (suggestions.length === 0 && variants.length === 0)) {
    return null;
  }
  return (
    <Card className="glass-card border-2 border-german-gold/30 dark:border-dark-theme-pink/30 mt-2">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4 text-german-gold dark:text-dark-theme-pink" />
            <span className="text-sm font-semibold text-foreground">
              Умные предложения
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        {variants.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">
              Варианты написания:
            </p>
            <div className="flex flex-wrap gap-2">
              {variants.slice(0, 4).map((variant) => (
                <Button
                  key={variant}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(variant)}
                  className="glass h-8 px-3 text-xs hover:bg-german-red/10 dark:hover:bg-dark-theme-pink/10 transition-colors"
                >
                  <Search className="h-3 w-3 mr-1" />
                  {variant}
                </Button>
              ))}
            </div>
          </div>
        )}
        {suggestions.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Возможно, вы имели в виду:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="glass cursor-pointer hover:bg-german-gold/10 dark:hover:bg-dark-theme-pink/10 transition-colors"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
