/**
 * 空调模型中可复用的小型零件。
 *
 * 这些组件被室内机和室外机共同调用，保持独立可以避免在总装文件中重复编写几何体。
 */

/** 电控盒：外部钣金盒、绿色 PCB 和简化电子元件。 */
export function ControlBox({ width = 1.2, height = 0.9, depth = 0.64 }: { width?: number; height?: number; depth?: number }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#d7dedb" metalness={0.26} roughness={0.33} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.025]}>
        <boxGeometry args={[width * 0.82, height * 0.72, 0.045]} />
        <meshStandardMaterial color="#4e9a69" metalness={0.16} roughness={0.44} />
      </mesh>
      {[-0.28, 0, 0.28].map((x, index) => (
        <mesh key={x} position={[x * width, index % 2 === 0 ? 0.12 : -0.12, depth / 2 + 0.055]}>
          <boxGeometry args={[0.12, 0.12, 0.055]} />
          <meshStandardMaterial color="#25383c" metalness={0.3} roughness={0.32} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 四通换向阀。
 * 阀体上连接四根制冷剂管路，顶部线圈用于驱动阀芯换向，制热时改变制冷剂流向。
 */
export function FourWayValve() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.76, 28]} />
        <meshStandardMaterial color="#b57939" metalness={0.72} roughness={0.21} />
      </mesh>
      {[-0.25, 0.25].map((x) =>
        [-0.27, 0.27].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.38, z]}>
            <cylinderGeometry args={[0.045, 0.045, 0.74, 12]} />
            <meshStandardMaterial color="#b87938" metalness={0.75} roughness={0.21} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.34, 24]} />
        <meshStandardMaterial color="#40575c" metalness={0.52} roughness={0.29} />
      </mesh>
    </group>
  );
}

/** 室内机墙面安装板，室内机后壳通过卡扣挂在该金属板上。 */
export function WallPlate() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[5.55, 1.42, 0.07]} />
        <meshStandardMaterial color="#9fa9a6" metalness={0.6} roughness={0.28} />
      </mesh>
      {[-2.1, -1.05, 0, 1.05, 2.1].map((x) => (
        <mesh key={x} position={[x, 0.28, 0.045]}>
          <boxGeometry args={[0.08, 0.68, 0.035]} />
          <meshStandardMaterial color="#697975" metalness={0.55} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, -0.48, 0.045]}>
        <boxGeometry args={[4.85, 0.08, 0.035]} />
        <meshStandardMaterial color="#697975" metalness={0.55} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** 室外机气管阀和液管阀，两个阀体直径不同。 */
export function ServiceValves() {
  return (
    <group>
      {[0, 0.52].map((x, index) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[index === 0 ? 0.16 : 0.13, index === 0 ? 0.16 : 0.13, 0.5, 24]} />
            <meshStandardMaterial color="#b8843f" metalness={0.75} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.22, 18]} />
            <meshStandardMaterial color="#7c6848" metalness={0.6} roughness={0.28} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.26, -0.32, 0]}>
        <boxGeometry args={[0.95, 0.12, 0.38]} />
        <meshStandardMaterial color="#697875" metalness={0.45} roughness={0.32} />
      </mesh>
    </group>
  );
}

/** 根据坐标数组批量生成螺钉，用于表达外壳和支架连接点。 */
export function Fasteners({ points }: { points: Array<[number, number, number]> }) {
  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
          <meshStandardMaterial color="#66726f" metalness={0.82} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/** 导风叶片步进电机，方形电机本体通过短轴驱动连杆。 */
export function StepperMotor() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.34, 0.34, 0.22]} />
        <meshStandardMaterial color="#485c60" metalness={0.48} roughness={0.29} />
      </mesh>
      <mesh position={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 16]} />
        <meshStandardMaterial color="#9da7a3" metalness={0.8} roughness={0.18} />
      </mesh>
    </group>
  );
}

/**
 * 气液分离器/储液器的简化外形。
 * 其作用是避免大量液态制冷剂直接回到压缩机造成液击。
 */
export function Accumulator() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.34, 0.38, 1.16, 32]} />
        <meshStandardMaterial color="#263b3f" metalness={0.52} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 0.18, 24]} />
        <meshStandardMaterial color="#31494e" metalness={0.52} roughness={0.28} />
      </mesh>
    </group>
  );
}
