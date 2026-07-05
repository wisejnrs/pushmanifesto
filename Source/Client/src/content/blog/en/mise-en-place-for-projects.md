---
title: "Chop the Vegetables First: Mise en Place for Projects"
excerpt: "Every good kitchen runs on mise en place — everything in its place before the heat goes on. Most projects skip it and wonder why service falls apart. Here's what 'prepped' actually means before you start a push."
publishedAt: "2026-04-08"
readingTime: 6
tags: ["Ways of Working", "Project Management", "Preparation", "Push Manifesto", "Delivery", "Leadership"]
author:
  name: "Michael Wise"
  avatar: "/assets/manifesto-ico.svg"
  bio: "Technology leader with nearly 30 years in software development, transformation, and team leadership. Currently serving as CIO at Trilogy Care, driving digital innovation and evidence-based approaches to delivery."
featured: false
category: "Ways of Working"
status: "published"
coverImage: "/blog/covers/mise-en-place-for-projects.jpg"
headerOverlay: "radial"
headerOverlayIntensity: 98
titleTextShadow: "soft"
titleTextStroke: false
titleTextStrokeWidth: 0
---

Spend any time in a professional kitchen and you'll hear two words before you hear anything else: _mise en place_. Everything in its place. The onions diced, the stock simmering, the knives honed, the pans where your hand expects them. The chef does this before a single order comes in, because once the heat is on there is no time to go looking for the garlic.

Software has a strange relationship with this idea. We celebrate "just start" and "fail fast," and somewhere along the way we decided that preparation was the enemy of momentum. So we kick off projects with a half-formed brief, a repository that doesn't build, and access requests that won't clear for a fortnight. Then we act surprised when the first two weeks evaporate into setup and the team never finds its rhythm.

## Prep is not planning

Let me be clear about what I mean, because mise en place is not a return to the hundred-page project plan. A plan is a guess about the future. Prep is the removal of friction from the present. They are different things, and the manifesto only asks for one of them.

Prep is the boring, knowable work that you will _definitely_ need and can do _now_:

- The environment builds, locally and in CI, on a clean machine.
- The accounts, credentials, and permissions exist before someone is blocked by them.
- The data you need to test against is real enough to be useful and safe enough to use.
- The shape of the first push is agreed — not the whole roadmap, just the first logical unit of output.
- The people who will say "no" later have already been in the room.

None of that is speculative. None of it is a Gantt chart. It is chopping vegetables.

## Why we skip it

We skip prep because it doesn't feel like progress. There's no demo at the end of a day spent fixing the build and chasing an access ticket. The dopamine of a green checkmark on a feature is real; the quiet satisfaction of a project that simply _works on day one_ is not something we've learned to reward.

But the cost of skipping it is paid with interest. An unprepped project doesn't fail loudly at the start. It bleeds out slowly: a developer idle for a day waiting on a key, a tester who can't trust the data, a review that stalls because nobody can run the thing. Each is small. Together they're the difference between a kitchen that sends plates and one that's in the weeds by 7pm.

> Don't start a project without your mise en place done. Get those vegetables chopped.

## How much is enough?

The honest answer is: enough that the first push can run without stopping to forage. Not more. Mise en place has a failure mode too — the cook who spends so long arranging their station that the guests go home hungry. Prep is in service of the push, not a substitute for it.

A useful test: write down the first push, then ask "what would stop us starting this tomorrow morning?" Every answer on that list is prep. Everything _not_ on that list is planning, and planning can wait until you've learned something by doing.

## The quiet dividend

Teams that prep well look, from the outside, almost boring. There's no heroics, no late-night scramble to get the demo working, no "it works on my machine." There's just a steady cadence of work getting done, because the friction was removed before it could compound.

That's the whole point. Mise en place doesn't make you faster on day one. It makes you _consistent_ for the next ninety. And consistency, not bursts, is what finishes journeys.

So before the heat goes on: chop the vegetables.

---

*Further reading: Dan Charnas spent years shadowing chefs and turned what he saw into [Everything in Its Place](https://en.wikipedia.org/wiki/Dan_Charnas) — the definitive translation of [mise en place](https://en.wikipedia.org/wiki/Mise_en_place) from the kitchen to the desk, and the book to read if this post struck a nerve. The engineering world reached the same conclusion in drabber prose: Lawson's __Project Management for the Process Industries__ insists the project "front end" cannot be overemphasised. Different kitchens, same vegetables.*
