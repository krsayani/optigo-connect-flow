import { createFileRoute } from "@tanstack/react-router";
import { LensFlowLogin } from "@/components/lensflow/login-screen";

const TITLE = "Sign in | LensFlow";
const DESC = "Sign in to LensFlow.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  return <LensFlowLogin />;
}
