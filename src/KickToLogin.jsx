import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* intro → preparing(ready, run-up, pullback) → kicking → flying → impact → login → authenticating → success → resetting → intro */
const TIMING = { preparing: 1500, kicking: 300, flying: 1000, impact: 1000, authenticating: 1700, resetting: 550 };
const NEXT = { preparing: "kicking", kicking: "flying", flying: "impact", impact: "login", authenticating: "success", resetting: "intro" };
const FORM = ["impact", "login", "authenticating", "success", "resetting"];

const SKIN = "#e4a883", SKIN_D = "#c98b66", JERSEY = "#246bff", SHORTS = "#0e1119", SOCK = "#dfe8ff";

function Leg({ cls, hip, knee, ankle, shade }) {
  const [hx, hy] = hip, [kx, ky] = knee, [ax, ay] = ankle;
  return (
    <g className={`${cls}-t`} style={{ transformOrigin: `${hx}px ${hy}px` }}>
      <path d={`M${hx} ${hy} L${kx} ${ky}`} stroke={shade ? SKIN_D : SKIN} strokeWidth="17" strokeLinecap="round" />
      <path d={`M${hx} ${hy} L${hx + (kx - hx) * 0.55} ${hy + (ky - hy) * 0.55}`} stroke={SHORTS} strokeWidth="25" strokeLinecap="round" />
      <path d={`M${hx - 12} ${hy + 22} h26`} stroke="#00e5ff" strokeWidth="1.6" opacity=".7" />
      <g className={`${cls}-s`} style={{ transformOrigin: `${kx}px ${ky}px` }}>
        <path d={`M${kx} ${ky} L${ax} ${ay}`} stroke={SOCK} strokeWidth="13" strokeLinecap="round" />
        <path d={`M${kx - 7} ${ky + 8} l14 0 M${kx - 7} ${ky + 13} l14 0`} stroke="#246bff" strokeWidth="2.5" />
        <path d={`M${ax - 7} ${ay - 2} q14 -5 27 5 q4 4 1 8 h-31 z`} fill="#07080c" />
        <path d={`M${ax - 7} ${ay + 9} h31`} stroke="#00e5ff" strokeWidth="2.5" />
      </g>
    </g>
  );
}

function FootballPlayer({ scene }) {
  return (
    <div className={`player p-${scene}`}>
      <svg viewBox="0 0 200 260" aria-label="Football player">
        <ellipse cx="96" cy="234" rx="52" ry="6" fill="#000" opacity=".55" />
        <g className="lean">
          {/* back arm + stance leg */}
          <g className="arm-b" style={{ transformOrigin: "78px 80px" }}>
            <path d="M78 80 L68 108 L76 132" stroke={SKIN_D} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M78 80 L72 94" stroke="#1a56d6" strokeWidth="16" strokeLinecap="round" />
          </g>
          <Leg cls="st" hip={[80, 132]} knee={[76, 180]} ankle={[70, 224]} shade />
          <Leg cls="kk" hip={[98, 132]} knee={[100, 180]} ankle={[102, 224]} />
          {/* torso */}
          <path d="M76 76 Q92 64 112 76 L110 104 L108 140 Q93 148 80 140 L78 104 Z" fill={JERSEY} />
          <path d="M76 76 Q92 64 112 76 L111 86 Q93 76 77 86 Z" fill="#8b5cf6" opacity=".55" />
          <path d="M108 80 L108 140" stroke="#00e5ff" strokeWidth="3" opacity=".8" />
          <path d="M84 70 Q94 80 104 70" stroke="#fff" strokeWidth="3" fill="none" />
          <text x="93" y="118" fontSize="25" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="Arial Black,Impact,sans-serif">10</text>
          <rect x="78" y="136" width="32" height="9" rx="3" fill={SHORTS} />
          {/* head */}
          <path d="M88 62 h12 v10 h-12z" fill={SKIN_D} />
          <ellipse cx="94" cy="48" rx="15" ry="17" fill={SKIN} />
          <ellipse cx="80" cy="50" rx="3" ry="5" fill={SKIN_D} />
          <path d="M96 45 l12 -2 M99 49 q4 -3 8 0" stroke="#0b0d14" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="103" cy="49" r="1.8" fill="#00e5ff" />
          <path d="M98 59 q5 2 9 -1" stroke="#a5604a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <g className="hair" style={{ transformOrigin: "92px 36px" }}>
            <path d="M107 38 Q104 20 88 20 Q72 22 72 42 L56 38 L68 30 L48 22 L70 22 L56 8 L78 14 L76 -2 L92 12 L104 0 L106 14 L118 8 L112 24 Q118 28 107 38 Z" fill="#0b0d14" />
            <path d="M70 22 L56 8 L78 14 M92 12 L104 0" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity=".8" />
          </g>
          {/* front arm */}
          <g className="arm-f" style={{ transformOrigin: "108px 80px" }}>
            <path d="M108 80 L120 106 L114 132" stroke={SKIN} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M108 80 L114 94" stroke={JERSEY} strokeWidth="16" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Football({ scene, onKick }) {
  const hidden = FORM.includes(scene);
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  /* proximity: light up the ball when the cursor gets close, not only on direct hover */
  useEffect(() => {
    if (scene !== "intro") return setNear(false);
    const move = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      setNear(d < r.width * 1.6);
    };
    const leave = () => setNear(false);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
  }, [scene]);

  return (
    <button
      ref={ref}
      className={`ball ${scene === "intro" ? "ball-idle" : ""} ${near && scene === "intro" ? "near" : ""} ${scene === "flying" ? "ball-fly" : ""}`}
      onClick={() => { setNear(false); onKick(); }}
      disabled={scene !== "intro"}
      aria-label="Kick the ball"
      style={{ visibility: hidden ? "hidden" : "visible" }}
    >
      <span className="trail" />
      {scene === "intro" && <span className="kick-hint">KICK</span>}
      <svg viewBox="0 0 100 100">
        <defs>
          <radialGradient id="bg" cx="35%" cy="30%">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#aeb8cc" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg)" />
        <polygon points="50,32 66,44 60,63 40,63 34,44" fill="#10131c" />
        <path d="M50 32V10M66 44l22-8M60 63l12 20M40 63L28 83M34 44L12 36" stroke="#10131c" strokeWidth="3" />
        <ellipse cx="36" cy="27" rx="15" ry="9" fill="#fff" opacity=".45" /><circle cx="50" cy="50" r="48" fill="none" stroke="#00e5ff" strokeWidth="1" opacity=".3" />
      </svg>
    </button>
  );
}

