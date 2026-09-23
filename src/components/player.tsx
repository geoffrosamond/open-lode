import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { EPISODE, TRANSCRIPT } from "@/data/briefing";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [openScript, setOpenScript] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setFailed(true);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrent(value);
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <section className="rounded-card bg-panel text-paper p-5 shadow-sm sm:p-6" aria-label="Podcast">
      <audio ref={audioRef} preload="metadata" src={EPISODE.src} />
      <p className="text-xs font-semibold tracking-widest text-copper uppercase">
        {EPISODE.kicker}
      </p>
      <h2 className="mt-2 text-3xl leading-none font-medium text-paper">{EPISODE.title}</h2>
      <p className="mt-2 text-sm text-paper/80">
        Read by {EPISODE.voice}. {EPISODE.voiceNote}.
      </p>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          disabled={failed}
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-copper text-paper transition-colors hover:bg-copper-deep disabled:opacity-50"
          aria-label={playing ? "Pause briefing" : "Play briefing"}
        >
          {playing ? <Pause className="size-6" /> : <Play className="ml-0.5 size-6" />}
        </button>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="seek">
            Seek
          </label>
          <input
            id="seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(current, duration || 0)}
            onChange={(event) => seek(Number(event.target.value))}
            className="seek block h-2 w-full cursor-pointer appearance-none rounded-full bg-chip/30"
            style={{
              background: `linear-gradient(to right, var(--color-copper) ${progress}%, color-mix(in srgb, var(--color-paper) 28%, transparent) ${progress}%)`,
            }}
            aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
          />
          <div className="mt-1.5 flex justify-between text-xs tabular-nums text-paper/70">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {failed ? (
        <p className="mt-4 text-sm text-paper" role="alert">
          The recording didn’t load. Refresh the page and try the play button again.
        </p>
      ) : null}

      <button
        type="button"
        className="mt-4 text-sm font-semibold text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper"
        aria-expanded={openScript}
        onClick={() => setOpenScript((open) => !open)}
      >
        {openScript ? "Hide the script" : "Read along"}
      </button>

      {openScript ? (
        <div className="mt-4 max-h-80 space-y-4 overflow-y-auto pr-1 text-sm leading-relaxed text-paper/90">
          {TRANSCRIPT.map((part) => (
            <div key={part.heading}>
              <h3 className="text-base text-paper">{part.heading}</h3>
              <p className="mt-1">{part.body}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
