---
title: "Ambiguity and Bias Are Project Killers"
excerpt: "Projects rarely die from a lack of talent or effort. They die from fog — unclear language, hidden assumptions, and the quiet bias that makes us see what we expected to see. Clarity is a discipline, not a personality trait."
publishedAt: "2026-05-14"
readingTime: 6
tags: ["Thinking", "Cognitive Bias", "Communication", "Push Manifesto", "Product", "Design Thinking"]
author:
  name: "Michael Wise"
  avatar: "/assets/manifesto-ico.svg"
  bio: "Technology leader with nearly 30 years in software development, transformation, and team leadership. Currently serving as CIO at Trilogy Care, driving digital innovation and evidence-based approaches to delivery."
featured: false
category: "Thinking"
status: "published"
coverImage: "/blog/covers/ambiguity-and-bias.jpg"
headerOverlay: "radial"
headerOverlayIntensity: 98
titleTextShadow: "soft"
titleTextStroke: false
titleTextStrokeWidth: 0
---

> The first principle is that you must not fool yourself—and you are the easiest person to fool. — Richard P. Feynman, *Cargo Cult Science* (1974)

If you autopsy enough failed projects, you stop blaming the obvious things. It's rarely that the team couldn't code, or didn't care, or ran out of hours. Far more often, the cause of death is fog: two people who used the same word to mean different things, an assumption nobody wrote down, a decision made by a brain quietly fooling itself.

The manifesto names two of these directly, and calls them what they are. Ambiguity and cognitive bias kill projects.

## Ambiguity: the same word, two worlds

"Done." "Soon." "The user." "Integrated." These words feel precise in the moment and mean wildly different things to the people in the room. The designer's "done" includes the empty state; the developer's "done" is the happy path. Nobody's lying. They've just exported the word from different mental models, and the gap stays invisible until it ships.

The fix isn't more documentation. It's _readability_ — clear mental models, plain language, and a deliberate effort to support the diverse audience actually doing the work. Say what "done" includes. Draw the thing. Show an example. Replace the abstract noun with a concrete one. The goal is that two people, from two backgrounds, build the same picture in their heads from the same words. That almost never happens by accident.

> Offer high readability, clear mental models, support a diverse audience.

## Bias: the brain that confirms itself

Cognitive bias is the more insidious of the two, because it operates on people who are being careful. You can't will it away by being smart — smart people are, if anything, better at constructing convincing reasons for what they already believed.

The ones that ambush projects most:

- **Confirmation bias** — we notice the evidence that fits and skim past the rest. The demo that worked sticks; the three that didn't get explained away.
- **The curse of knowledge** — once you understand something, you genuinely cannot remember not understanding it, so you write docs and interfaces for a person who no longer exists: a past version of yourself.
- **Sunk cost** — the more we've invested, the harder it is to see that we should stop. The bias grows with the budget.

## Designing against your own brain

You don't beat bias with willpower. You beat it with structure — small process that does the noticing your brain won't:

- State the disprover in advance (the Hypothesis principle is an anti-bias device).
- Have someone whose explicit job in the review is to argue the other side.
- Show the work to someone outside the bubble, who hasn't absorbed the assumptions.
- Write decisions down with their reasoning, so future-you can audit past-you's logic instead of trusting their memory of it.

## Clarity as kindness

There's a humane reading of all this. Reducing ambiguity and checking your bias isn't only about efficiency. It's how you make space for people who don't share your context — the new starter, the stakeholder from another discipline, the user who doesn't think like you. Fog advantages the insider and quietly excludes everyone else. Clarity is inclusive by construction.

So treat clarity as a discipline you practise, not a trait you happen to have. Name the ambiguity. Design against the bias. The fog is the enemy, and it's the one enemy that's always partly inside the building.

---

## References

- Kahneman, D. (2011). *[Thinking, Fast and Slow](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow)*. Farrar, Straus and Giroux. — The owner's manual for the brain that keeps confirming itself; WYSIATI alone explains half of all project post-mortems.
- Feynman, R. P. (1974). "[Cargo Cult Science](https://calteches.library.caltech.edu/51/2/CargoCult.htm)." *Engineering and Science*, 37(7), 10–13. California Institute of Technology. — A physicist explaining, decades before "cognitive bias" was a meeting topic, that the easiest person to fool sits in your own chair.