function ImpactEffect() {
  return (
    <div className="impact" aria-hidden="true">
      <div className="flash" />
      <div className="ring r1" /><div className="ring r2" />
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className="spark" style={{ "--a": `${(360 / 12) * i + (i % 2) * 6}deg`, "--d": `${26 + (i % 3) * 10}vmin`, "--l": `${16 + (i % 2) * 22}px` }} />
      ))}
    </div>
  );
}

function Field({ id, label, value, onChange, onBlur, touched, err, busy, placeholder, auto, pw }) {
  const [show, setShow] = useState(false);
  const input = (
    <input id={id} type={pw && !show ? "password" : "text"} inputMode={id === "em" ? "email" : undefined} value={value}
      disabled={busy} autoComplete={auto} placeholder={placeholder} className={touched ? (err ? "bad" : "ok") : ""}
      onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
  );
  return (
    <>
      <label htmlFor={id}>{label}</label>
      {pw ? (
        <div className="pw">
          {input}
          <button type="button" className={`eye ${show ? "on" : ""}`} onClick={() => setShow((x) => !x)} aria-label={show ? "Hide password" : "Show password"}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path className="slash" d="M4 4l16 16" />
            </svg>
          </button>
        </div>
      ) : input}
      <small className="err">{touched && err}</small>
    </>
  );
}

function LoginForm({ scene, mode, setMode, onSubmit, onReset }) {
  const [v, setV] = useState({
  user: "",
  pass: "",
  name: "",
  email: "",
  sp: "",
  sc: "",
});

const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false);
  const [t, setT] = useState({});
  const [phase, setPhase] = useState(null); // out → in
  const [dir, setDir] = useState("fwd");
  const [fx, setFx] = useState(false);
  const [fresh, setFresh] = useState(true);

  const wrapRef = useRef(null);
  const bodyRef = useRef(null);
  /* the panel stays put; only its inner height eases to fit the new content */
  useLayoutEffect(() => {
    const w = wrapRef.current, b = bodyRef.current;
    if (w && b && w.style.height) w.style.height = b.offsetHeight + "px";
  }, [mode]);

  const up = mode === "up";
  // Visual-only form: no authentication or loading state.
  const busy = false;
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
  const keys = up ? ["name", "email", "sp", "sc"] : ["user", "pass"];

  const go = (to) => {
    if (fx || busy) return;
    if (wrapRef.current && bodyRef.current) wrapRef.current.style.height = bodyRef.current.offsetHeight + "px";
    setDir(to === "up" ? "fwd" : "back"); setFresh(false); setFx(true); setPhase("out");
    setTimeout(() => { setMode(to); setT({}); setPhase("in"); }, 320);   // old content has dissolved
    setTimeout(() => { setPhase(null); if (wrapRef.current) wrapRef.current.style.height = ""; }, 780);
    setTimeout(() => setFx(false), 720);
  };

  const submit = (e) => {
  e.preventDefault();
};

  if (scene === "success" || scene === "resetting") {
    return (
      <div className={`panel success ${scene === "resetting" ? "leave" : ""}`}>
        <div className="status"><i /> {up ? "ACCOUNT REGISTRATION" : "ACCOUNT ACCESS"}</div>
        <svg className="tick" viewBox="0 0 52 52" width="72" height="72">
          <circle cx="26" cy="26" r="24" fill="none" stroke="#00e5ff" strokeWidth="1.6" opacity=".5" />
          <path d="M15 27l8 8 15-17" fill="none" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2>{up ? "ACCOUNT CREATED" : "ACCESS GRANTED"}</h2>
        <p className="sub">{up ? "Your account has been created successfully." : "Authentication successful."}</p>
        <button className="btn ghost" onClick={onReset}>KICK AGAIN</button>
      </div>
    );
  }

  const F = (id, k, label, ph, auto, pw) => (
    <Field id={id} label={label} value={v[k]} onChange={set(k)} onBlur={blur(k)} touched={t[k]} err={E[k]} busy={busy} placeholder={ph} auto={auto} pw={pw} />
  );

  return (
    <div className="panel">
      <div ref={wrapRef} className={`morph ${fx || phase ? "busy" : ""}`}>
      <div ref={bodyRef} className={`body ${fresh ? "fresh" : ""} ${phase || ""}`}>
        <div className="status"><i /> {up ? "ACCOUNT REGISTRATION" : "ACCOUNT ACCESS"}</div>
        <h2>{up ? "Create account" : "Welcome back"}</h2>
        <p className="sub">{up ? "Enter your information to create an account." : "Enter your credentials to continue."}</p>

        {up ? (
          <>
            {F("nm", "name", "FULL NAME", "Enter your name", "name")}
            {F("em", "email", "EMAIL", "Enter your email", "email")}
            {F("sp", "sp", "PASSWORD", "Create password", "new-password", true)}
            {F("sc", "sc", "CONFIRM PASSWORD", "Confirm password", "new-password", true)}
          </>
        ) : (
          <>
            {F("u", "user", "USERNAME", "Enter username", "username")}
            {F("p", "pass", "PASSWORD", "Enter password", "current-password", true)}
          </>
        )}

        {up ? (
          <label className={`check-row ${t.agree && !agree ? "bad" : ""}`}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>I agree to the terms</span>
          </label>
        ) : (
          <label className="check-row">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>Remember me</span>
          </label>
        )}

        <button
  className="btn"
  type="button"
>
  {up ? "CREATE ACCOUNT" : "SIGN IN"}
</button>
        <p className="switch">
          {up ? "Already have an account?" : "Don't have an account?"}
          <button type="button" className="link" disabled={fx || busy} onClick={() => go(up ? "in" : "up")}>{up ? "SIGN IN" : "CREATE ACCOUNT"}</button>
        </p>
      </div>
      </div>
      {fx && (
        <>
          <div className="fx-lane"><span className={`fx-ball ${dir}`} /></div>
          <span className={`fx-pulse ${dir}`} />
          <span className={`fx-sweep ${dir}`} />
        </>
      )}
    </div>
  );
}

