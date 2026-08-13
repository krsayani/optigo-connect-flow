import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { isDemoLoggedIn } from "@/lib/demo-auth";
import { LensFlowApp } from "@/components/lensflow/app-shell";

const TITLE = "LensFlow";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ title: TITLE }],
  }),
  component: AppPage,
});

function AppPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isDemoLoggedIn()) {
      void navigate({ to: "/login" });
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) return null;
  return <LensFlowApp />;
}
