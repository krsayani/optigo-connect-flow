import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuthSession } from "@/lib/auth/functions";
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
  beforeLoad: async () => {
    const session = await getAuthSession();
    if (session) {
      throw redirect({ to: "/app" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return <LensFlowLogin />;
}
