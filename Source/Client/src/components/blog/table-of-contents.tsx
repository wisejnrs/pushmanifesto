"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    // Generate table of contents from headings
    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ).filter((heading) => heading.id) as HTMLElement[];

    const tocItems: TocItem[] = headings.map((heading) => ({
      id: heading.id,
      title: heading.textContent || "",
      level: parseInt(heading.tagName.charAt(1)),
    }));

    setToc(tocItems);

    // Set up intersection observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  // Filter TOC items based on search text
  const filteredToc = useMemo(() => {
    if (!filterText.trim()) return toc;
    const searchLower = filterText.toLowerCase();
    return toc.filter(item =>
      item.title.toLowerCase().includes(searchLower)
    );
  }, [toc, filterText]);

  // Current match tracking for navigation
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Reset match index when filter changes
  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [filterText]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNext = () => {
    if (filteredToc.length === 0) return;
    const nextIndex = (currentMatchIndex + 1) % filteredToc.length;
    setCurrentMatchIndex(nextIndex);
    const nextItem = filteredToc[nextIndex];
    if (nextItem) scrollToHeading(nextItem.id);
  };

  const handlePrevious = () => {
    if (filteredToc.length === 0) return;
    const prevIndex = currentMatchIndex === 0 ? filteredToc.length - 1 : currentMatchIndex - 1;
    setCurrentMatchIndex(prevIndex);
    const prevItem = filteredToc[prevIndex];
    if (prevItem) scrollToHeading(prevItem.id);
  };

  const clearFilter = () => {
    setFilterText("");
    setCurrentMatchIndex(0);
  };

  if (toc.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("sticky top-20 space-y-2", className)}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full font-semibold text-sm text-foreground hover:text-primary transition-colors group"
      >
        <span>On this page</span>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </motion.div>
      </button>

      {/* Mini Search Bar with Navigation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center gap-1 overflow-hidden"
          >
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter sections..."
                aria-label="Filter table of contents"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full h-7 pl-7 pr-6 text-xs bg-muted/50 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
              {filterText && (
                <button
                  onClick={clearFilter}
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-muted rounded transition-colors"
                  title="Clear filter"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Navigation buttons - only show when filtering */}
            {filterText && filteredToc.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-0.5"
              >
                <button
                  onClick={handlePrevious}
                  className="p-1 h-7 w-7 flex items-center justify-center hover:bg-muted rounded transition-colors"
                  title="Previous match"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <span className="text-xs text-muted-foreground px-1 min-w-[2.5rem] text-center">
                  {currentMatchIndex + 1}/{filteredToc.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-1 h-7 w-7 flex items-center justify-center hover:bg-muted rounded transition-colors"
                  title="Next match"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-0.5 overflow-hidden"
          >
            {filteredToc.length > 0 ? (
              filteredToc.map((item, index) => {
                const isCurrentMatch = filterText && index === currentMatchIndex;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.02, duration: 0.2 }}
                  >
                    <button
                      onClick={() => {
                        scrollToHeading(item.id);
                        if (filterText) {
                          setCurrentMatchIndex(index);
                        }
                      }}
                      className={cn(
                        "relative text-left block w-full text-sm py-1.5 px-2 rounded-md transition-all",
                        {
                          "text-foreground bg-muted font-medium": activeId === item.id,
                          "text-muted-foreground hover:text-foreground hover:bg-muted/50": activeId !== item.id,
                          "ring-1 ring-primary/50 bg-primary/10": isCurrentMatch,
                          "pl-2": item.level === 1,
                          "pl-4": item.level === 2,
                          "pl-6": item.level === 3,
                          "pl-8": item.level === 4,
                          "pl-10": item.level === 5,
                          "pl-12": item.level === 6,
                        }
                      )}
                    >
                      {activeId === item.id && !isCurrentMatch && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      {isCurrentMatch && (
                        <motion.div
                          layoutId="currentMatch"
                          className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className={cn(
                        filterText && item.title.toLowerCase().includes(filterText.toLowerCase()) && "font-medium"
                      )}>
                        {item.title}
                      </span>
                    </button>
                  </motion.li>
                );
              })
            ) : filterText ? (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground text-center py-3"
              >
                No sections found
              </motion.li>
            ) : null}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}