---
title: "Everything Is Loops, Sequences and Decisions"
excerpt: "Strip away the frameworks and the jargon and all of programming is three things: loops, sequences, and decisions. Everything else is abstraction from the truth — useful, until you forget it's there."
publishedAt: "2026-03-26"
readingTime: 6
tags: ["Engineering", "Philosophy", "Software Development", "Push Manifesto", "Abstraction", "Fundamentals"]
author:
  name: "Michael Wise"
  avatar: "/assets/manifesto-ico.svg"
  bio: "Technology leader with nearly 30 years in software development, transformation, and team leadership. Currently serving as CIO at Trilogy Care, driving digital innovation and evidence-based approaches to delivery."
featured: false
category: "Engineering"
status: "published"
coverImage: "/blog/covers/loops-sequences-decisions.jpg"
headerOverlay: "radial"
headerOverlayIntensity: 98
titleTextShadow: "soft"
titleTextStroke: false
titleTextStrokeWidth: 0
---

> The purpose of abstracting is not to be vague, but to create a new semantic level in which one can be absolutely precise. — Edsger W. Dijkstra, *The Humble Programmer* (1972)

I've said this enough times that people quote it back to me: programming is loops, sequences and decisions. Everything else is just abstraction from the truth. It sounds like a grumpy old engineer being reductive. It's actually a tool I use constantly, and it cuts deeper than it first appears.

## The three primitives

Underneath every framework, language, and paradigm, a computer does only three kinds of thing. It does steps in order — a sequence. It repeats things — a loop. And it chooses between paths based on conditions — a decision. That's the entire instruction set of the universe, conceptually. Sort algorithms, neural networks, payroll systems, the browser rendering this page: all of it resolves, eventually, to sequences, loops, and decisions running very fast.

Everything we build on top — objects, functions, microservices, frameworks, the whole towering edifice — is abstraction. Layers of convenient fiction that let us think in bigger units without holding the primitives in our heads. Abstraction is wonderful. It's how we build things larger than one mind can contain. But it is, precisely, abstraction _from_ the truth, and the gap matters.

## Abstraction is a loan

Here's the part that's more than a slogan. Every abstraction is a loan against understanding. It lets you move fast now by not thinking about what's underneath — and the bill comes due the day the abstraction leaks, which it always eventually does. The ORM that generates a catastrophic query. The framework whose "magic" does something you didn't ask for. The library that's fine until the one case it wasn't designed for.

When that day comes, the only people who can fix it are the ones who can drop through the layers and see the loops, sequences, and decisions underneath. Everyone else can only file a ticket and hope. The abstraction didn't remove the complexity. It moved it somewhere you agreed not to look, and charged you interest.

> Programming: loops, sequences and decisions. Everything else is just abstraction from the truth.

## Why this is a manifesto idea, not just an engineering one

This connects to the whole philosophy, because the manifesto is suspicious of exactly this kind of comfortable distance. Methodology is an abstraction over working. Ceremony is an abstraction over collaborating. A milestone is an abstraction over progress. Each is useful and each, taken on faith, drifts away from the truth it was supposed to represent — until you're managing the abstraction instead of the thing.

"Go find out" is the instruction to drop through the layers. "It doesn't exist if it can't be tested" is a refusal to accept the abstraction's claim about itself without checking the substance. The scientific habit is, at root, a discipline of staying connected to the ground truth when every convenience is pulling you up into the comfortable fiction.

## Stay close to the ground

I'm not arguing against abstraction. I'd get nothing done without it, and neither would you. I'm arguing for knowing it's there — for being the kind of practitioner who can use the high-level tool fluently and still drop to the primitives when it lies to you. Use the framework. Trust the abstraction. But keep a map of what's underneath, because the day it leaks, that map is the only thing that helps.

Loops, sequences, decisions. Everything else is a story we tell to make the truth easier to hold. Good stories. Just remember they're stories.

---

## References

- Böhm, C., & Jacopini, G. (1966). "[Flow Diagrams, Turing Machines and Languages with Only Two Formation Rules](https://www.cs.unibo.it/~martini/PP/bohm-jac.pdf)". *Communications of the ACM*, 9(5), 366–371. — The [theorem](https://en.wikipedia.org/wiki/Structured_program_theorem) behind the slogan: sequence, selection, iteration, and nothing else required.
- Dijkstra, E. W. (1972). "[The Humble Programmer](https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD340.html)" (EWD340). *Communications of the ACM*, 15(10), 859–866. — The Turing lecture that defends abstraction as precision, not hand-waving — exactly this post's line on convenient fictions.
- Spolsky, J. (2002). "[The Law of Leaky Abstractions](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/)". *Joel on Software*. — The classic essay on the loan coming due.
- Streib, J. T. (2020). *[Guide to Assembly Language: A Concise Introduction](https://link.springer.com/book/10.1007/978-3-030-35639-2)* (2nd ed.). Springer. — The primitives up close: every elegant control structure compiling down to compares and branches.
