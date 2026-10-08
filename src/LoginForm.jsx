import { useId, useLayoutEffect, useRef, useState } from "react";
import "./LoginForm.css";

/* One labelled input. Password fields get the show/hide toggle. */
function Field({ id, label, value, onChange, onBlur, touched, err, placeholder, auto, pw, kind }) {
  const [show, setShow] = useState(false);
  const input = (
    <input
      id={id}
      type={pw && !show ? "password" : "text"}
      inputMode={kind === "email" ? "email" : undefined}
      value={value}
      autoComplete={auto}
      placeholder={placeholder}
      className={touched ? (err ? "bad" : "ok") : ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
  return (
    <>
      <label htmlFor={id}>{label}</label>
      {pw ? (
        <div className="pw">
          {input}
          <button type="button" className={`eye ${show ? "on" : ""}`} onClick={() => setShow((x) => !x)} aria-label={show ? "Hide password" : "Show password"}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
              <path className="slash" d="M4 4l16 16" />
            </svg>
          </button>
        </div>
      ) : (
        input
      )}
      <small className="err">{touched && err}</small>
    </>
  );
}

/* Sign in / Create account panel. Visual-only: there is no authentication. */
export default function LoginForm({ mode, setMode }) {
  const uid = useId(); // keeps ids unique when the form is rendered twice (laptop screen + final page)
  const [v, setV] = useState({ user: "", pass: "", name: "", email: "", sp: "", sc: "" });
  const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false);
  const [t, setT] = useState({});
  const [phase, setPhase] = useState(null); // out → in while switching mode
  const [dir, setDir] = useState("fwd");
  const [fx, setFx] = useState(false);

  const wrapRef = useRef(null);
  const bodyRef = useRef(null);

  /* the panel stays put; only its inner height eases to fit the new content */
  useLayoutEffect(() => {
    const w = wrapRef.current, b = bodyRef.current;
    if (w && b && w.style.height) w.style.height = b.offsetHeight + "px";
  }, [mode]);

  const up = mode === "up";
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  const blur = (k) => () => setT((p) => ({ ...p, [k]: true }));
  const E = {
    user: !v.user.trim() ? "Username is required" : v.user.trim().length < 3 ? "Use at least 3 characters" : "",
    pass: !v.pass ? "Password is required" : "",
    name: v.name.trim().length < 2 ? "Enter your name" : "",
    email: /^\S+@\S+\.\S+$/.test(v.email) ? "" : "Enter a valid email",
    sp: v.sp.length < 6 ? "Use at least 6 characters" : "",
    sc: v.sc && v.sc === v.sp ? "" : "Passwords do not match",
  };

  const go = (to) => {
    if (fx) return;
    if (wrapRef.current && bodyRef.current) wrapRef.current.style.height = bodyRef.current.offsetHeight + "px";
    setDir(to === "up" ? "fwd" : "back");
    setFx(true);
    setPhase("out");
    setTimeout(() => { setMode(to); setT({}); setPhase("in"); }, 320); // old content has dissolved
    setTimeout(() => { setPhase(null); if (wrapRef.current) wrapRef.current.style.height = ""; }, 780);
    setTimeout(() => setFx(false), 720);
  };

  const F = (key, id, label, ph, auto, pw, kind) => (
    <Field id={`${uid}-${id}`} kind={kind} label={label} value={v[key]} onChange={set(key)} onBlur={blur(key)} touched={t[key]} err={E[key]} placeholder={ph} auto={auto} pw={pw} />
  );

  return (
    <div className="panel">
      <div ref={wrapRef} className={`morph ${fx || phase ? "busy" : ""}`}>
        <div ref={bodyRef} className={`body ${phase || ""}`}>
          <div className="status"><i /> {up ? "ACCOUNT REGISTRATION" : "ACCOUNT ACCESS"}</div>
          <h2>{up ? "Create account" : "Welcome back"}</h2>
          <p className="sub">{up ? "Enter your information to create an account." : "Enter your credentials to continue."}</p>

          {up ? (
            <>
              {F("name", "nm", "FULL NAME", "Enter your name", "name")}
              {F("email", "em", "EMAIL", "Enter your email", "email", false, "email")}
              {F("sp", "sp", "PASSWORD", "Create password", "new-password", true)}
              {F("sc", "sc", "CONFIRM PASSWORD", "Confirm password", "new-password", true)}
            </>
          ) : (
            <>
              {F("user", "u", "USERNAME", "Enter username", "username")}
              {F("pass", "p", "PASSWORD", "Enter password", "current-password", true)}
            </>
          )}

          {up ? (
            <label className="check-row">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>I agree to the terms</span>
            </label>
          ) : (
            <label className="check-row">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>Remember me</span>
            </label>
          )}

          <button className="btn" type="button">{up ? "CREATE ACCOUNT" : "SIGN IN"}</button>
          <p className="switch">
            {up ? "Already have an account?" : "Don't have an account?"}
            <button type="button" className="link" disabled={fx} onClick={() => go(up ? "in" : "up")}>{up ? "SIGN IN" : "CREATE ACCOUNT"}</button>
          </p>
        </div>
      </div>
      {fx && (
        <>
          <span className={`fx-pulse ${dir}`} />
          <span className={`fx-sweep ${dir}`} />
        </>
      )}
    </div>
  );
}
