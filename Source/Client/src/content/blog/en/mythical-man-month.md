---
title: "Nine Women Can't Make a Baby in One Month"
excerpt: "Fred Brooks published The Mythical Man-Month fifty years ago, and we still manage projects as if he never wrote a word. Men and months aren't interchangeable, there's no silver bullet, and adding people to a late project makes it later. In the age of AI agents — the newest silver bullet — the old book reads less like history and more like a warning."
publishedAt: "2026-07-09"
readingTime: 8
tags: ["Software Development", "Project Management", "Push Manifesto", "Engineering", "Methodology", "Leadership", "Artificial Intelligence"]
author:
  name: "Michael Wise"
  avatar: "/assets/manifesto-ico.svg"
  bio: "Technology leader with nearly 30 years in software development, transformation, and team leadership. Currently serving as CIO at Trilogy Care, driving digital innovation and evidence-based approaches to delivery."
featured: false
category: "Method"
status: "published"
coverImage: "/blog/covers/mythical-man-month.jpg"
headerOverlay: "radial"
headerOverlayIntensity: 98
titleTextShadow: "soft"
titleTextStroke: false
titleTextStrokeWidth: 0
---

> Adding manpower to a late software project makes it later. — Fred Brooks, *The Mythical Man-Month* (1975)

Fred Brooks managed the development of IBM's OS/360 — one of the largest software efforts of its era — watched it go spectacularly over schedule, and then did the rarest thing a leader ever does: he wrote down, honestly, why. *The Mythical Man-Month* came out in 1975. It is now fifty years old, routinely voted one of the most influential books in computing, and just as routinely ignored by the people quoting it. We have learned to recite Brooks. We have not learned to believe him.

Which is a problem, because the book is about to become relevant again in a way its author never saw coming.

## The myth in the title

The "man-month" is the unit every plan is still built on: one person for one month, and the two are treated as interchangeable currency. Need it done twice as fast? Add twice the people. Brooks called this "a dangerous and deceptive myth," because it "implies that men and months are interchangeable" — and they are not. His image for it has never been bettered: **"The bearing of a child takes nine months, no matter how many women are assigned."** Some tasks don't decompose. You cannot parallelise your way out of a problem whose parts depend on each other.

The reason is communication. Two people need one conversation to stay aligned; three need three; five need ten. The links grow as _n(n−1)/2_ — roughly the square of the team size. Add people to a task that needs coordination and you don't add capacity linearly; you add overhead quadratically. At some point the next hire makes the whole team _slower_.

## Brooks's Law

That insight compresses into the line everyone knows and nobody heeds: **adding manpower to a late software project makes it later.** The new people have to be trained, which costs the time of the people who were already productive. They increase the communication burden precisely when it's already the bottleneck. And the work they're handed was, by definition, badly partitioned — that's part of why the project is late. Brooks' verdict on the panicked "throw bodies at it" reflex is merciless: like "dousing a fire with gasoline, this makes matters worse, much worse."

Every leader who has ever inherited a slipping deadline has felt the gravitational pull to do the exact thing Brooks warns against. The pull doesn't care that you've read the book.

## Conceptual integrity, and the one hand that holds it

Brooks' constructive answer is the part people forget. The most important property of a system, he argued, is **conceptual integrity** — that it reflect one coherent set of ideas, not a committee's worth of compromises. "It is better to have a system omit certain anomalous features and improvements, but to reflect one set of design ideas, than to have one that contains many good but independent and uncoordinated ideas." A single mind's clear vision, even if narrower, beats a dozen brilliant ideas bolted together at odd angles.

To protect that, he proposed the **surgical team**: not ten equal programmers voting, but one surgeon making the cuts, supported by specialists who multiply their effectiveness. It's a deeply unfashionable idea in a flat-org, everyone-owns-everything world. It's also why the software you actually love to use almost always had one stubborn person guarding what it was allowed to become.

## No silver bullet

A decade later Brooks wrote the essay that should be tattooed on the inside of every technology buyer's eyelids: **"No Silver Bullet."** His claim was that software's hard problems split in two. **Accidental** complexity is the friction of _how_ we build — the languages, the tooling, the boilerplate, the typing. **Essential** complexity is the difficulty of the thing itself: understanding the problem, specifying it, designing the conceptual structure, and getting it right. Tools attack the accidental. And there is no single tool, technique, or fashion — he predicted — that will bring even a tenfold improvement in a decade, because the essence, not the accident, is where the real work lives. "Software engineering must address the essence, and not the accidents."

Forty years of proposed silver bullets — CASE tools, 4GLs, object orientation, UML, offshore scale, low-code — have proved him right by failing to prove him wrong. Each helped a bit with the accidental. None dissolved the essential.

## Enter the newest silver bullet

Which brings us to now. AI code generation is the most convincing silver bullet ever fired, and it is aimed squarely at accidental complexity. The typing, the boilerplate, the first draft, the glue — the machine does all of it, fast, for almost nothing. Read honestly, this is a stunning _vindication_ of Brooks, not a refutation: AI is demolishing exactly the category of difficulty he called inessential, and leaving untouched the category he called essential. Deciding what's worth building, holding the conceptual integrity, specifying the thing precisely enough to be right, verifying it actually works — all of that is still yours.

And the old laws don't retire; they mutate. **Brooks's Law has an AI edition.** Adding agents to a late, confused project doesn't rescue it — it lets the confusion generate itself at machine speed. Spin up ten parallel agents on a system with no conceptual integrity and you get ten locally-plausible, globally-incoherent contributions and a review queue no human can hold in their head. The communication overhead didn't vanish; it moved to _verification_ overhead, and it still grows faster than the output. Nine agents can't make a coherent system in one month any more than nine women can make a baby, if nobody's holding the single vision the whole thing is supposed to express.

This is where the Push manifesto and Brooks shake hands across fifty years. **Shape the work** before you scale it. Guard **conceptual integrity** — that's just taste with a job title. And **it doesn't exist if it can't be tested** — never more true than when a machine will hand you essential-looking output that solves an accidental-looking problem you didn't have. Brooks gave us the diagnosis in 1975. The treatment hasn't changed. We just have a faster, more confident way to ignore it now — and a book, half a century old, still waiting for us to actually read it.

---

## References

- Brooks, F. P. (1975). *The Mythical Man-Month: Essays on Software Engineering*. Addison-Wesley. (Anniversary edition, 1995, ISBN 0-201-83595-9.) — [Overview](https://en.wikipedia.org/wiki/The_Mythical_Man-Month). The source of Brooks's Law, the man-month myth, the nine-women image, and conceptual integrity — every quote above is from here.
- Brooks, F. P. (1987). "[No Silver Bullet — Essence and Accident in Software Engineering](https://en.wikipedia.org/wiki/No_Silver_Bullet)." *IEEE Computer*, 20(4), 10–19. (First presented at the IFIP 10th World Computing Conference, 1986.) — The essential-vs-accidental distinction that explains exactly which half of the work AI can and can't do.
- Mohapatra, P. (2010). *Software Engineering: A Lifecycle Approach*. New Age International. — A modern textbook restatement of Brooks's essence/accident argument and why estimation confuses effort with progress. *(From the wisejnrs knowledge base.)*
- Brooks, F. P. (1986). *Original "No Silver Bullet" proceedings text*, as held in the wisejnrs knowledge base (`mythical man month`) — used to verify the man-month, gasoline, and interchangeability quotations directly against Brooks's wording.
