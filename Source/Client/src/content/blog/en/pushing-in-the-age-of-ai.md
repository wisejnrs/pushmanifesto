---
title: "Pushing in the Age of AI"
excerpt: "AI can now do a startling amount of the grunt work of creation. That doesn't make the manifesto obsolete — it makes it essential. When generating output is cheap, the discipline of knowing what's worth generating is everything."
publishedAt: "2026-06-04"
readingTime: 7
tags: ["Artificial Intelligence", "AI", "Engineering", "Push Manifesto", "Product", "Future of Work", "Leadership"]
author:
  name: "Michael Wise"
  avatar: "/assets/manifesto-ico.svg"
  bio: "Technology leader with nearly 30 years in software development, transformation, and team leadership. Currently serving as CIO at Trilogy Care, driving digital innovation and evidence-based approaches to delivery."
featured: true
category: "AI"
status: "published"
coverImage: "/blog/covers/pushing-in-the-age-of-ai.jpg"
headerOverlay: "radial"
headerOverlayIntensity: 98
titleTextShadow: "soft"
titleTextStroke: false
titleTextStrokeWidth: 0
---

> Judgment is a complement to prediction and therefore when the cost of prediction falls demand for judgment rises. We’ll want more human judgment. — Agrawal, Gans & Goldfarb, *Harvard Business Review* (2016)

I wrote the Push Manifesto thinking about humans doing hard creative work. Then the ground moved. A model can now draft the code, the copy, the test plan, the first three designs — in seconds, for almost nothing. It's reasonable to ask whether a philosophy about the discipline of making things still applies when the making got so cheap.

My honest answer, after a couple of years of using these tools in anger: the manifesto doesn't just survive the shift. It becomes the load-bearing part. When output is free, the scarce thing is judgement — and judgement is exactly what the manifesto is about.

## The cost of being wrong didn't fall. The cost of generating did.

This is the distinction everyone blurs. AI collapsed the cost of _producing_ a thing. It did almost nothing to the cost of producing the _wrong_ thing and discovering it too late. A model will confidently generate a beautiful solution to the problem you didn't actually have, and it will do it fast enough to flood you with plausible wrongness before you've thought to ask whether it's right.

So the old principles get sharper, not softer:

- **Hypothesis.** When you can generate ten implementations before lunch, "it doesn't exist if it can't be tested" stops being a nice idea and becomes the only thing standing between you and ten untested guesses. The test strategy is now the bottleneck, and that's correct — it's the part that should be.
- **Getting it wrong.** The model is wrong constantly, and fluently. Fluent wrong is more dangerous than obvious wrong because it disarms your scepticism. The scientific habit — state the disprover, go looking for it — is your only defence against being charmed.
- **Go find out.** A model will happily hallucinate how the legacy system works. The antidote is unchanged: get out of the chair, read the actual code, talk to the actual person. Primary sources beat a confident summary, and they especially beat a generated one.

## The grunt work was never the value

There's a grief I see in good engineers and writers: if the machine can do the typing, what was I for? It helps to be precise about what just got automated. The model automated the _generation_ of a candidate. It did not automate deciding which candidate is worth having, why, for whom, and at what cost. It chopped the vegetables. It did not decide what to cook, for whom, or whether the dish is any good.

That deciding — the mise en place of judgement, the citing of risk, the knowing when to roll 'em — was always the value. We just couldn't see it clearly while it was tangled up with the typing. Now that the typing is cheap, the judgement stands exposed as the real work. The people who thrive won't be the ones who generate the most. They'll be the ones who know what's worth generating and can tell good output from confident noise.

> Every great idea starts with a test strategy. It doesn't exist if it can't be tested. That goes double for the ones a machine wrote.

## Pushes get smaller and faster, not fewer

Practically, AI changes the rhythm of a push. The beginning is faster — you get to a working candidate in minutes. Which means the middle, the testing and deciding, arrives sooner and matters more. The danger is using the speed to skip it: to ship the generated thing because it _looks_ done, without ever attaching it to a moving instrument.

Resist that. Spend the time you saved on generation buying certainty instead. Use the model to make wrong cheaper — generate three approaches, test the hypothesis behind each, kill two without ceremony. That's not slower. It's the same discipline at higher speed, which is the whole promise of the tools if you don't squander it on volume.

## Don't push your luck — now with a faster engine

A faster engine makes it easier to push your luck. You can generate your way deep into a bad idea before noticing, because every step felt productive. The "know when to roll 'em" principle is now a safety system. A working result is still a place to stop and bank the win, not a runway for the model to keep building on a foundation nobody checked.

The manifesto was always about doing creativity deliberately, in a world that rewards looking busy. AI didn't change that. It just turned up the volume on both sides — more output, and more ways to fool yourself with it. The deliberate ones will be fine. They'll be better than fine. The rest will generate a great deal, very quickly, and learn the cost of the wrong thing on the same brutal schedule as always.

---

## References

- Agrawal, A., Gans, J., & Goldfarb, A. (2016, November 17). "[The Simple Economics of Machine Intelligence](https://hbr.org/2016/11/the-simple-economics-of-machine-intelligence)." *Harvard Business Review*. — Three economists priced the AI boom two years before it happened: generation gets cheap, judgement gets dear, and this post is largely their invoice arriving.
- Wilson, S. (2024). *[The Developer's Playbook for Large Language Model Security](https://www.oreilly.com/library/view/the-developers-playbook/9781098162191/)*. O'Reilly Media. — From the founder of the OWASP Top 10 for LLMs: "never take the model's output at face value" turned from folk wisdom into engineering checklist — because [hallucination](https://en.wikipedia.org/wiki/Hallucination_%28artificial_intelligence%29) is a catalogued failure mode, not a CIO being grumpy about it.
