import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/for-practices")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "who" });
  },
});
