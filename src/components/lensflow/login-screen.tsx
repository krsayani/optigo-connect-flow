import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { demoLogin, isDemoLoggedIn } from "@/lib/demo-auth";
import { OptiGoWordmark } from "@/components/site/logo";
import "./lensflow.css";

const EYE_OPEN = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EYE_OFF = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export function LensFlowLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (isDemoLoggedIn()) {
      void navigate({ to: "/app" });
    }
  }, [navigate]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setOk("");
    if (!username.trim()) {
      setError("Enter your username.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setPending(true);
    setError("");
    window.setTimeout(() => {
      if (demoLogin(username, password)) {
        void navigate({ to: "/app" });
        return;
      }
      setPending(false);
      setError("Sign-in failed.");
    }, 280);
  }

  return (
    <div className="lf-login">
      <div className="lf-login-aurora" aria-hidden="true" />
      <form className="gl-card" onSubmit={onSubmit} autoComplete="on">
        <div className="gl-brand">
          <OptiGoWordmark />
        </div>
        <p className="gl-sub">Sign in to your practice workspace.</p>

        <label htmlFor="gl-username">Username</label>
        <input
          id="gl-username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="words"
          spellCheck={false}
          required
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              document.getElementById("gl-password")?.focus();
            }
          }}
        />

        <label htmlFor="gl-password">Password</label>
        <div className="gl-pw-wrap">
          <input
            id="gl-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
          <button
            type="button"
            className="gl-pw-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? EYE_OFF : EYE_OPEN}
          </button>
        </div>

        <div className={error ? "gl-error is-on" : "gl-error"}>{error}</div>
        <div className={ok ? "gl-ok is-on" : "gl-ok"}>{ok}</div>

        <button className="gl-btn" type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <button
          type="button"
          className="gl-linkbtn"
          onClick={() => {
            setError("");
            if (!username.trim()) {
              setError("Enter your username first, then tap Forgot password.");
              return;
            }
            setOk("Ask an administrator to reset this password.");
          }}
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
}
