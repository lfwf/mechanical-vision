import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, ShaderMaterial, Vector2 } from "three";

export type ShaderArtworkId = "aurora" | "liquid" | "eclipse" | "silk";

interface ShaderCanvasProps {
  artwork: ShaderArtworkId;
  speed: number;
  intensity: number;
  paused: boolean;
  pointerEnabled?: boolean;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const common = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uIntensity;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amp * noise(p);
      p = p * 2.03 + 17.1;
      amp *= 0.5;
    }
    return value;
  }
`;

const shaders: Record<ShaderArtworkId, string> = {
  aurora: `${common}
    void main() {
      vec2 uv = vUv;
      vec2 p = uv - 0.5;
      p.x *= uResolution.x / max(uResolution.y, 1.0);
      float wave = sin(p.x * 4.0 + uTime * 0.45) * 0.12;
      wave += sin(p.x * 8.0 - uTime * 0.3) * 0.045;
      float ribbon = exp(-22.0 * abs(p.y - wave));
      float haze = fbm(p * 2.5 + vec2(uTime * 0.04, 0.0));
      vec3 night = vec3(0.018, 0.03, 0.09);
      vec3 cyan = vec3(0.12, 0.95, 0.88);
      vec3 violet = vec3(0.55, 0.24, 1.0);
      vec3 color = night;
      color += mix(violet, cyan, uv.x + haze * 0.25) * ribbon * (0.75 + haze) * uIntensity;
      color += vec3(0.05, 0.18, 0.22) * haze * 0.55;
      float star = step(0.996, hash(floor(uv * uResolution / 3.0))) * (0.25 + 0.75 * sin(uTime + uv.x * 40.0));
      color += star;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  liquid: `${common}
    void main() {
      vec2 uv = vUv;
      vec2 p = uv - 0.5;
      p.x *= uResolution.x / max(uResolution.y, 1.0);
      p += (uPointer - 0.5) * 0.16;
      float n = fbm(p * 3.0 + vec2(uTime * 0.08, -uTime * 0.05));
      float n2 = fbm(p * 5.0 - n + vec2(-uTime * 0.06, uTime * 0.08));
      float band = smoothstep(0.25, 0.8, n + n2 * 0.5);
      vec3 cream = vec3(0.98, 0.9, 0.78);
      vec3 coral = vec3(1.0, 0.31, 0.42);
      vec3 plum = vec3(0.27, 0.04, 0.38);
      vec3 color = mix(plum, coral, band);
      color = mix(color, cream, pow(n2, 3.0) * 0.72 * uIntensity);
      color += 0.18 * sin(vec3(0.0, 2.0, 4.0) + n * 8.0 + uTime * 0.2);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  eclipse: `${common}
    void main() {
      vec2 uv = vUv;
      vec2 p = uv - 0.5;
      p.x *= uResolution.x / max(uResolution.y, 1.0);
      vec2 center = vec2(0.08 * sin(uTime * 0.13), 0.03 * cos(uTime * 0.17));
      float d = length(p - center);
      float ring = exp(-38.0 * abs(d - 0.23));
      float corona = exp(-7.0 * abs(d - 0.25)) * (0.5 + 0.5 * fbm(normalize(p + 0.0001) * 8.0 + uTime * 0.05));
      vec3 bg = mix(vec3(0.01, 0.015, 0.035), vec3(0.07, 0.025, 0.11), uv.y);
      vec3 gold = vec3(1.0, 0.55, 0.12);
      vec3 rose = vec3(1.0, 0.16, 0.3);
      vec3 color = bg + mix(rose, gold, uv.x) * (ring * 1.8 + corona * 0.55) * uIntensity;
      color *= 1.0 - smoothstep(0.225, 0.235, d);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  silk: `${common}
    void main() {
      vec2 uv = vUv;
      vec2 p = uv - 0.5;
      p.x *= uResolution.x / max(uResolution.y, 1.0);
      float folds = sin((p.x + p.y * 0.45) * 12.0 + uTime * 0.34);
      folds += sin((p.x * 0.35 - p.y) * 17.0 - uTime * 0.22) * 0.55;
      float light = 0.5 + 0.5 * sin(folds + fbm(p * 3.0) * 3.2);
      vec3 ivory = vec3(0.97, 0.95, 0.9);
      vec3 lavender = vec3(0.57, 0.49, 0.88);
      vec3 blue = vec3(0.18, 0.5, 0.86);
      vec3 color = mix(blue, lavender, uv.y + light * 0.22);
      color = mix(color, ivory, pow(light, 4.0) * 0.72 * uIntensity);
      color *= 0.78 + 0.22 * smoothstep(0.75, 0.1, length(p));
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

function ShaderPlane({ artwork, speed, intensity, paused }: Omit<ShaderCanvasProps, "pointerEnabled">) {
  const materialRef = useRef<ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const { size, pointer } = useThree();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new Vector2(size.width, size.height) },
    uPointer: { value: new Vector2(0.5, 0.5) },
    uIntensity: { value: intensity },
  }), []);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    if (!paused) elapsedRef.current += delta * speed;
    materialRef.current.uniforms.uTime.value = elapsedRef.current;
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    materialRef.current.uniforms.uPointer.value.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    materialRef.current.uniforms.uIntensity.value = intensity;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={shaders[artwork]} uniforms={uniforms} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

export function ShaderCanvas({ pointerEnabled = true, ...props }: ShaderCanvasProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.6]}
      style={{ pointerEvents: pointerEnabled ? "auto" : "none" }}
    >
      <color attach="background" args={[new Color("#050712")]} />
      <ShaderPlane {...props} />
    </Canvas>
  );
}
