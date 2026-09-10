import { createFileRoute } from "@tanstack/react-router";
import { FinalBand } from "@/components/site/lf";
import { MeetTheFounders } from "@/components/site/meet-the-founders";

const TITLE = "Team | LensFlow";
const DESC =
  "Meet the team building LensFlow — the connectivity layer for eyecare, from exam room to lab to patient.";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/team" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <>
      <MeetTheFounders />
      <FinalBand title="Get in touch" primary={{ to: "/contact", label: "Request early access" }} />
    </>
  );
}
