"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import type { SearchResult } from "@/types/market";
import styles from "./CommandSearch.module.scss";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const router = useRouter();

  const openPalette = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openPalette]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data: SearchResult[]) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  function handleSelect(id: string) {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/token/${id}`);
  }

  function handleClose() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <Dialog.Trigger asChild>
        <button className={styles.trigger} onClick={openPalette}>
          <Search size={14} />
          <span>Search tokens...</span>
          <kbd className={styles.kbd}>⌘K</kbd>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.dialog}>
          <Dialog.Title className={styles.srOnly}>Search tokens</Dialog.Title>

          <div className={styles.inputWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              className={styles.input}
              placeholder="Search tokens..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button className={styles.clearBtn} onClick={() => setQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.results}>
            {loading && <div className={styles.state}>Searching...</div>}
            {!loading && debouncedQuery && results.length === 0 && (
              <div className={styles.state}>No results for &ldquo;{debouncedQuery}&rdquo;</div>
            )}
            {results.map((result) => (
              <button key={result.id} className={styles.result} onClick={() => handleSelect(result.id)}>
                <Image src={result.thumb} alt={result.name} width={24} height={24} className={styles.resultImage} unoptimized />
                <span className={styles.resultName}>{result.name}</span>
                <span className={styles.resultSymbol}>{result.symbol.toUpperCase()}</span>
                {result.marketCapRank && (
                  <span className={styles.resultRank}>#{result.marketCapRank}</span>
                )}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
