import { Braces, Expand, Pause, Play, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ShaderCanvas, type ShaderArtworkId } from "./ShaderCanvas";

const artworks: Array<{
  id: ShaderArtworkId;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  palette: string[];
  tags: string[];
}> = [
  {
    id: "aurora",
    index: "01",
    title: "极光呼吸",
    subtitle: "Aurora Breathing",
    description: "用多层噪声与发光曲线生成一片缓慢呼吸的夜空。",
    palette: ["#071027", "#36E8D6", "#8C4DFF"],
    tags: ["FBM", "Noise", "Glow"],
  },
  {
    id: "liquid",
    index: "02",
    title: "液态黄昏",
    subtitle: "Liquid Dusk",
    description: "珊瑚红、奶油白与深紫在流体噪声中相互吞没。",
    palette: ["#3B0B4E", "#FF5268", "#FFE6C9"],
    tags: ["Flow", "Color Field", "Pointer"],
  },
  {
    id: "eclipse",
    index: "03",
    title: "日蚀余辉",
    subtitle: "Eclipse Afterglow",
    description: "把太阳边缘压缩成一圈不断波动的热量与余晖。",
    palette: ["#050817", "#FF3A4D", "#FFB22E"],
    tags: ["SDF", "Corona", "Radial"],
  },
  {
    id: "silk",
    index: "04",
    title: "数字丝绸",
    subtitle: "Digital Silk",
    description: "用干涉波模拟布料折痕、反光与柔软的方向性。",
    palette: ["#2F78CE", "#9182DE", "#F7F2E7"],
    tags: ["Interference", "Fabric", "Light"],
  },
];

export function ShaderGalleryPage() {
  const [activeId, setActiveId] = useState<ShaderArtworkId>("aurora");
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(1);
  const [paused, setPaused] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const active = useMemo(() => artworks.find((item) => item.id === activeId) ?? artworks[0], [activeId]);

  const reset = () => {
    setSpeed(1);
    setIntensity(1);
    setPaused(false);
  };

  return (
    <div className="shader-gallery-page">
      <section className="shader-gallery-stage">
        <ShaderCanvas artwork={active.id} speed={speed} intensity={intensity} paused={paused} />
        <div className="shader-gallery-vignette" />
        <div className="shader-gallery-grid" />

        <header className="shader-gallery-heading">
          <span>PERSONAL SHADER ARCHIVE · SENJER</span>
          <h1>个人 Shader 展厅</h1>
          <p>一组由 GLSL、噪声、光与时间构成的实时数字作品。</p>
        </header>

        <div className="shader-artwork-copy">
          <span>{active.index} / {String(artworks.length).padStart(2, "0")}</span>
          <h2>{active.title}</h2>
          <strong>{active.subtitle}</strong>
          <p>{active.description}</p>
          <div className="shader-tags">
            {active.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>

        <div className="shader-palette" aria-label="当前作品配色">
          {active.palette.map((color) => <i key={color} style={{ background: color }} title={color} />)}
        </div>

        <div className="shader-stage-actions">
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "播放" : "暂停"}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>
          <button type="button" onClick={reset} aria-label="重置参数"><RotateCcw size={17} /></button>
          <button type="button" onClick={() => setShowCode((value) => !value)} aria-label="查看代码"><Braces size={17} /></button>
          <button type="button" aria-label="全屏查看"><Expand size={17} /></button>
        </div>

        <aside className="shader-control-panel">
          <div className="shader-control-title"><SlidersHorizontal size={16} /><span>实时参数</span></div>
          <label>
            <span>时间速度 <strong>{speed.toFixed(1)}×</strong></span>
            <input type="range" min="0.1" max="2.4" step="0.1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
          </label>
          <label>
            <span>光效强度 <strong>{intensity.toFixed(2)}</strong></span>
            <input type="range" min="0.35" max="1.8" step="0.05" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
          </label>
          <div className="shader-live-status"><i /> WebGL 实时渲染</div>
        </aside>

        {showCode && (
          <aside className="shader-code-card">
            <div><Braces size={15} /><span>核心片段</span><button type="button" onClick={() => setShowCode(false)}>关闭</button></div>
            <pre><code>{`float n = fbm(p * 3.0 + uTime * 0.08);
float glow = exp(-22.0 * abs(distanceField));
vec3 color = mix(colorA, colorB, n);
color += glow * uIntensity;`}</code></pre>
          </aside>
        )}

        <div className="shader-scroll-hint"><Sparkles size={14} />移动鼠标影响画面 · 选择下方作品切换</div>
      </section>

      <footer className="shader-filmstrip">
        {artworks.map((artwork) => (
          <button
            key={artwork.id}
            type="button"
            className={artwork.id === activeId ? "is-active" : ""}
            onClick={() => setActiveId(artwork.id)}
          >
            <div className="shader-thumb"><ShaderCanvas artwork={artwork.id} speed={0.55} intensity={1} paused={false} pointerEnabled={false} /></div>
            <span>{artwork.index}</span>
            <div><strong>{artwork.title}</strong><small>{artwork.subtitle}</small></div>
          </button>
        ))}
      </footer>
    </div>
  );
}
