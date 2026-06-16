import { ArrowLeft, ChevronRight, Maximize2, Pause, Play, RotateCcw, Sparkles, Volume2, VolumeX, Wind } from "lucide-react";
import { useMemo, useState } from "react";
import { WindGardenScene } from "./WindGardenScene";

type JourneyView = "portal" | "wind";

const chapters = [
  { letter: "S", name: "风之庭", subtitle: "让风穿过三座风铃", state: "available" },
  { letter: "E", name: "光之海", subtitle: "引导散落的光", state: "coming" },
  { letter: "N", name: "夜行列车", subtitle: "穿过记忆的站台", state: "coming" },
  { letter: "J", name: "雨之花园", subtitle: "为沉睡的花园引水", state: "coming" },
  { letter: "E", name: "回声剧场", subtitle: "组合属于你的声音", state: "coming" },
  { letter: "R", name: "星辰档案馆", subtitle: "把旅程写入星图", state: "coming" },
] as const;

export function DreamJourneyPage() {
  const [view, setView] = useState<JourneyView>("portal");
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [windStrength, setWindStrength] = useState(42);
  const [windDirection, setWindDirection] = useState(-0.18);
  const [awakenedBells, setAwakenedBells] = useState(0);

  const progress = awakenedBells / 3;
  const completed = awakenedBells >= 3;

  const portalColors = useMemo(
    () => ["#DDF3FB", "#F8E5EC", "#DCEFE6", "#E7E0F3", "#F4D8C9", "#CFE8F5"],
    [],
  );

  const handleBellAwakened = (index: number) => {
    if (index !== awakenedBells) return;
    setAwakenedBells((current) => Math.min(3, current + 1));
  };

  const resetWindChapter = () => {
    setAwakenedBells(0);
    setWindStrength(42);
    setWindDirection(-0.18);
    setPlaying(true);
  };

  if (view === "portal") {
    return (
      <div className="dream-journey dream-portal-page">
        <div className="dream-ambient dream-ambient-a" />
        <div className="dream-ambient dream-ambient-b" />
        <div className="dream-portal-shell">
          <header className="dream-portal-header">
            <div>
              <span>SENJER DREAM JOURNEY</span>
              <h1>六幕梦境</h1>
            </div>
            <button type="button" className="dream-icon-button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "开启声音" : "关闭声音"}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </header>

          <section className="dream-portal-stage">
            <div className="dream-portal-copy">
              <span className="dream-kicker">一场由风、光、雨、声音与星辰组成的旅程</span>
              <h2>走进一扇门，<br />让六个世界依次醒来。</h2>
              <p>这里没有模型展台，也没有参数面板。每一幕都是一张可以互动的动画插画。</p>
              <button type="button" className="dream-primary-action" onClick={() => setView("wind")}>
                开始第一幕
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="dream-portal-visual" aria-hidden="true">
              <div className="dream-arch dream-arch-back" />
              <div className="dream-arch dream-arch-front">
                <div className="dream-portal-sky" />
                <div className="dream-portal-hill dream-portal-hill-a" />
                <div className="dream-portal-hill dream-portal-hill-b" />
                <div className="dream-portal-wind-line dream-portal-wind-line-a" />
                <div className="dream-portal-wind-line dream-portal-wind-line-b" />
                <div className="dream-portal-sun" />
              </div>
              <div className="dream-portal-glow" />
              {portalColors.map((color, index) => (
                <span
                  key={color}
                  className="dream-floating-letter"
                  style={{
                    color,
                    left: `${14 + index * 13}%`,
                    top: `${24 + (index % 2) * 27}%`,
                    animationDelay: `${index * 0.45}s`,
                  }}
                >
                  {chapters[index].letter}
                </span>
              ))}
            </div>
          </section>

          <footer className="dream-chapter-preview">
            {chapters.map((chapter, index) => (
              <button
                key={`${chapter.letter}-${index}`}
                type="button"
                disabled={chapter.state === "coming"}
                className={chapter.state === "available" ? "is-available" : ""}
                onClick={() => chapter.state === "available" && setView("wind")}
              >
                <span>{chapter.letter}</span>
                <div>
                  <strong>{chapter.name}</strong>
                  <small>{chapter.state === "available" ? chapter.subtitle : "即将开放"}</small>
                </div>
              </button>
            ))}
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="dream-journey dream-chapter-page">
      <section className="dream-chapter-stage">
        <WindGardenScene
          playing={playing}
          windStrength={windStrength}
          windDirection={windDirection}
          awakenedBells={awakenedBells}
          onBellAwakened={handleBellAwakened}
        />

        <nav className="dream-letter-nav" aria-label="梦境章节导航">
          {chapters.map((chapter, index) => (
            <button
              key={`${chapter.letter}-${index}`}
              type="button"
              className={index === 0 ? "is-current" : ""}
              disabled={index !== 0}
            >
              {chapter.letter}
            </button>
          ))}
        </nav>

        <div className="dream-chapter-heading">
          <button type="button" className="dream-back-button" onClick={() => setView("portal")}>
            <ArrowLeft size={16} />
            返回入口
          </button>
          <span>S · WIND GARDEN</span>
          <h1>风之庭</h1>
          <p>让风沿着发光丝带，依次唤醒三座风铃。</p>
        </div>

        <div className="dream-wind-control">
          <div className="dream-wind-control-header">
            <span><Wind size={16} /> 风之丝带</span>
            <strong>{Math.round(progress * 100)}%</strong>
          </div>
          <label>
            <span>风力</span>
            <input type="range" min="15" max="80" value={windStrength} onChange={(event) => setWindStrength(Number(event.target.value))} />
          </label>
          <label>
            <span>风向</span>
            <input type="range" min="-1" max="1" step="0.02" value={windDirection} onChange={(event) => setWindDirection(Number(event.target.value))} />
          </label>
          <div className="dream-bell-progress">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                className={index < awakenedBells ? "is-awake" : index === awakenedBells ? "is-next" : ""}
                onClick={() => handleBellAwakened(index)}
              >
                <span>{index + 1}</span>
                {index < awakenedBells ? "已唤醒" : index === awakenedBells ? "点击风铃" : "等待"}
              </button>
            ))}
          </div>
          <p className={completed ? "dream-task-note is-complete" : "dream-task-note"}>
            {completed ? "三座风铃已经回应，天空花园正在醒来。" : `下一步：点击第 ${awakenedBells + 1} 座风铃。`}
          </p>
        </div>

        <div className="dream-chapter-controls">
          <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "暂停动画" : "播放动画"}>
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "开启声音" : "关闭声音"}>
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <button type="button" onClick={resetWindChapter} aria-label="重置章节">
            <RotateCcw size={17} />
          </button>
          <button type="button" aria-label="进入全屏">
            <Maximize2 size={17} />
          </button>
        </div>

        <div className="dream-instruction">
          <Sparkles size={15} />
          拖动画布观察 · 调整风向 · 依次点击三座风铃
        </div>

        {completed && (
          <div className="dream-complete-card">
            <span>CHAPTER AWAKENED</span>
            <h2>风已经穿过整座花园。</h2>
            <p>第一枚字母 S 已经被点亮。</p>
            <button type="button" onClick={() => setView("portal")}>返回六幕入口</button>
          </div>
        )}
      </section>
    </div>
  );
}
