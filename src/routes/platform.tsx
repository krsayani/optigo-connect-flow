import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old multi-page URLs now live as sections on the single landing page. */
export const Route = createFileRoute("/platform")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "product" });
  },
});
