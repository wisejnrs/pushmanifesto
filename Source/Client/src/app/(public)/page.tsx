import Link from "next/link";
import Script from "next/script";

import { ManifestoClient } from "@/components/manifesto-client";

type Item = { label: string; description: string; aos: string };

const items: Item[] = [
  {
    label: "Push:",
    aos: "fade-right",
    description:
      "A logical unit of output that has a beginning, middle and end. 'End' generally represents an outcome, doesn't need to immediately progress to the next, includes all work items, has value, has an agreement of 'Done' - everybody gets something.",
  },
  {
    label: "Ambiguity and Cognitive Bias:",
    aos: "fade-up",
    description:
      "These kill projects. Offer high readability,clear mental models, support diverse audiences, adopt simple conventions, reduce complexity, take the least cost route, seek clarity and always, always question. Take an agnostic approach.",
  },
  {
    label: "Risk:",
    aos: "fade-left",
    description:
      "Again kill projects. You don't get to space by crossing your fingers, continuously cite and counter risks. Pretty sure Babbage, Bool and Bayes knew Murphy.",
  },
  {
    label: "Check-ins, Waypoints and Reviews:",
    aos: "fade-right",
    description:
      'Whilst stand-ups are useful, a low ceremony, less noisy approach to follow-up on work items, prefer top and bottom of the week, honesty and shared understanding. In other words, "you\'re child\'s report card should not be a surprise, by virtue of care and involvement".',
  },
  {
    label: "Identify and remove Road Blocks:",
    aos: "fade-up",
    description: "Early identification is key with an inclusive approach taken.",
  },
  {
    label: "Creating Shared Value: ",
    aos: "fade-left",
    description:
      "Inclusive and humble approach in recognition that your project, whilst having value and benefits contributes to wider goals.",
  },
  {
    label: "Mise en place: ",
    aos: "fade-right",
    description:
      "Don't start a project without your Mise en place done, get those vegetables chopped.",
  },
  {
    label: "Work Items: ",
    aos: "fade-up",
    description:
      "Work items, tasks and cards transform Assets. Link the work item to the asset. **Don't** deposit results back in to the task. Knowledge management is first-class.",
  },
  {
    label: "Getting it Wrong:",
    aos: "fade-left",
    description:
      "Being learned, critical thinking and taking a scientific approach will always help you climb those mountains.",
  },
  {
    label: "Go Find Out: ",
    aos: "fade-right",
    description:
      "Engage. Engage early, and enough, even if to make friends. Get out of the chair and go find out. Do the work, and don't repeat the obvious.",
  },
  {
    label: "Know when to Roll Em:",
    aos: "fade-up",
    description:
      "Manage your work effort, dial in your approach and don't push your luck. Only kick a push if the conditions are favourable. If it can go wrong it will - Murhpy's law applies.",
  },
  {
    label: "Hypothesis: ",
    aos: "fade-left",
    description:
      "Every great _idea_ starts with a Test Strategy. It doesn't exist if it can't be tested.",
  },
];

const tweetHref = (text: string) =>
  "https://twitter.com/intent/tweet?text=" +
  encodeURIComponent(text + " http://www.pushmanifesto.org") +
  "&original_referer=https://pushmanifesto.org/";

