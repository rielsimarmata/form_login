import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import LoginForm from "./LoginForm";
import "./LaptopLogin.css";

/*
  idle → opening → booting → screen → emerging → login
  idle      closed laptop, "CLICK TO OPEN"
  opening   hand lifts the lid
  booting   screen lights up, "WELCOME BACK"
  screen    login form is shown inside the screen
  emerging  form comes forward out of the screen
  login     normal login page (laptop dimmed in the background)
*/
const ORDER = ["idle", "opening", "booting", "screen", "emerging", "login"];
const DURATION = { opening: 2100, booting: 1100, screen: 800, emerging: 1000 }; // ≈ 5s after the click

/* How wide the mini form on the laptop screen is, relative to the screen (see .screen-ui in the CSS) */
const PREVIEW_WIDTH_RATIO = (400 * 0.58) / 592;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb) => {
  const m = window.matchMedia(REDUCED_QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useReducedMotion = () =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false);

/* The scene is designed at a fixed size and scaled to fit the viewport */
const fitScale = () => Math.max(0.3, Math.min(1.25, (window.innerWidth - 24) / 780, (window.innerHeight - 70) / 500));
function useFitScale() {
  const [k, setK] = useState(fitScale);
  useEffect(() => {
    const onResize = () => setK(fitScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return k;
}

/* Simple stylised forearm + hand (seen from behind) in a dark sleeve. Not a character, just the gesture. */
function Hand() {
  return (
    <div className="hand" aria-hidden="true">
      <svg viewBox="0 0 240 1300" preserveAspectRatio="xMidYMin meet">
        <defs>
          <linearGradient id="skin" x1="0" x2="1">
            <stop offset="0" stopColor="#e0b090" />
            <stop offset="1" stopColor="#b57f5e" />
          </linearGradient>
          <linearGradient id="sleeve" x1="0" x2="1">
            <stop offset="0" stopColor="#1a2132" />
            <stop offset="1" stopColor="#0c111b" />
          </linearGradient>
        </defs>
        {/* forearm */}
        <path d="M72 1300 L88 360 Q92 300 100 262 L150 262 Q158 300 162 360 L186 1300 Z" fill="url(#skin)" />
        {/* thumb, back of hand, fingers */}
        <path d="M86 218 Q62 210 52 178" stroke="url(#skin)" strokeWidth="24" strokeLinecap="round" fill="none" />
        <path d="M92 272 Q70 232 74 172 L78 124 L168 124 L172 172 Q176 232 150 272 Z" fill="url(#skin)" />
        <g fill="url(#skin)">
          <rect x="77" y="88" width="23" height="80" rx="11.5" />
          <rect x="101" y="72" width="23" height="96" rx="11.5" />
          <rect x="125" y="84" width="23" height="84" rx="11.5" />
          <rect x="149" y="108" width="21" height="60" rx="10.5" />
        </g>
        <path d="M100.5 104V160M124.5 90V160M148.5 102V160" stroke="#8f5f43" strokeOpacity=".45" strokeWidth="1.5" />
        {/* sleeve cuff */}
        <path d="M66 1300 L84 396 Q125 376 168 396 L192 1300 Z" fill="url(#sleeve)" />
        <path d="M84 396 Q125 376 168 396" stroke="#00e5ff" strokeOpacity=".5" strokeWidth="1.6" fill="none" />
      </svg>
    </div>
  );
}

function Laptop({ screenRef, stage, mode, setMode }) {
  return (
    <div className="persp">
      <div className="cam">
        <div className="floor-shadow" />
        <div className="deck">
          <div className="keys" />
          <div className="trackpad" />
          <div className="deck-light" />
        </div>
        <div className="base-front" />

        <div className="lid">
          <div className="lid-edge" />
          <div className="lid-face lid-front">
            <div className="screen" ref={screenRef}>
              <div className="screen-glow" />
              {stage === "booting" && <div className="welcome">WELCOME BACK</div>}
              {/* the real form's twin, shown "inside" the screen until the real one takes over */}
              <div className="screen-ui" aria-hidden="true" inert>
                <LoginForm mode={mode} setMode={setMode} />
              </div>
              <div className="glare" />
            </div>
          </div>
          <div className="lid-face lid-back"><span className="mark" /></div>
        </div>
      </div>
    </div>
  );
}

export default function LaptopLogin() {
  const [stage, setStage] = useState("idle");
  const [mode, setMode] = useState("in");
  const [from, setFrom] = useState(null); // where the laptop screen is, for the "come forward" transition
  const screenRef = useRef(null);
  const k = useFitScale();
  const reduced = useReducedMotion();

  const at = (s) => ORDER.indexOf(stage) >= ORDER.indexOf(s);

  /* advance the sequence on a timer */
  useEffect(() => {
    const ms = DURATION[stage];
    if (!ms) return;
    const id = setTimeout(() => {
      if (stage === "screen") setFrom(measureScreen(screenRef.current));
      setStage(ORDER[ORDER.indexOf(stage) + 1]);
    }, ms);
    return () => clearTimeout(id);
  }, [stage]);

  /* only the first click counts; later clicks are ignored while the animation runs */
  const open = () => {
    if (stage !== "idle") return;
    setStage(reduced ? "login" : "opening");
  };

  const flags = [at("opening") && "is-open", at("booting") && "is-lit", at("screen") && "is-form", at("emerging") && "is-out", stage === "login" && "is-final"];
  const showForm = at("emerging");

  return (
    <div className={`ll mode-${mode} ${flags.filter(Boolean).join(" ")}`} style={{ "--k": k }}>
      <div className="world">
        <div className="sky" />
        <div className="desk" />
        <div className="aura" />

        <div className="rig">
          <Laptop screenRef={screenRef} stage={stage} mode={mode} setMode={setMode} />
          <Hand />
          <button className="hit" onClick={open} disabled={stage !== "idle"} aria-label="Click to open the laptop" />
        </div>

        <div className="hint" onClick={open} aria-hidden="true">
          <span className="hint-dot" />
          <span className="hint-text">CLICK TO OPEN</span>
          <span className="hint-line" />
        </div>
      </div>

      <div className="topbar"><span><i /> SECURE ACCESS</span><span>SECURE CHANNEL</span></div>
      <div className="ambient" />
      <div className="vignette" />
      {showForm && <div className="glow" />}

      {showForm && (
        <main className={`stage ${stage === "emerging" ? "emerging" : ""}`} inert={stage === "emerging"}>
          <div className="stage-form" style={from ? { "--fx": `${from.x}px`, "--fy": `${from.y}px`, "--fs": from.s } : undefined}>
            <LoginForm mode={mode} setMode={setMode} />
          </div>
        </main>
      )}
    </div>
  );
}

/* centre + size of the laptop screen on the page, relative to the viewport centre */
function measureScreen(el) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const panelWidth = Math.min(400, window.innerWidth - 32);
  return {
    x: r.left + r.width / 2 - window.innerWidth / 2,
    y: r.top + r.height / 2 - window.innerHeight / 2,
    s: (r.width * PREVIEW_WIDTH_RATIO) / panelWidth,
  };
}
