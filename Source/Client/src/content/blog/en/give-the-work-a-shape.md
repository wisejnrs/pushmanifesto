---
title: "Give the Work a Shape: How to Structure a Push"
excerpt: "A project with no structure isn't free — it's just unaccountable. Here's a lightweight skeleton, from idea brief to go-live, that gives the work a shape without drowning it in ceremony."
publishedAt: "2026-05-30"
readingTime: 7
tags: ["Ways of Working", "Project Management", "Methodology", "Push Manifesto", "Delivery", "Governance"]
author:
  name: "Michael Wise"
  avatar: "/assets/manifesto-ico.svg"
  bio: "Technology leader with nearly 30 years in software development, transformation, and team leadership. Currently serving as CIO at Trilogy Care, driving digital innovation and evidence-based approaches to delivery."
featured: false
category: "Ways of Working"
status: "published"
coverImage: "/blog/covers/give-the-work-a-shape.jpg"
headerOverlay: "radial"
headerOverlayIntensity: 98
titleTextShadow: "soft"
titleTextStroke: false
titleTextStrokeWidth: 0
---

There's a false choice that haunts delivery: heavyweight process on one side, chaos on the other. Pick the binder full of templates, or pick "we'll figure it out as we go." Both are traps. The binder buries the work in ceremony; the free-for-all leaves it unaccountable. What you actually want is a *shape* — a light skeleton the work hangs on, with no more structure than the work earns.

After enough projects I've settled on a skeleton I trust. It's not a methodology. It's a place for things to live, so that nothing important is homeless and nothing unimportant gets a meeting.

## The skeleton

Most work, large or small, moves through the same few rooms:

- **Initiate** — the idea brief and the high-level goals. One page: what this is, why it matters, what "done" roughly looks like. If you can't write the brief, you're not ready to start (that's [mise en place](/blog/mise-en-place-for-projects)).
- **Design** — business processes, the user stories, the technical shape, and the decisions you made *and why*. Crucially, this is where the **test strategy** lives — because [an idea doesn't exist if it can't be tested](/blog/it-doesnt-exist-if-it-cant-be-tested).
- **Build & Test** — the work itself, against defined environments. The pushes happen here.
- **Release** — the quality plan, the road map, the operational handover, and a go-live readiness checklist. The unglamorous bit that decides whether the good work actually reaches anyone.
- **Govern** — risks, acceptance criteria, the definition of done, retrospectives, and ways of working. The thin layer that keeps the whole thing honest.

That's the whole shape. Notice what it is and isn't: it's a set of *homes*, not a set of *gates*. You don't need permission to move between rooms. You need somewhere to put the test strategy so it isn't lost.

## Decision records over status reports

The single highest-leverage habit in that skeleton is writing down decisions *with their reasoning*. Not what's on track — what was decided, and why, given what was known at the time.

Status reports rot the moment they're written. Decision records compound. Six months on, when someone asks "why on earth did we build it this way," the answer is a paragraph instead of an argument. And future-you gets to audit past-you's logic instead of trusting a faded memory of it — the best defence against the bias that quietly rewrites history in your favour.

## Definition of done is a boundary, not a wish

Every room benefits from one honest line: what does *done* mean here? Not "done-ish," not "done except the edge cases" — the real boundary. A push [has an end](/blog/beginning-middle-end), and the definition of done is where you draw it before you start, so you can't move it afterward to make yourself feel finished.

This is the piece teams skip, and it's why so much work has the texture of a treadmill. Without a stated boundary, nothing is ever quite done, so nothing is ever quite celebrated, and the team just keeps running.

## Version the truth

One small discipline that pays off forever: version things properly. [Semantic versioning](https://semver.org/) — major for breaking changes, minor for backwards-compatible features, patch for fixes — isn't just for libraries. It's a shared language for "how much did this change?" that a whole team, technical or not, can read at a glance.

## The point of the skeleton

A shape doesn't slow the work down. It speeds it up, because nobody's wondering where the test strategy went or whether the thing is allowed to ship. The structure absorbs the questions that would otherwise become meetings.

Keep it light. Give every important thing a home and nothing unimportant a ceremony. Then get on with the pushes — which is where the actual work was always going to happen.

---

*Further reading: the decision-records habit has a canonical origin — Michael Nygard's short 2011 essay [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), which makes the case in two pages that agile teams shouldn't skip documentation, just keep the kind that answers "why." McCabe's __Fundamentals of Enterprise Architecture__ gives the fuller anatomy of a good decision record if you want to formalise it, and the [semantic versioning spec](https://semver.org/) itself is a five-minute read that hands a whole team — technical or not — a shared language for how much something changed.*