export default function KickToLogin() {
  const [scene, setScene] = useState("intro");
  const [mode, setMode] = useState("in");

  useEffect(() => {
    if (!TIMING[scene]) return;
    const t = setTimeout(() => setScene(NEXT[scene]), TIMING[scene]);
    return () => clearTimeout(t);
  }, [scene]);

  const showForm = FORM.includes(scene);
  const after = showForm && scene !== "resetting";
  const cine = ["preparing", "kicking", "flying", "impact"].includes(scene);

  return (
    <div className={`ktl mode-${mode} ${scene === "impact" ? "shake" : ""} ${scene === "flying" ? "tremor" : ""}`}>
      <style>{CSS}</style>

      <div className={`world ${after ? "after" : ""}`}>
        <div className="sky" />
        <div className="beam b1" /><div className="beam b2" />
        <div className="flood f1" /><div className="flood f2" />
        <div className="crowd" />
        <div className="grass">
          <svg viewBox="0 0 800 300" preserveAspectRatio="none">
            <g fill="none" stroke="#9fe9ff" strokeOpacity=".28" strokeWidth="2">
              <rect x="10" y="10" width="780" height="290" />
              <path d="M400 10V300" />
              <circle cx="400" cy="10" r="110" />
              <rect x="230" y="10" width="340" height="110" />
            </g>
          </svg>
        </div>
        <div className="haze" />

        <header className={`title ${scene === "intro" ? "" : "hide"}`}>
          <h1>KICK TO LOGIN</h1>
          <p>One kick. One access.</p>
        </header>

        <div className={`pitch s-${scene}`}>
          <div className="ballglow" />
          <FootballPlayer scene={scene} />
          <Football scene={scene} onKick={() => scene === "intro" && setScene("preparing")} />
        </div>
      </div>

      <div className="topbar"><span><i /> SECURE ACCESS</span><span>SECURE CHANNEL</span></div>
      <div className="ambient" />
      <div className="vignette" />
      <div className={`bar top ${cine ? "on" : ""}`} /><div className={`bar bot ${cine ? "on" : ""}`} />

      {scene === "intro" && (
        <div className="hint"><strong>READY?</strong><span>Click the ball to kick</span></div>
      )}

      {scene === "impact" && <ImpactEffect />}
      {after && <div className="glow" />}

      {showForm && (
        <main className="stage">
          <LoginForm scene={scene} mode={mode} setMode={setMode} onSubmit={() => setScene("authenticating")} onReset={() => { setMode("in"); setScene("resetting"); }} />
        </main>
      )}
    </div>
  );
}

