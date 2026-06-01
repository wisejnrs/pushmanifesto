"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

type Quote = { author: string; quote: string };

const tweets: Quote[] = [
  {
    author: "Michael Wise",
    quote:
      "I push the trolley around the supermarket. I push myself to exercise. I push my kids through school. Why is the creative process any different?",
  },
  { author: "Michael Wise", quote: "Small things more often." },
  {
    author: "Michael Wise",
    quote:
      "Shovelling dirt is still shovelling dirt. Doesn't matter if you do it iteratively. Software development is complex and hard work, find a way to recognise that.",
  },
  {
    author: "Michael Wise",
    quote:
      "Programming: Loops, Sequences and Decisions, everything else is just abstraction from the truth.",
  },
  { author: "Michael Wise", quote: "I haven't but this is how I would work it out." },
  { author: "Michael Wise", quote: "Like building a Cathedral out of a Tornado." },
  { author: "Leon Bambrick", quote: "Keep the turbulance down." },
  { author: "Steve Rogers", quote: "Just get on with it." },
  {
    author: "Michael Wise",
    quote: "T-Shirts are like ideas, you change them when they don't fit.",
  },
  { author: "Michael Wise", quote: "No problem, lets work it out together." },
  { author: "Michael Wise", quote: "Creativity has no timeline." },
  {
    author: "Michael Wise",
    quote:
      "People and Data don't change. Pretty sure there's a cave painting out there with FNAME and LNAME on it.",
  },
  {
    author: "David Wise",
    quote:
      "Create habits. People, process, technology and habit. If you want people to do things create habits.",
  },
  { author: "Dwight D. Eisenhower", quote: "No plan survives first encounter." },
  {
    author: "Julia Galef",
    quote:
      "Scout Mindset: being able to see things as they are, not as you wish they were.",
  },
  { author: "Dennis Shortis", quote: "Perfect is the destroyer of good enough!" },
  {
    author: "Richard Feynman",
    quote:
      "You are under no obligation to remain the same person you were a year ago, a month ago, or even a day ago. You are here to create yourself, continuously.",
  },
];

export function ManifestoClient() {
  useEffect(() => {
    AOS.init();

    const carousel = document.getElementById("carousel");
    const carouselLink = document.getElementById(
      "carousel-link",
    ) as HTMLAnchorElement | null;
    if (!carousel || !carouselLink) return;

    let quoteID = -1;
    let pauseQuotes = false;
    let cancelled = false;

    const render = (i: number) => {
      carousel.innerHTML = `<p>❝ ${tweets[i].quote} ❞</p><p style="margin-top: 1rem; color: #ccc"> - ${tweets[i].author}</p>`;
      carouselLink.href =
        "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweets[i].quote);
    };

    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function rotate(): Promise<void> {
      for (let time = 0; time < 17; time++) {
        if (pauseQuotes || cancelled) return;
        if (time >= 16) {
          quoteID = -1;
          void rotate();
          return;
        }
        render(time);
        quoteID++;
        await wait(5000);
      }
    }

    const back = () => {
      pauseQuotes = true;
      if (quoteID > 0) quoteID--;
      render(quoteID);
    };
    const forward = () => {
      pauseQuotes = true;
      if (quoteID < tweets.length - 1) quoteID++;
      render(quoteID);
    };

    const chevrons = document.getElementsByClassName("chevron-navigation");
    const backEl = chevrons[0] as HTMLElement | undefined;
    const forwardEl = chevrons[1] as HTMLElement | undefined;
    backEl?.addEventListener("click", back);
    forwardEl?.addEventListener("click", forward);

    void rotate();

    // Buy Me a Coffee button — inject the widget script into its footer slot.
    const bmc = document.getElementById("bmc-container");
    if (bmc && !bmc.dataset.loaded) {
      bmc.dataset.loaded = "true";
      const s = document.createElement("script");
      s.src = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js";
      s.setAttribute("data-name", "bmc-button");
      s.setAttribute("data-slug", "mlwise");
      s.setAttribute("data-color", "#FFDD00");
      s.setAttribute("data-emoji", "");
      s.setAttribute("data-font", "Cookie");
      s.setAttribute("data-text", "Buy me a coffee");
      s.setAttribute("data-outline-color", "#000000");
      s.setAttribute("data-font-color", "#000000");
      s.setAttribute("data-coffee-color", "#ffffff");
      bmc.appendChild(s);
    }

    return () => {
      cancelled = true;
      backEl?.removeEventListener("click", back);
      forwardEl?.removeEventListener("click", forward);
    };
  }, []);

  return null;
}
