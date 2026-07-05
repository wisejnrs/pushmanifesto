---
title: "It Doesn't Exist If It Can't Be Tested"
excerpt: "An idea you can't test isn't a plan — it's a wish. The Hypothesis principle asks for something uncomfortable: state what would prove you wrong before you spend a cent proving you're right."
publishedAt: "2026-04-23"
readingTime: 6
tags: ["Engineering", "Hypothesis", "Testing", "Scientific Method", "Push Manifesto", "Product"]
author:
  name: "Michael Wise"
  avatar: "/assets/manifesto-ico.svg"
  bio: "Technology leader with nearly 30 years in software development, transformation, and team leadership. Currently serving as CIO at Trilogy Care, driving digital innovation and evidence-based approaches to delivery."
featured: false
category: "Engineering"
status: "published"
coverImage: "/blog/covers/it-doesnt-exist-if-it-cant-be-tested.jpg"
headerOverlay: "radial"
headerOverlayIntensity: 98
titleTextShadow: "soft"
titleTextStroke: false
titleTextStrokeWidth: 0
---

Every great idea starts with a test strategy. That sounds like an engineering platitude until you sit with it. It means that before the idea is real — before it earns a place on the board, a sprint, a budget line — you should be able to say how you'd know whether it's any good.

If you can't, you don't have an idea. You have a wish wearing an idea's clothes.

## The question that deflates the room

Try this in your next planning session. Someone proposes a feature, a rewrite, a new platform. Ask one question: _"What would we expect to see if this is working — and what would we see if it isn't?"_

Watch what happens. Half the proposals survive and get sharper. The other half quietly deflate, because the honest answer is "I'm not sure how we'd tell." That's not a gotcha. It's a gift. You just saved yourself months of building something with no way to know if it mattered.

> Every great idea starts with a test strategy. It doesn't exist if it can't be tested.

## A test strategy is not a test plan

Let me head off a misreading. I'm not asking for a document. A test strategy can be a sentence: "If this onboarding change works, sign-up completion goes up and support tickets about step three go down; if it doesn't, neither moves." That's it. You've made the idea falsifiable.

The strategy comes _first_, before the build, for a specific reason: it stops you from moving the goalposts after the fact. We are extraordinarily good at looking at any outcome and explaining why it confirms what we already believed. Naming the expected signal in advance is how you tie your own hands against your own bias.

## Things that resist testing

Some of the most expensive ideas in any organisation are the ones that have quietly opted out of being tested:

- The re-org that will "improve collaboration" — measured how?
- The rewrite that will "make us faster" — faster at what, compared to what baseline?
- The strategy deck whose claims are all directional and none disprovable.

I'm not saying these are wrong. I'm saying that until you can state what would prove them wrong, you can't tell — and neither can anyone else. A claim that survives all possible evidence isn't strong. It's empty.

## Cheap instruments

The good news is that the test rarely needs to be elaborate. A landing page. A wizard-of-oz prototype where a human pretends to be the algorithm. A week of one team using the thing while another doesn't. A single well-chosen metric watched for a fortnight.

The instrument can be crude as long as it can _move_ — as long as a real outcome could push the needle one way or the other. An idea attached to a moving instrument is alive. You can learn from it, kill it, double down on it. An idea with no instrument just sits there, consuming belief and budget, immune to reality.

So before you build the thing, decide how you'd know it worked. If you can't, that's your finding. The idea doesn't exist yet.

---

*Further reading: Eric Ries's __The Lean Startup__ is the operating manual for this post — validated learning, [Build-Measure-Learn](https://theleanstartup.com/principles), and the blunt reminder that if you cannot fail, you cannot learn. Daniel Kahneman's __Thinking, Fast and Slow__ explains why the goalposts move the moment you stop nailing them down in advance. And the philosophical spine is Karl Popper's [falsifiability](https://en.wikipedia.org/wiki/Falsifiability) — a claim that no evidence could ever dent isn't strong, it's empty.*