const CSS = `
/* ===== tokens ===== */
.ktl{--ink:#07090D;--navy:#0B1020;--slate:#111827;--mute:#A7B0C0;--cyan:#00E5FF;--blue:#2563EB;--violet:#7C3AED;
--H:clamp(150px,min(29vh,34vw),330px);--B:clamp(56px,calc(var(--H)*.25),76px);--run:-.55;--floor:21;
--up:calc((50 - var(--floor))*1vh - var(--B)/2);--ease:cubic-bezier(.16,1,.3,1);
--t-xs:10.5px;--t-sm:13px;--t-md:15px;--t-lg:19px;
position:fixed;inset:0;overflow:hidden;isolation:isolate;background:var(--ink);color:#fff;font-family:Inter,"Segoe UI",system-ui,sans-serif;perspective:800px;-webkit-font-smoothing:antialiased}
.ktl *{box-sizing:border-box}
/* ===== world: layered stadium ===== */
.world{position:absolute;inset:0;transition:filter 1.3s var(--ease),transform 1.3s var(--ease)}
.world.after{filter:blur(7px) brightness(.36);transform:scale(1.05)}
.sky{position:absolute;inset:0;background:radial-gradient(ellipse 50% 40% at 50% 66%,rgb(37 99 235/.22),transparent 72%),radial-gradient(ellipse 90% 55% at 50% -5%,#16213f,transparent 70%),linear-gradient(var(--ink),var(--navy) 58%,var(--ink))}
.beam{position:absolute;top:-10%;width:30vw;height:70%;filter:blur(18px);opacity:.1;background:linear-gradient(#cfe8ff,transparent 85%);clip-path:polygon(46% 0,54% 0,100% 100%,0 100%)}
.b1{left:6%;transform:rotate(15deg)}.b2{right:6%;transform:rotate(-15deg)}
.crowd{position:absolute;left:0;right:0;top:33%;height:18%;background:repeating-linear-gradient(0deg,rgb(120 160 255/.05) 0 1px,transparent 1px 7px),linear-gradient(#0c1428,#05070b 75%);clip-path:polygon(0 40%,6% 30%,14% 38%,24% 26%,36% 36%,50% 24%,64% 36%,76% 26%,86% 38%,94% 30%,100% 40%,100% 100%,0 100%);opacity:.95}
.grass{position:absolute;left:-30%;right:-30%;bottom:-8%;height:54%;transform:rotateX(64deg);transform-origin:50% 100%;
background:repeating-linear-gradient(90deg,rgb(255 255 255/.012) 0 2px,transparent 2px 5px),repeating-linear-gradient(90deg,#0b1a1c 0 90px,#081317 90px 180px);mask-image:linear-gradient(transparent,#000 35%)}
.grass::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 38% 55% at 50% 72%,rgb(120 190 255/.2),transparent 70%);transition:opacity .6s var(--ease)}
.grass svg{position:absolute;inset:0;width:100%;height:100%}
.haze{position:absolute;left:0;right:0;bottom:30%;height:16%;background:linear-gradient(transparent,rgb(124 160 255/.07),transparent);filter:blur(14px);transition:opacity .6s}
.ktl:has(.ball-idle:is(:hover,.near)) .grass::after{opacity:1.6}
.ktl:has(.ball-idle:is(:hover,.near)) .haze{opacity:1.8}
.vignette{position:absolute;inset:0;pointer-events:none;z-index:3;background:radial-gradient(ellipse at 50% 55%,transparent 38%,rgb(0 0 0/.75) 100%),linear-gradient(#0006,transparent 22%,transparent 78%,#0007)}
.bar{position:absolute;left:0;right:0;height:0;background:#000;transition:height .7s var(--ease);z-index:9;pointer-events:none}
.bar.top{top:0}.bar.bot{bottom:0}.bar.on{height:6vh}
/* ===== branding ===== */
.topbar{position:absolute;top:0;left:0;right:0;z-index:4;display:flex;justify-content:space-between;padding:clamp(14px,2.4vh,26px) clamp(16px,3vw,40px);font-size:var(--t-xs);letter-spacing:.3em;color:var(--mute)}
.topbar span:first-child{display:inline-flex;align-items:center;gap:9px}
.topbar i{width:6px;height:6px;border-radius:50%;background:var(--cyan);box-shadow:0 0 8px var(--cyan);animation:blink 2s ease-in-out infinite}
.title{position:absolute;top:clamp(56px,13vh,140px);width:100%;text-align:center;padding:0 16px;transition:opacity .6s var(--ease),transform .6s var(--ease)}
.title.hide{opacity:0;transform:translateY(-18px)}
.title h1{margin:0;font-size:clamp(17px,2.6vw,30px);font-weight:700;letter-spacing:.46em;padding-left:.46em;color:#fff}
.title h1::after{content:"";display:block;width:clamp(36px,5vw,60px);height:1px;margin:14px auto 12px;background:linear-gradient(90deg,transparent,var(--cyan),transparent)}
.title p{margin:0;letter-spacing:.5em;padding-left:.5em;font-size:var(--t-xs);color:var(--mute);opacity:.7}
/* ===== pitch ===== */
.pitch{position:absolute;left:0;right:0;bottom:calc(var(--floor)*1%);height:var(--B)}
.ballglow{position:absolute;left:50%;bottom:calc(var(--B)*-.4);width:calc(var(--B)*6);height:calc(var(--B)*3.2);transform:translateX(-50%);background:radial-gradient(closest-side,rgb(0 229 255/.28),rgb(37 99 235/.1) 55%,transparent);opacity:.5;transition:opacity .5s var(--ease),transform .5s var(--ease);pointer-events:none}
.pitch:has(.ball-idle:is(:hover,.near)) .ballglow{opacity:1;transform:translateX(-50%) scale(1.2)}
.pitch.s-preparing .ballglow,.pitch.s-kicking .ballglow{opacity:.85}
.pitch.s-flying .ballglow{opacity:1;transform:translateX(-50%) scale(1.5)}
.player{position:absolute;bottom:calc(var(--H)*-.108);height:var(--H);width:calc(var(--H)*.77);left:calc(50% - var(--H)*.8);transform:translateX(calc(var(--H)*var(--run)));transition:transform .9s cubic-bezier(.45,0,.2,1)}
.player svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(2px 0 0 rgb(0 229 255/.4)) drop-shadow(0 0 22px rgb(37 99 235/.28))}
.p-preparing,.p-kicking,.p-flying,.p-impact,.p-login,.p-authenticating,.p-success,.p-resetting{transform:translateX(0)}
.p-preparing{animation:run 1.5s cubic-bezier(.4,0,.5,1) forwards}
@keyframes run{0%,15%{transform:translateX(calc(var(--H)*var(--run)))}78%{transform:translateX(calc(var(--H)*-.04))}100%{transform:translateX(0)}}
.lean{transform-origin:96px 232px;transition:transform .8s cubic-bezier(.45,0,.2,1)}
.p-intro .lean{animation:breathe 2.6s ease-in-out infinite}
@keyframes breathe{50%{transform:translateY(-3px) rotate(1deg)}}
.p-preparing .lean{animation:lean-prep 1.5s linear forwards}
@keyframes lean-prep{0%{transform:none}14%{transform:translateY(3px) rotate(3deg)}28%{transform:translateY(-6px) rotate(9deg)}38%{transform:translateY(1px) rotate(9deg)}48%{transform:translateY(-6px) rotate(9deg)}58%{transform:translateY(1px) rotate(9deg)}68%{transform:translateY(-6px) rotate(8deg)}85%{transform:translateY(4px) scaleY(.97) rotate(-7deg)}100%{transform:translateY(4px) scaleY(.97) rotate(-7deg)}}
.p-kicking .lean{animation:lean-kick .3s cubic-bezier(.5,0,.8,.4) forwards}
@keyframes lean-kick{from{transform:translateY(4px) scaleY(.97) rotate(-7deg)}to{transform:translateY(-2px) scaleY(1.02) rotate(11deg)}}
.p-flying .lean{animation:lean-follow .7s cubic-bezier(.1,.7,.2,1) forwards}
@keyframes lean-follow{from{transform:translateY(-2px) rotate(11deg)}50%{transform:translateY(-10px) rotate(15deg)}to{transform:translateY(-4px) rotate(14deg)}}
.p-impact .lean,.p-login .lean,.p-authenticating .lean,.p-success .lean,.p-resetting .lean{transform:translateY(-4px) rotate(14deg)}
.kk-t,.kk-s,.st-t,.st-s,.arm-f,.arm-b,.hair{transition:transform .8s cubic-bezier(.45,0,.2,1)}
.hair{animation:sway 2.6s ease-in-out infinite}
@keyframes sway{50%{transform:rotate(2.5deg)}}
.p-preparing .hair{animation:none;transform:rotate(-9deg)}
.p-preparing .kk-t{animation:kt-prep 1.5s linear forwards}.p-preparing .kk-s{animation:ks-prep 1.5s linear forwards}
.p-preparing .st-t{animation:st-prep 1.5s linear forwards}.p-preparing .st-s{animation:ss-prep 1.5s linear forwards}
.p-preparing .arm-f{animation:af-prep 1.5s linear forwards}.p-preparing .arm-b{animation:ab-prep 1.5s linear forwards}
@keyframes kt-prep{0%,18%{transform:none}30%{transform:rotate(-26deg)}42%{transform:rotate(14deg)}54%{transform:rotate(-26deg)}66%{transform:rotate(12deg)}100%{transform:rotate(38deg)}}
@keyframes ks-prep{0%,18%{transform:none}30%{transform:rotate(16deg)}42%{transform:rotate(40deg)}54%{transform:rotate(16deg)}66%{transform:rotate(44deg)}100%{transform:rotate(78deg)}}
@keyframes st-prep{0%,18%{transform:none}30%{transform:rotate(14deg)}42%{transform:rotate(-24deg)}54%{transform:rotate(14deg)}66%{transform:rotate(-14deg)}100%{transform:rotate(-4deg)}}
@keyframes ss-prep{0%,18%{transform:none}30%{transform:rotate(30deg)}42%{transform:rotate(6deg)}54%{transform:rotate(30deg)}66%{transform:rotate(8deg)}100%{transform:rotate(4deg)}}
@keyframes af-prep{0%,18%{transform:none}30%{transform:rotate(-38deg)}42%{transform:rotate(30deg)}54%{transform:rotate(-38deg)}66%{transform:rotate(26deg)}100%{transform:rotate(-30deg)}}
@keyframes ab-prep{0%,18%{transform:none}30%{transform:rotate(34deg)}42%{transform:rotate(-36deg)}54%{transform:rotate(34deg)}66%{transform:rotate(-30deg)}100%{transform:rotate(36deg)}}
.p-kicking .kk-t{animation:kt-kick .3s cubic-bezier(.5,0,.8,.4) forwards}.p-kicking .kk-s{animation:ks-kick .3s cubic-bezier(.5,0,.8,.4) forwards}
@keyframes kt-kick{from{transform:rotate(38deg)}to{transform:rotate(-40deg)}}
@keyframes ks-kick{from{transform:rotate(78deg)}to{transform:rotate(-10deg)}}
.p-kicking .arm-f{transform:rotate(-70deg);transition-duration:.3s}.p-kicking .arm-b{transform:rotate(-30deg);transition-duration:.3s}
.p-flying .kk-t{animation:kt-follow .8s cubic-bezier(.1,.7,.2,1) forwards}.p-flying .kk-s{animation:ks-follow .8s cubic-bezier(.1,.7,.2,1) forwards}
@keyframes kt-follow{from{transform:rotate(-40deg)}to{transform:rotate(-66deg)}}
@keyframes ks-follow{from{transform:rotate(-10deg)}35%{transform:rotate(-30deg)}to{transform:rotate(-14deg)}}
.p-impact .kk-t,.p-login .kk-t,.p-authenticating .kk-t,.p-success .kk-t,.p-resetting .kk-t{transform:rotate(-66deg)}
.p-impact .kk-s,.p-login .kk-s,.p-authenticating .kk-s,.p-success .kk-s,.p-resetting .kk-s{transform:rotate(-14deg)}
.p-flying .arm-f,.p-impact .arm-f,.p-login .arm-f,.p-authenticating .arm-f,.p-success .arm-f,.p-resetting .arm-f{transform:rotate(-60deg)}
.p-flying .arm-b,.p-impact .arm-b,.p-login .arm-b,.p-authenticating .arm-b,.p-success .arm-b,.p-resetting .arm-b{transform:rotate(-40deg)}
.ball{position:absolute;bottom:0;left:50%;width:var(--B);height:var(--B);margin-left:calc(var(--B)/-2);padding:0;border:0;background:none;cursor:pointer;z-index:2;transform-origin:50% 50%;
transition:transform .5s var(--ease),filter .5s var(--ease);filter:drop-shadow(0 10px 7px rgb(0 0 0/.7)) drop-shadow(0 0 10px rgb(0 229 255/.18))}
.ball:disabled{cursor:default}
.ball svg{width:100%;height:100%;display:block}
.ball::after{content:"";position:absolute;inset:-12%;border-radius:50%;border:1px solid var(--cyan);opacity:0;transform:scale(.85);transition:opacity .5s var(--ease),transform .5s var(--ease)}
.ball-idle{animation:ball-in .8s var(--ease) backwards}
.ball-idle::before{content:"";position:absolute;inset:-12%;border-radius:50%;border:1px solid rgb(0 229 255/.5);animation:halo 2.6s ease-out infinite}
.ball-idle.near,.ball-idle:hover{transform:translateY(-6px) scale(1.08);filter:drop-shadow(0 18px 10px rgb(0 0 0/.6)) drop-shadow(0 0 20px rgb(0 229 255/.5))}
.ball-idle.near::after,.ball-idle:hover::after{opacity:.85;transform:scale(1)}
.ball-idle:active{transform:translateY(-2px) scale(1.02)}
@keyframes ball-in{from{opacity:0;transform:translateY(-28px) scale(.4)}}
@keyframes halo{from{transform:scale(.9);opacity:.8}to{transform:scale(1.8);opacity:0}}
.ball-fly{z-index:5;animation:fly 1s cubic-bezier(.6,.02,.85,.4) forwards}
.ball-fly svg{animation:spin .22s linear infinite}
@keyframes fly{0%{transform:translateY(0) scale(1,1);filter:blur(0)}5%{transform:translateY(-1vh) scale(1.2,.85)}16%{transform:translateY(calc(var(--up)*-.12)) scale(1.5);filter:blur(0)}55%{transform:translateY(calc(var(--up)*-.55)) scale(6);filter:blur(1px)}88%{transform:translateY(calc(var(--up)*-.93)) scale(19);filter:blur(2px)}100%{transform:translateY(calc(var(--up)*-1)) scale(29,27);filter:blur(4px) brightness(1.3)}}
@keyframes spin{to{transform:rotate(360deg)}}
.trail{position:absolute;left:50%;top:40%;width:70%;height:420%;transform:translateX(-50%);background:linear-gradient(#00e5ff00,#00e5ff66 70%,#fff3);filter:blur(7px);border-radius:50%;opacity:0;z-index:-1}
.ball-fly .trail{opacity:.9;transition:opacity .2s}
.hint{position:absolute;left:0;right:0;bottom:6.5%;text-align:center;display:flex;flex-direction:column;gap:7px;animation:fade 1s .6s both}
.hint strong{letter-spacing:.5em;padding-left:.5em;color:#fff;font-size:13px;font-weight:700}
.hint span{color:#7f89a3;font-size:12.5px;letter-spacing:.12em}
@keyframes fade{from{opacity:0;transform:translateY(8px)}}
.tremor{animation:trem .09s linear infinite}
@keyframes trem{25%{transform:translate(1px,-1px)}75%{transform:translate(-1px,1px)}}
.shake{animation:shake .55s cubic-bezier(.36,.07,.19,.97)}
@keyframes shake{10%,90%{transform:translate(-3px,2px)}20%,80%{transform:translate(6px,-4px)}30%,50%,70%{transform:translate(-10px,5px)}40%,60%{transform:translate(10px,-5px)}}
.impact{position:absolute;inset:0;pointer-events:none;z-index:8}
.flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,#fff 10%,#bff6ffcc 35%,#246bff55 65%,transparent 85%);animation:flash .75s cubic-bezier(.2,.6,.3,1) forwards}
@keyframes flash{0%{opacity:1}25%{opacity:.9}100%{opacity:0}}
.ring{position:absolute;left:50%;top:50%;width:18vmin;height:18vmin;margin:-9vmin;border-radius:50%;border:1.5px solid #bff6ff;box-shadow:0 0 28px #00e5ff77,inset 0 0 28px #246bff44;opacity:0;animation:ring 1s .05s cubic-bezier(.1,.6,.3,1) forwards}
.r2{border-color:#8b5cf6;animation-delay:.2s}
@keyframes ring{0%{transform:scale(.2);opacity:1}100%{transform:scale(8);opacity:0}}
.spark{position:absolute;left:50%;top:50%;width:2px;height:var(--l);margin:-10px -1px;border-radius:2px;background:linear-gradient(#fff,#00e5ff00);opacity:0;animation:spark .8s .05s cubic-bezier(.1,.7,.3,1) forwards}
@keyframes spark{0%{opacity:1;transform:rotate(var(--a)) translateY(0)}100%{opacity:0;transform:rotate(var(--a)) translateY(calc(var(--d)*-1))}}
.glow{position:absolute;left:50%;top:50%;width:min(150vw,900px);height:min(110vh,700px);transform:translate(-50%,-50%);background:radial-gradient(closest-side,#246bff26,#8b5cf612 50%,transparent);filter:blur(24px);animation:glow 1.4s .1s ease-out both;pointer-events:none}
@keyframes glow{from{opacity:0;transform:translate(-50%,-50%) scale(.3)}}
/* ===== kick hint ===== */
.ball-idle.near::after{animation:ring-breathe 1.8s ease-in-out infinite}
@keyframes ring-breathe{50%{transform:scale(1.12);opacity:.45}}
.kick-hint{position:absolute;left:50%;bottom:calc(100% + 16px);transform:translate(-50%,6px);display:flex;flex-direction:column;align-items:center;gap:6px;font-size:var(--t-xs);font-weight:600;letter-spacing:.3em;padding-left:.3em;color:#fff;opacity:0;white-space:nowrap;pointer-events:none;transition:opacity .4s var(--ease),transform .4s var(--ease)}
.kick-hint::after{content:"";width:1px;height:12px;background:linear-gradient(var(--cyan),transparent)}
.ball-idle.near .kick-hint,.ball-idle:hover .kick-hint{opacity:1;transform:translate(-50%,0)}
/* ===== floodlights / ambient ===== */
@property --r{syntax:"<length>";inherits:false;initial-value:0px}
.flood{position:absolute;top:-8vh;width:min(48vw,640px);aspect-ratio:1;pointer-events:none;background:radial-gradient(circle at 50% 32%,rgb(150 210 255/.2),rgb(37 99 235/.08) 32%,transparent 62%)}
.flood::after{content:"";position:absolute;left:50%;top:32%;width:30px;height:8px;border-radius:50%;transform:translate(-50%,-50%);background:#cfeaff;opacity:.75;box-shadow:0 0 20px 5px rgb(150 210 255/.35)}
.f1{left:-8%}.f2{right:-8%}
.ambient{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .9s var(--ease);background:radial-gradient(ellipse 60% 50% at 50% 55%,rgb(124 58 237/.16),transparent 70%)}
.mode-up .ambient{opacity:1}
.mode-up .status i{background:#a78bfa;box-shadow:0 0 8px #a78bfa}
.mode-up .panel::after{width:46%}
.panel::after{transition:width .6s var(--ease)}
/* ===== auth switch + football pass ===== */
.switch{margin:22px 0 0;text-align:center;font-size:var(--t-sm);color:var(--mute)}
.link{position:relative;margin-left:8px;padding:2px 0;border:0;background:none;color:#fff;font:inherit;font-size:12px;font-weight:600;letter-spacing:.14em;cursor:pointer;transition:color .25s}
.link::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:var(--cyan);transform:scaleX(.35);transform-origin:left;transition:transform .35s var(--ease)}
.link:hover:not(:disabled){color:var(--cyan)}.link:hover::after{transform:scaleX(1)}
.link:disabled{cursor:default;opacity:.6}
.check-row.bad span{color:#ff8a9c}
.morph{transition:height .32s var(--ease)}.morph.busy{overflow:hidden}
/* old content dissolves (150ms→320ms), new content is rebuilt in stages */
.body.out>*{animation:m-out .17s .15s cubic-bezier(.5,0,.8,.4) both}
.body.out>*:nth-child(n+4){animation-delay:.18s}.body.out>*:nth-child(n+8){animation-delay:.21s}
.body.in>*{animation:m-in .3s var(--ease) backwards}
.body.in>*:nth-child(n+4){animation-delay:.05s}.body.in>*:nth-child(n+7){animation-delay:.09s}.body.in>*:nth-child(n+10){animation-delay:.13s}
@keyframes m-out{to{opacity:0;transform:scale(.985);filter:blur(5px)}}
@keyframes m-in{from{opacity:0;transform:translateY(8px) scale(.985);filter:blur(5px);clip-path:inset(0 0 100% 0)}}
.fx-lane{position:absolute;left:16px;right:16px;bottom:16px;height:20px;pointer-events:none}
.fx-ball{position:absolute;top:0;left:0;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#aeb8cc 70%);box-shadow:0 0 12px rgb(0 229 255/.6);animation:pass-fwd .26s cubic-bezier(.55,0,.35,1) forwards}
.fx-ball::before{content:"";position:absolute;right:70%;top:50%;width:90px;height:2px;transform:translateY(-50%);background:linear-gradient(90deg,transparent,rgb(0 229 255/.7))}
.fx-ball.back{animation-name:pass-back}
.fx-ball.back::before{right:auto;left:70%;transform:translateY(-50%) scaleX(-1)}
@keyframes pass-fwd{0%{left:0;opacity:0;transform:rotate(0) scale(.6)}12%{opacity:1}88%{opacity:1}100%{left:calc(100% - 20px);opacity:0;transform:rotate(720deg) scale(1.15)}}
@keyframes pass-back{0%{left:calc(100% - 20px);opacity:0;transform:rotate(0) scale(.6)}12%{opacity:1}88%{opacity:1}100%{left:0;opacity:0;transform:rotate(-720deg) scale(1.15)}}
.fx-pulse{position:absolute;bottom:16px;right:16px;width:20px;height:20px;border-radius:50%;border:1px solid var(--cyan);opacity:0;pointer-events:none;animation:fx-pulse .35s .25s ease-out forwards}
.fx-pulse.back{right:auto;left:16px}
@keyframes fx-pulse{from{opacity:.9;transform:scale(1)}to{opacity:0;transform:scale(3.2)}}
.fx-sweep{--sx:100%;position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;background:radial-gradient(circle at var(--sx) 100%,transparent calc(var(--r) - 2px),rgb(0 229 255/.5) var(--r),rgb(0 229 255/.07) calc(var(--r) + 22px),transparent calc(var(--r) + 60px));animation:fx-sweep .45s .25s cubic-bezier(.2,.6,.3,1) forwards}
.fx-sweep.back{--sx:0%}
@keyframes fx-sweep{0%{--r:0px;opacity:1}100%{--r:560px;opacity:0}}
/* ===== login ===== */
.stage{position:absolute;inset:0;display:flex;padding:16px;overflow-y:auto;overflow-x:hidden;z-index:6}
.panel{position:relative;margin:auto;width:min(100%,400px);padding:clamp(26px,5vw,40px);border-radius:10px;
background:linear-gradient(180deg,rgb(17 24 39/.7),rgb(11 16 32/.82));border:1px solid rgb(255 255 255/.08);
backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%);
box-shadow:0 36px 90px rgb(0 0 0/.75),0 0 60px rgb(37 99 235/.1),inset 0 1px 0 rgb(255 255 255/.06);
animation:reveal 1.2s .3s var(--ease) both}
.panel::before,.panel::after{content:"";position:absolute;height:1px;pointer-events:none;transform-origin:left;animation:edge 1s .9s var(--ease) both}
.panel::before{top:-1px;left:0;width:42%;background:linear-gradient(90deg,var(--cyan),transparent);box-shadow:0 0 12px rgb(0 229 255/.6)}
.panel::after{bottom:-1px;right:0;width:30%;transform-origin:right;background:linear-gradient(270deg,rgb(124 58 237/.7),transparent)}
@keyframes edge{from{transform:scaleX(0);opacity:0}}
@keyframes reveal{0%{opacity:0;transform:scale(.94);filter:blur(10px);clip-path:circle(0% at 50% 50%)}50%{opacity:1;filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0);clip-path:circle(140% at 50% 50%)}}
.body.fresh>*{animation:rise .7s var(--ease) both;animation-delay:.85s}
.body.fresh>*:nth-child(n+3){animation-delay:.95s}.body.fresh>*:nth-child(n+6){animation-delay:1.05s}.body.fresh>*:nth-child(n+9){animation-delay:1.15s}
@keyframes rise{from{opacity:0;transform:translateY(8px)}}
.panel.success{animation:morph .7s var(--ease) both;text-align:center}
.panel.success>*{animation:rise .6s var(--ease) both;animation-delay:.1s}
@keyframes morph{from{opacity:.6;transform:scale(.97);filter:blur(6px)}}
.panel.leave{animation:leave .5s cubic-bezier(.5,0,.8,.4) forwards}.panel.leave>*{animation:none}
@keyframes leave{to{opacity:0;transform:scale(.94);filter:blur(10px)}}
.status{display:inline-flex;align-items:center;gap:9px;font-size:var(--t-xs);letter-spacing:.3em;color:var(--mute);margin-bottom:22px}
.status i{width:6px;height:6px;border-radius:50%;background:var(--cyan);box-shadow:0 0 8px var(--cyan);animation:blink 2s ease-in-out infinite}
@keyframes blink{50%{opacity:.35}}
.panel h2{margin:0;font-size:var(--t-lg);font-weight:600;letter-spacing:.22em;text-transform:uppercase;line-height:1.2}
.success h2{font-size:var(--t-lg)}
.panel .sub{margin:10px 0 30px;color:var(--mute);font-size:var(--t-sm);line-height:1.55}
.success .sub{margin-bottom:26px;color:#fff;opacity:.85}
.panel label{display:block;font-size:var(--t-xs);font-weight:600;letter-spacing:.22em;color:var(--mute);margin-bottom:9px}
.panel input[type=text],.panel input[type=password],.panel input:not([type]){width:100%;height:46px;padding:0 14px;border-radius:7px;border:1px solid rgb(255 255 255/.1);background:rgb(7 9 13/.65);color:#fff;font-size:var(--t-md);outline:0;transition:border-color .25s,box-shadow .25s,background .25s}
.panel input::placeholder{color:#5b667c}
.panel input:hover:not(:disabled){border-color:rgb(255 255 255/.22)}
.panel input:focus{border-color:var(--cyan);background:rgb(11 16 32/.9);box-shadow:inset 0 0 14px rgb(0 229 255/.08),0 0 0 3px rgb(0 229 255/.12)}
.panel .pw input:focus{border-color:#6f8cff;box-shadow:inset 0 0 14px rgb(124 58 237/.1),0 0 0 3px rgb(124 58 237/.14)}
/* ===== Chrome autofill fix ===== */
.panel input:-webkit-autofill,
.panel input:-webkit-autofill:hover,
.panel input:-webkit-autofill:focus,
.panel input:-webkit-autofill:active {
  -webkit-text-fill-color:#fff !important;
  -webkit-box-shadow:0 0 0 1000px rgb(7 9 13/.95) inset !important;
  box-shadow:0 0 0 1000px rgb(7 9 13/.95) inset !important;
  caret-color:#fff;
  transition:background-color 9999s ease-in-out 0s;
}
.panel input.ok{border-color:rgb(0 229 255/.4)}
.panel input.bad{border-color:#ff6b81;box-shadow:0 0 0 3px rgb(255 107 129/.1)}
.err{display:block;min-height:20px;margin:6px 0 8px;color:#ff8a9c;font-size:12px}
.pw{position:relative}.pw input{padding-right:46px!important}
.eye{position:absolute;right:3px;top:3px;width:40px;height:40px;border:0;background:none;color:#6c778e;cursor:pointer;border-radius:7px;transition:color .2s,transform .4s var(--ease)}
.eye:hover{color:var(--cyan)}.eye.on{color:var(--cyan);transform:rotate(360deg)}
.slash{stroke-dasharray:24;stroke-dashoffset:0;transition:stroke-dashoffset .35s}.eye.on .slash{stroke-dashoffset:24}
.check-row{display:flex!important;align-items:center;gap:10px;margin:4px 0 24px!important;letter-spacing:.02em!important;font-size:var(--t-sm)!important;font-weight:400!important;color:var(--mute)!important;cursor:pointer}
.check-row input{width:16px;height:16px;accent-color:var(--cyan)}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:48px;border:1px solid rgb(0 229 255/.25);border-radius:7px;font-weight:600;letter-spacing:.24em;padding-left:.24em;font-size:12px;color:#fff;cursor:pointer;
background:linear-gradient(95deg,#0f1c40,var(--blue));box-shadow:0 8px 22px rgb(37 99 235/.28),inset 0 1px 0 rgb(255 255 255/.14);transition:transform .25s var(--ease),box-shadow .25s,filter .25s}
.btn:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.15);box-shadow:0 14px 32px rgb(37 99 235/.45),0 0 24px rgb(0 229 255/.18),inset 0 1px 0 rgb(255 255 255/.2)}
.btn:active:not(:disabled){transform:translateY(1px);box-shadow:0 3px 10px rgb(37 99 235/.4)}
.btn:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}
.btn.loading{opacity:1!important;cursor:progress}
.btn.loading::before{content:"";width:14px;height:14px;border-radius:50%;border:2px solid rgb(255 255 255/.25);border-top-color:var(--cyan);animation:spin .7s linear infinite}
.btn.ghost{background:rgb(255 255 255/.04);border-color:rgb(0 229 255/.45);box-shadow:none;margin-top:4px}
.tag{text-align:center;margin:22px 0 0;font-size:10px;letter-spacing:.38em;padding-left:.38em;color:#4b566d}
.tag.ok{color:var(--cyan);margin:0 0 26px}
.tick{margin:0 auto 20px;display:block}
.tick path{stroke-dasharray:40;stroke-dashoffset:40;animation:draw .6s .25s ease-out forwards}
@keyframes draw{to{stroke-dashoffset:0}}
/* ===== responsive: recompose ===== */
@media(max-width:600px){.ktl{--H:clamp(140px,min(27vh,38vw),240px);--run:-.3;--floor:25}
.topbar span:last-child{display:none}.title{top:clamp(48px,10vh,90px)}.title h1{letter-spacing:.34em}.hint{bottom:9%}.bar.on{height:4vh}.panel{padding:26px 22px}}
@media(max-height:520px){.title{display:none}}
@media(prefers-reduced-motion:reduce){.ktl *{animation-duration:.01ms!important;animation-delay:0s!important}}
`;
