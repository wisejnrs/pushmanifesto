---
title: "You Don't Get to Space by Crossing Your Fingers"
excerpt: "Hope is not a risk strategy. The teams that ship hard things aren't braver than everyone else — they've just made naming and citing risk a continuous, boring habit instead of a heroic one-off."
publishedAt: "2026-05-21"
readingTime: 6
tags: ["Risk", "Delivery", "Engineering", "Push Manifesto", "Leadership", "Project Management"]
author:
  name: "Michael Wise"
  avatar: "/assets/manifesto-ico.svg"
  bio: "Technology leader with nearly 30 years in software development, transformation, and team leadership. Currently serving as CIO at Trilogy Care, driving digital innovation and evidence-based approaches to delivery."
featured: false
category: "Risk"
status: "published"
coverImage: "/blog/covers/risk-crossing-fingers.jpg"
headerOverlay: "radial"
headerOverlayIntensity: 98
titleTextShadow: "soft"
titleTextStroke: false
titleTextStrokeWidth: 0
---

> For a successful technology, reality must take precedence over public relations, for nature cannot be fooled. — Richard P. Feynman, Appendix F, *Rogers Commission Report* (1986)

Nobody straps themselves to a rocket and hopes for the best. The whole apparatus of spaceflight is a machine for taking risk seriously: redundant systems, abort criteria, endless rehearsal, a culture where saying "I'm not comfortable with that number" stops the count. You don't get to space by crossing your fingers. You get there by refusing to.

Software likes to think it's different because the stakes feel lower. Usually they are. But the habit that gets rockets off the pad is exactly the one most projects lack — not bravery, but the unglamorous practice of continuously citing risk out loud.

## Risk doesn't disappear when you stop looking at it

The most common way teams handle risk is to not. There's an optimism that sets in once a project is moving: the integration will probably be fine, the third party will probably deliver, the data will probably be clean. Each "probably" is a finger crossed. Stack enough of them and you've built a plan that only works if nothing surprising happens — in a domain that is nothing but surprises.

The manifesto's instruction is deliberately repetitive: continuously cite risk. Not once, in a register that gets filed and forgotten. Continuously, as a running commentary on the work. "This depends on the vendor's API behaving — we haven't confirmed it does." "We're assuming the data migrates cleanly — untested." Saying it doesn't make the risk go away, but it makes it _visible_, and visible risk is risk you can do something about.

> Risk kills projects. You don't get to space by crossing your fingers — continuously cite it.

## Naming a risk is half of managing it

Here's what changes the moment a risk is named out loud: it becomes a shared object instead of a private worry. Someone can challenge it, size it, or — best of all — cheaply retire it. Half the risks I've seen sink projects could have been killed in an afternoon if anyone had said them early enough to act.

A named risk gets one of three honest responses: we'll test it now and find out (turn the unknown into a known), we'll mitigate it (build the fallback before we need it), or we'll accept it on purpose (eyes open, written down, owned). All three are fine. The only bad option is the fourth — the silent finger-cross — and it's the default.

## The culture part

Continuous risk-citing only works if it's safe to do. On a launch pad, anyone can call a hold; that authority is the point. On a project, if naming a risk gets you labelled negative or "not a team player," people will stop naming them, and you'll have optimised your culture for pleasant silence right up until the failure.

So the leadership job is to make risk-citing normal and unpunished — boring, even. Reward the person who surfaces the uncomfortable dependency. Treat "what could go wrong here?" as a standing question, not a sign of cold feet. The goal is a team where pointing at the iceberg is just part of steering the ship.

## Boring is the achievement

The teams that ship genuinely hard things rarely look heroic doing it. There's no last-minute miracle, because the risks that would have required one were named and retired weeks earlier. It looks, frankly, a bit dull. That dullness is the achievement. Crossed fingers make for a better story and a worse outcome. Aim for the boring launch.

---

## References

- Feynman, R. P. (1986). "[Personal Observations on the Reliability of the Shuttle](https://www.nasa.gov/history/rogersrep/v2appf.htm)." Appendix F in *Report of the Presidential Commission on the Space Shuttle Challenger Accident*, Vol. 2. U.S. Government Printing Office. — Ten pages of a physicist refusing to cross his fingers, ending in the most quotable sentence engineering ever produced about crossed fingers.
- Fairbanks, G. (2010). *[Just Enough Software Architecture: A Risk-Driven Approach](https://georgefairbanks.com/book/)*. Marshall & Brainerd. — The same thesis pointed at architecture: do exactly as much design as your risks demand, then put the whiteboard marker down.
- Queensland Treasury. (2020). *[A Guide to Risk Management](https://www.treasury.qld.gov.au/files/Guide-to-Risk-Management-June-2020.pdf)*. Queensland Government. — The unpretentious public-sector field manual: identify it, treat it, own it — ISO 31000 in plain Queensland English.
