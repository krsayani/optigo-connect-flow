import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuthSession } from "@/lib/auth/functions";
import { LensFlowApp } from "@/components/lensflow/app-shell";

const TITLE = "LensFlow";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ title: TITLE }],
  }),
  beforeLoad: async () => {
    const session = await getAuthSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { session };
  },
  component: AppPage,
});

function AppPage() {
  const { session } = Route.useRouteContext();
  return <LensFlowApp displayName={session.displayName} />;
}
