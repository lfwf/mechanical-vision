import {
  Camera,
  Check,
  CircleGauge,
  CloudSun,
  Droplets,
  Gauge,
  Map,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  Sun,
  Wind,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SenjerCityScene } from "./SenjerCityScene";

type DistrictId = "core" | "sky" | "water" | "transit" | "echo" | "research";
type CityMode = "quest" | "tour" | "free";

const districts: Array<{
  id: DistrictId;
  name: string;
  letter: string;
  icon: typeof Zap;
  status: "complete" | "active" | "locked";
  eyebrow: string;
  description: string;
}> = [
  { id: "core", name: "中央能源站", letter: "E", icon: Zap, status: "complete", eyebrow: "ENERGY CORE · E", description: "连接各区域的城市能量与数据中心。" },
  { id: "sky", name: "天空花园", letter: "S", icon: Wind, status: "active", eyebrow: "SKY GARDEN · S", description: "风能通过减速机构驱动升降平台。" },
  { id: "water", name: "水路花园", letter: "J", icon: Droplets, status: "complete", eyebrow: "WATER GARDEN · J", description: "柔和水流连接喷泉、花园与城市水网。" },
  { id: "transit", name: "轨道交通", letter: "N", icon: Map, status: "locked", eyebrow: "TRANSIT · N", description: "连接城市节点的轻量交通网络。" },
  { id: "echo", name: "回声剧场", letter: "E", icon: Sparkles, status: "locked", eyebrow: "ECHO THEATER · E", description: "由节奏、光环与音律构成的城市舞台。" },
  { id: "research", name: "天文研究院", letter: "R", icon: Moon, status: "locked", eyebrow: "RESEARCH · R", description: "观测城市时间、星轨与昼夜变化。" },
];

