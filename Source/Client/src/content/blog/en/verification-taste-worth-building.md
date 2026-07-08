---
title: "The Skill Is Now Verification, Taste, and Knowing What's Worth Building"
excerpt: "When a machine can generate the code, the copy, and the first three designs for almost nothing, the value moves to the three things it can't do for you: verifying the output is right, having the taste to tell good from plausible, and the judgement to know what was worth building at all. And underneath all three sits the one asset AI made scarcer, not cheaper — context. Output evaporates; context is the gold."
publishedAt: "2026-07-08"
readingTime: 9
tags: ["Artificial Intelligence", "AI", "Engineering", "Push Manifesto", "Product", "Future of Work", "Leadership", "Craft"]
author:
  name: "Michael Wise"
  avatar: "/assets/manifesto-ico.svg"
  bio: "Technology leader with nearly 30 years in software development, transformation, and team leadership. Currently serving as CIO at Trilogy Care, driving digital innovation and evidence-based approaches to delivery."
featured: false
category: "AI"
status: "published"
coverImage: "/blog/covers/verification-taste-worth-building.jpg"
headerOverlay: "radial"
headerOverlayIntensity: 98
titleTextShadow: "soft"
titleTextStroke: false
titleTextStrokeWidth: 0
---

> Doveryai, no proveryai — trust, but verify. — Russian proverb, made famous by Ronald Reagan (1987)

I wrote a companion to this a while back — _Pushing in the Age of AI_ — arguing that when generation gets cheap, judgement gets dear. This is the sequel that names the invoice. If the machine now does the making, what exactly is left for us to be good at?

After a couple of years of using these tools on real work, my answer has narrowed to three things. Not vague ones — three concrete, trainable skills that the model does not have and cannot fake: **verification**, **taste**, and **knowing what's worth building**. Everything else that used to fill a working day is being quietly automated. These three are the job now.

## The uncomfortable data first

The industry sold us "AI ships software faster." The measurements are less flattering. In the 2026 _State of Software Delivery_ report, the headline finding was that AI adoption has _not_ produced a broad speed-up: the top 5% of teams nearly doubled their throughput while the bottom quartile saw no measurable gain at all. Same tools, opposite outcomes. Meanwhile the average autonomous coding session grew from roughly four minutes in early 2025 to over twenty by early 2026 — the agents are doing far more, unsupervised, before a human looks.

Put those two facts together and the shape of the work becomes obvious. The bottleneck didn't disappear; it _moved_. It moved from typing to checking. The teams that pulled ahead are the ones that got good at the checking. That's not a productivity story. It's a skills story.

## Skill one: verification

When a model can produce ten plausible implementations before lunch, the scarce act is deciding which — if any — is correct. Fluent wrong is more dangerous than obvious wrong, because fluency disarms scepticism. A generated solution _looks_ finished. It compiles. It has confident comments. None of that is evidence that it does the right thing.

This is the manifesto's oldest principle arriving with the force of necessity: **it doesn't exist if it can't be tested.** When generation was expensive, a thin test strategy was a shortcut you could sometimes get away with. Now it's the only instrument standing between you and a flood of untested guesses. The right rhythm inverts: spend the time you saved on generation _buying certainty_ instead. Generate three approaches, state the hypothesis behind each, kill two without ceremony.

Notice what this does to careers. Verification used to be the junior task and generation the senior one. That's flipping. The industry's own forecasts now put the majority of a delivery team's time on verification and quality gates rather than hands-on-keyboard authoring. Reviewing well — reading adversarially, knowing where a system lies to you — is becoming the senior skill. If you only ever learned to produce, you learned the half that got automated.

## Skill two: taste

Verification tells you whether a thing is _correct_. Taste tells you whether it's _good_ — and those are not the same question. A model will give you a technically correct answer that is graceless, over-abstracted, three cards deep in a UI that should have been one, solving a problem nobody has in a way nobody will maintain. Correct and bad, at the same time.

Taste is the ability to evaluate the aesthetic, conceptual, and practical quality of an option and say _this one, not that one, and here's why_. It has quietly become the differentiator precisely because execution got commoditised. When everything is easy to make, deciding what's worth keeping is the brutal part — and the model has no opinion. It will happily generate slop with the same confidence it generates craft.

The good news, and the reason this belongs in a manifesto rather than a lament: taste is **learnable**. It's not a personality trait you're born with. It's built the boring way — deliberate consumption of good work, critical analysis of why it's good, and a lot of your own output held up honestly against a high bar. The people who spent years developing judgement about what "good" looks like didn't just keep their edge. The tools amplified it. The people who skipped that apprenticeship now have a machine that will produce infinite mediocrity on demand and no way to tell.

> A model chops the vegetables in seconds. It still can't tell you whether the dish is any good — and it never doubts itself for a moment.

## Skill three: knowing what's worth building

The deepest skill, and the one furthest from the model's reach, is the decision that comes _before_ any generation at all: is this worth building? The economists who priced this boom before it happened put it plainly — as the cost of prediction falls, the value of judgement rises. The machine predicts. You judge. That division of labour is the whole game.