export default function HomePage() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-VZ3GBPF421"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-VZ3GBPF421');`}
      </Script>

      <header className="header">
        <div className="header-content responsive-wrapper">
          <div className="header-logo">
            <h2 style={{ marginTop: "1.5rem" }} className="logo">
              Push Manifesto
            </h2>
          </div>
          <nav className="header-nav">
            <Link href="/blog" className="header-nav-item">
              Blog
            </Link>
            <a
              target="_blank"
              href="https://github.com/wisejnrs/pushmanifesto"
              className="header-nav-item"
            >
              GitHub
            </a>
            <a
              target="_blank"
              href="https://github.com/wisejnrs/pushmanifesto/wiki"
              className="header-nav-item"
            >
              Wiki
            </a>
            <a
              target="_blank"
              href="https://wisejnrs.myshopify.com"
              className="header-nav-item"
            >
              Store
            </a>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="banner-outer parallax">
          <div className="banner responsive-wrapper">
            <div className="banner-search-wrapper">
              <div data-aos="fade-up">
                <h1 className="banner-title">
                  A way to do
                  <br /> <span>creativity</span>
                </h1>
              </div>
              <div data-aos-duration="1000" data-aos="fade-up">
                <a
                  target="_blank"
                  style={{ textDecoration: "none" }}
                  id="carousel-link"
                >
                  <nav id="carousel" className="banner-nav"></nav>
                </a>
                <div style={{ marginTop: "1rem" }}>
                  <div className="chevron-navigation">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-chevron-left"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </div>
                  <div className="chevron-navigation">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-chevron-right"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <img
                className="bg-svg"
                style={{
                  width: "2rem",
                  height: "2rem",
                  position: "absolute",
                  top: "20vh",
                  left: "10vw",
                }}
                src="/assets/layers-c.svg"
                alt=""
              />
              <img
                className="bg-svg"
                style={{
                  width: "2rem",
                  height: "2rem",
                  position: "absolute",
                  top: "40vh",
                  left: "30vw",
                }}
                src="/assets/layers-hex.svg"
                alt=""
              />
              <img
                className="bg-svg"
                style={{
                  width: "2rem",
                  height: "2rem",
                  position: "absolute",
                  top: "40vh",
                  left: "3vw",
                }}
                src="/assets/layers-rect.svg"
                alt=""
              />
            </div>
            <div className="banner-image-wrapper">
              <img
                src="/assets/manifesto-bg.svg"
                style={{
                  opacity: 0.5,
                  width: "40vw",
                  height: "40vw",
                  filter: "brightness(120%)",
                  position: "absolute",
                  top: "5rem",
                  right: "4vw",
                  zIndex: 1,
                }}
                alt=""
              />
              <div
                style={{
                  backgroundImage: "url('/assets/manifesto-bg.svg')",
                  width: "40vw",
                  height: "40vw",
                  filter: "brightness(120%)",
                  position: "absolute",
                  top: "7rem",
                  right: "4vw",
                  zIndex: 1,
                  objectFit: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img
                  className="manifesto"
                  src="/assets/manifesto.svg"
                  style={{ marginLeft: "5rem", width: "70%", height: "70%" }}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="services-outer">
          <div className="responsive-wrapper hero-gradient">
            <h2 className="services-title">The Manifesto</h2>
            <p className="services-paragraph">
              <strong>Push Manifesto</strong> is about vision, collaboration,
              inclusive behaviours, determination, communication, governance,
              learning, and above all prioritizes <i>the journey</i>; using{" "}
              <i>waypoints</i> over iterations and milestones, balancing desire for
              fit-for-purpose, targeting shared value outcomes for users and
              stakeholders.
            </p>
            <p className="services-paragraph">
              <strong>Push Manifesto</strong> feeds the Maturity Model,
              evidence-based mindset, supporting the scientific approach daring to
              explore the latent space, with a pragmatic world-view.
            </p>
          </div>
          <nav className="services responsive-wrapper">
            <ul className="services-list">
              {items.map((item) => (
                <li key={item.label} data-aos={item.aos} className="services-item">
                  <a
                    target="_blank"
                    href={tweetHref(item.label + " " + item.description)}
                    className="services-item-link"
                  >
                    {item.label}
                  </a>
                  <p className="services-item-description">{item.description}</p>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content responsive-wrapper">
          <div className="footer-column">
            <ul className="some-list">
              <li className="some-list-item">
                <a href="https://www.twitter.com/michael_wise" className="some-list-link">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="twitter-square"
                    className="svg-inline--fa fa-twitter-square fa-w-14"
                    style={{ width: "52px" }}
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z"
                    ></path>
                  </svg>
                </a>
              </li>
              <li className="some-list-item">
                <a
                  href="https://www.linkedin.com/in/michaelleahywise/"
                  className="some-list-link"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="linkedin"
                    className="svg-inline--fa fa-linkedin fa-w-14"
                    role="img"
                    style={{ width: "52px" }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
                    ></path>
                  </svg>
                </a>
              </li>
              <li className="some-list-item">
                <div id="bmc-container" />
              </li>
            </ul>
          </div>
          <div className="footer-column"></div>
          <div className="footer-column"></div>
        </div>
      </footer>

      <ManifestoClient />
    </>
  );
}