export function SenjerCityPage() {
  const [activeDistrict, setActiveDistrict] = useState<DistrictId>("sky");
  const [mode, setMode] = useState<CityMode>("quest");
  const [playing, setPlaying] = useState(true);
  const [night, setNight] = useState(false);
  const [bladeAngle, setBladeAngle] = useState(36);
  const [inputTeeth, setInputTeeth] = useState(18);
  const [outputTeeth, setOutputTeeth] = useState(54);

  const outputRpm = useMemo(
    () => Math.round((62 * inputTeeth) / outputTeeth),
    [inputTeeth, outputTeeth],
  );
  const taskComplete = outputRpm >= 18 && outputRpm <= 22;
  const activeDistrictInfo = districts.find((district) => district.id === activeDistrict) ?? districts[1];

  return (
    <div className={night ? "city-page is-night" : "city-page"}>
      <section className="city-topbar">
        <div>
          <span className="city-eyebrow">SENJER CITY RESTORATION</span>
          <h1>SENJER 动力之城</h1>
        </div>
        <div className="city-kpi-row">
          <div><Zap size={16} /><span>能源稳定度</span><strong>64%</strong></div>
          <div><CircleGauge size={16} /><span>恢复区域</span><strong>2 / 6</strong></div>
          <div><CloudSun size={16} /><span>城市时间</span><strong>{night ? "21:18" : "17:42"}</strong></div>
        </div>
        <div className="city-mode-switch">
          {(["quest", "tour", "free"] as CityMode[]).map((item) => (
            <button key={item} className={mode === item ? "is-active" : ""} onClick={() => setMode(item)}>
              {item === "quest" ? "任务模式" : item === "tour" ? "自动参观" : "自由探索"}
            </button>
          ))}
        </div>
      </section>

      <main className="city-workspace">
        <aside className="city-panel city-quest-panel">
          <div className="city-panel-heading">
            <span>当前任务</span>
            <strong>02 / 03</strong>
          </div>
          <div className="city-quest-title">
            <div className="city-icon-box"><Wind size={22} /></div>
            <div>
              <h2>恢复天空升降平台</h2>
              <p>让齿轮输出转速稳定在 18–22 RPM。</p>
            </div>
          </div>
          <div className="city-task-progress">
            {["启动风轮", "调整传动比", "确认输出转速", "升起观景台"].map((label, index) => {
              const done = index < 2 || (index === 2 && taskComplete);
              return (
                <div key={label} className={done ? "is-complete" : index === 2 ? "is-current" : ""}>
                  <span>{done ? <Check size={14} /> : index + 1}</span>
                  <p>{label}</p>
                </div>
              );
            })}
          </div>
          <div className="city-principle-card">
            <span>原理提示</span>
            <h3>齿轮减速</h3>
            <p>大齿轮作为输出时，输出转速降低。目标区间需要通过齿数比控制，而不是直接提高风轮速度。</p>
          </div>
          <button className="city-primary-button" disabled={!taskComplete}>
            {taskComplete ? "启动观景台" : "输出转速尚未达标"}
          </button>
        </aside>

        <section className="city-scene-shell">
          <SenjerCityScene
            activeDistrict={activeDistrict}
            playing={playing}
            night={night}
            bladeAngle={bladeAngle}
            outputRpm={outputRpm}
          />
          <div className="city-scene-overlay city-scene-title">
            <span>{activeDistrictInfo.eyebrow}</span>
            <strong>{activeDistrictInfo.name}</strong>
            <p>{activeDistrictInfo.description}</p>
          </div>
          <div className="city-scene-overlay city-camera-hint">
            <Camera size={15} /> 拖动画布 · 滚轮缩放 · 点击底部区域定位
          </div>
        </section>

        <aside className="city-panel city-parameter-panel">
          <div className="city-panel-heading">
            <span>实时参数</span>
            <button aria-label="参数设置"><Settings2 size={16} /></button>
          </div>
          <div className="city-output-card">
            <span>当前输出转速</span>
            <strong className={taskComplete ? "is-good" : ""}>{outputRpm}<small> RPM</small></strong>
            <p>目标范围 18–22 RPM</p>
            <div><i style={{ width: `${Math.min(outputRpm / 35 * 100, 100)}%` }} /></div>
          </div>
          <label className="city-control-row">
            <span><Wind size={15} /> 叶片角度 <strong>{bladeAngle}°</strong></span>
            <input type="range" min="15" max="55" value={bladeAngle} onChange={(event) => setBladeAngle(Number(event.target.value))} />
          </label>
          <label className="city-control-row">
            <span><Gauge size={15} /> 输入齿数 <strong>{inputTeeth}</strong></span>
            <input type="range" min="16" max="32" value={inputTeeth} onChange={(event) => setInputTeeth(Number(event.target.value))} />
          </label>
          <label className="city-control-row">
            <span><Gauge size={15} /> 输出齿数 <strong>{outputTeeth}</strong></span>
            <input type="range" min="36" max="72" value={outputTeeth} onChange={(event) => setOutputTeeth(Number(event.target.value))} />
          </label>
          <div className="city-live-grid">
            <div><span>风速</span><strong>7.8 m/s</strong></div>
            <div><span>输入转速</span><strong>62 RPM</strong></div>
            <div><span>传动比</span><strong>1 : {(outputTeeth / inputTeeth).toFixed(1)}</strong></div>
            <div><span>平台状态</span><strong>{taskComplete ? "可启动" : "待校准"}</strong></div>
          </div>
          <div className="city-status-note">
            <i className={taskComplete ? "is-good" : ""} />
            {taskComplete ? "参数已进入稳定区间" : "继续调整齿数比，使输出转速进入目标区间"}
          </div>
        </aside>
      </main>

      <footer className="city-bottom-bar">
        <nav className="city-district-nav" aria-label="城市区域导航">
          {districts.map((district) => {
            const Icon = district.icon;
            return (
              <button
                key={district.id}
                disabled={district.status === "locked"}
                className={`${activeDistrict === district.id ? "is-active" : ""} is-${district.status}`}
                onClick={() => setActiveDistrict(district.id)}
              >
                <span><Icon size={16} /></span>
                <div><strong>{district.name}</strong><small>{district.letter} · {district.status === "complete" ? "已恢复" : district.status === "active" ? "进行中" : "锁定"}</small></div>
              </button>
            );
          })}
        </nav>
        <div className="city-letter-progress" aria-label="SENJER 区域恢复进度">
          {["S", "E", "N", "J", "E", "R"].map((letter, index) => (
            <span key={`${letter}-${index}`} className={index === 0 || index === 1 || index === 3 ? "is-on" : ""}>{letter}</span>
          ))}
        </div>
        <div className="city-play-controls">
          <button onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
          <button aria-label="重置当前区域" onClick={() => setActiveDistrict((current) => current === "core" ? "sky" : "core")}><RotateCcw size={17} /></button>
          <button onClick={() => setNight((value) => !value)} aria-label="切换昼夜">{night ? <Sun size={17} /> : <Moon size={17} />}</button>
        </div>
      </footer>
    </div>
  );
}
