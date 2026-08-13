import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import { requestPasswordReset, signIn } from "@/lib/auth/functions";
import { OptiGoWordmark } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const WORKSPACE_POINTS = [
  "Order lenses from every lab in one place",
  "Track jobs from intake through delivery",
  "Keep practice and lab communication together",
] as const;

export function LensFlowLogin() {
  const navigate = useNavigate();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setOk("");
    if (!identifier.trim()) {
      setError("Enter your email or username.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const result = await signIn({
        data: { identifier: identifier.trim(), password },
      });
      if (result.ok) {
        void navigate({ to: "/app" });
        return;
      }
      setError(result.error);
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function onForgotPassword() {
    setError("");
    setOk("");
    if (!identifier.trim()) {
      setError("Enter your email or username first, then tap Forgot password.");
      return;
    }
    try {
      const result = await requestPasswordReset({
        data: { identifier: identifier.trim() },
      });
      setOk(result.message);
    } catch {
      setOk("If an account exists, an administrator or reset email will follow up.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-dvh bg-mist font-sans">
      <aside className="relative hidden overflow-y-auto surface-dark lg:flex lg:w-[46%] xl:w-[48%]">
        <div className="absolute inset-0 grid-mesh-dark opacity-60" />
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-electric/25 blur-3xl animate-orb" />
        <div className="absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-aqua/20 blur-3xl animate-drift" />
        <div className="relative z-10 flex min-h-full w-full flex-col justify-between px-10 py-10 xl:px-14 xl:py-12">
          <OptiGoWordmark tone="light" />

          <div className="max-w-md">
            <p className="eyebrow text-aqua">Practice workspace</p>
            <h1 className="mt-4 font-display text-[2.15rem] font-extrabold leading-[1.08] tracking-[-0.04em] text-on-dark xl:text-[2.55rem]">
              One platform for every optical lab order.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-on-dark-muted">
              Sign in to order, communicate, track, and get paid — without
              leaving OptiGo.
            </p>
            <ul className="mt-8 space-y-3">
              {WORKSPACE_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-snug text-on-dark"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-aqua">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-on-dark-muted">
            Built for practices and labs that want one shared order flow.
          </p>
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 sm:px-8 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="absolute inset-0 surface-aurora" />
        <div className="absolute inset-0 grid-mesh opacity-40" />
        <div className="absolute -right-10 top-8 h-48 w-48 rounded-full bg-electric/15 blur-3xl animate-orb" />
        <div className="absolute -left-8 bottom-6 h-40 w-40 rounded-full bg-aqua/15 blur-3xl" />

        <div className="relative w-full max-w-[420px] animate-rise">
          <div className="mb-8 flex justify-center lg:hidden">
            <OptiGoWordmark />
          </div>

          <form
            className="card-elevated relative overflow-hidden p-7 sm:p-8"
            onSubmit={onSubmit}
            autoComplete="on"
            aria-labelledby="login-heading"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-electric via-electric-soft to-aqua" />

            <p className="eyebrow text-electric">Sign in</p>
            <h2
              id="login-heading"
              className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] text-navy"
            >
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Enter your credentials to open your practice workspace.
            </p>

            <div className="mt-7 space-y-4">
              <div>
                <label
                  htmlFor="gl-username"
                  className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-navy"
                >
                  Email or username
                </label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="gl-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    placeholder="Email or username"
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={error ? "login-message" : undefined}
                    className={fieldClass}
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        passwordRef.current?.focus();
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="gl-password"
                    className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-navy"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-electric hover:underline"
                    onClick={() => void onForgotPassword()}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    ref={passwordRef}
                    id="gl-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password"
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={error || ok ? "login-message" : undefined}
                    className={cn(fieldClass, "pr-12")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error ? (
              <p
                id="login-message"
                role="alert"
                className="mt-4 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
              >
                {error}
              </p>
            ) : ok ? (
              <p
                id="login-message"
                role="status"
                className="mt-4 rounded-xl bg-aqua/25 px-3.5 py-2.5 text-sm leading-relaxed text-navy"
              >
                {ok}
              </p>
            ) : null}

            <button
              className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-14px_oklch(0.24_0.058_262/0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-electric disabled:pointer-events-none disabled:opacity-65"
              type="submit"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-electric"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to OptiGo
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

const fieldClass =
  "h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-base text-navy shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-electric focus:ring-4 focus:ring-electric/15";