This is where the manifesto's discipline earns its keep. **Draw the map before the route** — know which capability you're actually trying to build before you let an agent sprint in some direction. **State the hypothesis** — what would prove this idea wrong, and have you gone looking? **Cite the risk** — hope is not a strategy, and a faster engine just lets you push your luck deeper into a bad idea before you notice, because every generated step _felt_ productive.

Two things from the wider literature sharpen this. First, Kahneman's long catalogue of systematic bias: we are predictably irrational, we see what we expected to see, and a fluent generated narrative is a near-perfect delivery vehicle for confirming whatever we already believed. Second, the quiet finding from studies of failed engineering strategies — they rarely die of grand complexity. They die of the mundane: assuming a plan will execute itself, never validating the detail, mistaking motion for progress. AI makes motion nearly free. It does nothing for the discipline of pointing it somewhere true.

## Underneath all three: context is the gold

Step back and the three skills collapse into one asset. You can't _verify_ without knowing what "right" means _here_ — the constraint that isn't written down, the edge case that burned you last time. You can't exercise _taste_ without a lived sense of what good looks like in _this_ domain, for _these_ users. And you can't know what's _worth building_ without the whole backstory: why the last two attempts failed, which option the regulator kills, which one is politically dead on arrival. All three run on the same fuel. That fuel is context.

This is the real inversion. The old scarce resource was output — the hours of typing, drafting, drawing. AI drove that cost toward zero. But it did the opposite to context: a model arrives at your problem knowing everything in general and nothing in particular. It has read the internet and none of your meeting notes. It can generate a thousand words a second and cannot tell you why the thing your predecessor shipped in 2022 quietly failed. The scarce, appreciating asset is no longer the output. It's the context — and the skill of feeding the right slice of it to the machine at the right moment.

So the practical instruction changes. Guard your context; it's the gold. Write it down — the decision and the _reason_ for it, the dead ends, the constraints that look arbitrary and aren't. Context is the one thing that compounds: every push adds to it, and a team rich in it will out-generate a team of prompt-typists every single time, because they know which slop to throw away and why. Output evaporates the moment it's made. Context is the reservoir you draw from to make the next output _good_. Feed the machine, don't hope it guesses.

> Output is cheap now, and getting cheaper. Context — the hard-won knowledge of why this problem is _this_ problem — is the gold. Everything the machine can't do for you, it can't do because it doesn't have yours.

## What this does to a push

The rhythm of a push changes, but the shape doesn't. The **beginning** gets faster — you reach a working candidate in minutes. Which means the **middle** — the verifying, the deciding — arrives sooner and matters more, not less. The failure mode is using the speed to _skip_ the middle: shipping the generated thing because it looks done, without ever attaching it to a moving instrument. And the **end** is still a real end: a working, checked result is a place to stop and bank the win, not a runway for the model to keep building on a foundation nobody inspected.

None of this makes the human smaller. It makes the human's actual contribution finally visible. The typing was never the value — it was just tangled up with the value so tightly we couldn't see the seam. Now the machine took the typing and left the judgement exposed on the table: verify that it's right, tell whether it's good, decide if it was worth doing. That was always the work. We just have fewer places left to hide from it.

---

## References

- CircleCI. (2026). "[5 key takeaways from the 2026 State of Software Delivery: Why AI isn't shipping faster](https://circleci.com/blog/five-takeaways-2026-software-delivery-report/)." — The uncomfortable headline: AI didn't lift the average team. The top 5% nearly doubled throughput; the bottom quartile gained nothing. Same tools, opposite outcomes — the gap is skill, not access.
- Anthropic. (2026). *[2026 Agentic Coding Trends Report](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf)*. — Autonomous coding sessions grew from ~4 minutes to over 20 in a year. The agents do far more before a human looks — which is exactly why the looking is now the scarce skill.
- Agrawal, A., Gans, J., & Goldfarb, A. (2016, November 17). "[The Simple Economics of Machine Intelligence](https://hbr.org/2016/11/the-simple-economics-of-machine-intelligence)." *Harvard Business Review*. — Prediction gets cheap, judgement gets dear. The one-line thesis of this whole post, priced two years early.
- Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux. — The catalogue of systematic bias that a fluent, confident generated answer is uniquely good at exploiting. We see what we expected to see; the machine is happy to show it to us.
- Fairbanks, G. (2010). *Just Enough Software Architecture: A Risk-Driven Approach*. Marshall & Brainerd. — Frameworks can guide how much design work to do, but whether the risk is truly handled remains an irreducibly human judgement call. Verification has a floor the model can't reach.
- Larson, W. (2025). *[Crafting Engineering Strategy](https://lethain.com/crafting-engineering-strategy/)*. — Strategies fail mundanely: assuming they'll execute themselves, never validating the detail, mistaking motion for progress. AI makes motion nearly free and validation more necessary than ever.
