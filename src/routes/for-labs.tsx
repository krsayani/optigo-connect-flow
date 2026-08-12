import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/for-labs")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "who" });
  },
});
