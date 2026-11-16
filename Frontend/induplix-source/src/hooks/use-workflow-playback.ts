import { useEffect, useRef, useState } from "react";

export const WORKFLOW_STAGE_MS = 2200;
export const WORKFLOW_DURATION_MS = WORKFLOW_STAGE_MS * 4;

/** One in-view run, explicit replay, and a complete still for reduced motion. */
export function useWorkflowPlayback() {
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(media.matches);
      if (media.matches) { setStage(3); setPlaying(false); }
    };
    sync();
    media.addEventListener("change", sync);
    const element = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      if (!media.matches) setPlaying(true);
      observer.disconnect();
    }, { threshold: 0.35 });
    if (element) observer.observe(element);
    return () => { observer.disconnect(); media.removeEventListener("change", sync); };
  }, []);

  useEffect(() => {
    if (!playing || reduced) return;
    let tick = 0;
    const timer = window.setInterval(() => {
      tick += 1;
      if (tick >= 4) { setPlaying(false); window.clearInterval(timer); }
      else setStage(tick);
    }, WORKFLOW_STAGE_MS);
    return () => window.clearInterval(timer);
  }, [playing, reduced, run]);

  const replay = () => {
    if (reduced) return;
    setStage(0); setPlaying(true); setRun((n) => n + 1);
  };
  return { ref, stage, playing, reduced, replay };
}