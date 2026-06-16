import { CalendarClock, ChevronLeft, ChevronRight, Info, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TimeTravelScene, eras } from "./TimeTravelScene";

const events = [
  { year: 800, title: "河谷村落形成", description: "农田、木屋与木桥构成最初聚落。" },
  { year: 1400, title: "城墙与石桥", description: "聚落扩张为城镇，防御与贸易成为主线。" },
  { year: 1900, title: "铁路与工厂进入", description: "工业建筑、烟囱和钢桥改变河谷天际线。" },
  { year: 2026, title: "现代滨水城市", description: "高密度城市、公共交通和滨水空间共存。" },
  { year: 2080, title: "未来生态城", description: "垂直森林、清洁能源和悬浮交通重塑河谷。" },
];

const objectCopy: Record<string, { title: string; body: string }> = {
  bridge: { title: "跨河通道", body: "木桥、石桥、钢桥、现代桥梁和未来生态桥始终位于同一轴线上，是最直观的时代参照物。" },
  settlement: { title: "聚落中心", body: "早期村舍逐渐演变为城墙内的密集城镇，反映人口、贸易和防御需求的变化。" },
  industry: { title: "工业区", body: "工厂与烟囱在工业时代快速出现，随后被现代商业区和公共空间逐步替代。" },
  city: { title: "现代城市", body: "现代阶段强调高密度建筑、道路网络和滨水公共空间。" },
  future: { title: "未来生态塔", body: "未来设定采用垂直绿化、低碳能源和空中交通，是教学级推演，不代表预测。" },
};

function eraName(year: number) {
  if (year < 1100) return "古代村落";
  if (year < 1750) return "中世纪城镇";
  if (year < 1950) return "工业时代";
  if (year < 2050) return "现代城市";
  return "未来生态城";
}

export function TimeTravelPage() {
  const [year, setYear] = useState(800);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>("bridge");

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setYear((current) => {
        const next = current + speed * 4;
        if (next >= 2080) {
          setPlaying(false);
          return 2080;
        }
        return next;
      });
    }, 80);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const nearestEvent = useMemo(
    () => events.reduce((best, event) => Math.abs(event.year - year) < Math.abs(best.year - year) ? event : best, events[0]),
    [year],
  );
  const selectedCopy = selectedObjectId ? objectCopy[selectedObjectId] : null;

  const jumpEra = (direction: -1 | 1) => {
    const currentIndex = eras.reduce((bestIndex, era, index) => Math.abs(era - year) < Math.abs(eras[bestIndex] - year) ? index : bestIndex, 0);
    const nextIndex = Math.max(0, Math.min(eras.length - 1, currentIndex + direction));
    setYear(eras[nextIndex]);
  };

  return (
    <div className="time-travel-page">
      <section className="time-travel-stage">
        <TimeTravelScene year={year} playing={playing} selectedObjectId={selectedObjectId} onSelectObject={setSelectedObjectId} />

        <div className="time-travel-title">
          <span>RIVER VALLEY · 1280 YEARS</span>
          <h1>河谷城时间旅行浏览器</h1>
          <p>同一地点，从古代村落到未来生态城。</p>
        </div>

        <div className="time-travel-year-card">
          <small>当前年份</small>
          <strong>{Math.round(year)}</strong>
          <span>{eraName(year)}</span>
        </div>

        <aside className="time-travel-event-card">
          <div><CalendarClock size={17} /><span>关键事件</span></div>
          <h2>{nearestEvent.title}</h2>
          <p>{nearestEvent.description}</p>
        </aside>

        {selectedCopy && (
          <aside className="time-travel-object-card">
            <div><Info size={17} /><span>跨时代对象</span></div>
            <h2>{selectedCopy.title}</h2>
            <p>{selectedCopy.body}</p>
            <button type="button" onClick={() => setSelectedObjectId(null)}>关闭</button>
          </aside>
        )}
      </section>

      <section className="time-travel-console">
        <div className="time-travel-controls">
          <button type="button" onClick={() => jumpEra(-1)} aria-label="上一个时代"><ChevronLeft size={18} /></button>
          <button type="button" className="is-primary" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
          <button type="button" onClick={() => jumpEra(1)} aria-label="下一个时代"><ChevronRight size={18} /></button>
          <button type="button" onClick={() => { setYear(800); setPlaying(false); }} aria-label="重置时间"><RotateCcw size={17} /></button>
          <label>速度
            <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
              <option value={4}>4×</option>
            </select>
          </label>
        </div>

        <div className="time-travel-timeline">
          <input type="range" min="800" max="2080" step="1" value={year} onChange={(event) => { setYear(Number(event.target.value)); setPlaying(false); }} />
          <div className="time-travel-era-points">
            {events.map((event) => {
              const left = (event.year - 800) / (2080 - 800) * 100;
              return (
                <button key={event.year} type="button" style={{ left: `${left}%` }} className={Math.abs(year - event.year) < 35 ? "is-active" : ""} onClick={() => { setYear(event.year); setPlaying(false); }}>
                  <i />
                  <strong>{event.year}</strong>
                  <span>{event.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
