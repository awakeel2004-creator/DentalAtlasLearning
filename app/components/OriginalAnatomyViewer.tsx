"use client";

import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type AnatomyPreset =
  | "dentition"
  | "tooth"
  | "head"
  | "skeleton"
  | "spine"
  | "body"
  | "tissue";

type Layer = "bone" | "teeth" | "muscle" | "organ" | "nerve" | "vessel" | "tissue";
type PartInfo = { name: string; definition: string; function: string; layer: Layer };

const COLORS: Record<Layer, string> = {
  bone: "#e9dfc8",
  teeth: "#fff9e9",
  muscle: "#b64f4f",
  organ: "#a76c76",
  nerve: "#efc84a",
  vessel: "#ca4652",
  tissue: "#e89c92",
};

const INFO: Record<string, Omit<PartInfo, "name" | "layer">> = {
  enamel: { definition: "Highly mineralized, acellular covering of the anatomic crown.", function: "Resists wear and protects dentin from mechanical and chemical challenge." },
  dentin: { definition: "Vital mineralized tissue forming most of the tooth.", function: "Supports enamel and transmits stimuli toward the dental pulp." },
  pulp: { definition: "Vascular, innervated connective tissue within the pulp chamber and canals.", function: "Forms dentin, nourishes the tooth, senses injury, and mounts defense." },
  gingiva: { definition: "Masticatory mucosa surrounding the cervical portions of teeth.", function: "Forms a protective seal around the dentition and covers alveolar processes." },
  mandible: { definition: "The mobile U-shaped bone of the lower facial skeleton.", function: "Supports mandibular teeth and provides attachment and leverage for mastication." },
  maxilla: { definition: "Paired facial bones forming the upper jaw and much of the midface.", function: "Support maxillary teeth and contribute to the orbit, nasal cavity, and hard palate." },
  skull: { definition: "The cranial and facial skeleton surrounding the brain and upper aerodigestive tract.", function: "Protects sensory and neural structures and supports the face and dentition." },
  vertebra: { definition: "A segmental bone of the vertebral column.", function: "Protects the spinal cord, transfers load, and guides spinal motion." },
  brain: { definition: "The central nervous system organ within the cranial cavity.", function: "Integrates sensory information and coordinates motor, autonomic, cognitive, and behavioral activity." },
  heart: { definition: "A four-chambered muscular pump in the middle mediastinum.", function: "Generates pressure that circulates blood through pulmonary and systemic circuits." },
  lung: { definition: "Paired respiratory organs occupying the pleural cavities.", function: "Exchange oxygen and carbon dioxide between air and blood." },
  liver: { definition: "Large glandular organ in the right upper abdomen.", function: "Processes nutrients and drugs, produces bile and plasma proteins, and supports metabolism." },
  stomach: { definition: "Expandable muscular segment of the upper gastrointestinal tract.", function: "Stores, mixes, acidifies, and begins digestion of ingested material." },
  kidney: { definition: "Paired retroperitoneal organs.", function: "Filter blood and regulate fluid, electrolytes, acid-base balance, and blood pressure." },
  muscle: { definition: "Contractile skeletal muscle tissue attached to bones or fascia.", function: "Generates movement, stabilizes joints, and maintains posture." },
  nerve: { definition: "A bundle of peripheral axons and supporting connective tissue.", function: "Carries sensory, motor, and autonomic signals between the CNS and body." },
  artery: { definition: "A vessel carrying blood away from the heart.", function: "Distributes oxygenated blood to systemic tissues and supports perfusion." },
  vein: { definition: "A vessel carrying blood toward the heart.", function: "Returns blood to the heart and acts as a capacitance reservoir." },
};

function partInfo(name: string, layer: Layer, key?: string): PartInfo {
  const base = INFO[key ?? name.toLowerCase()] ?? {
    definition: `A reconstructed component of the ${layer} layer.`,
    function: "Contributes to the regional structure, spatial relationship, or physiological system shown.",
  };
  return { name, layer, ...base };
}

type PickableProps = {
  info: PartInfo;
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  children: React.ReactNode;
};

function Pickable({ info, selected, onSelect, children }: PickableProps) {
  const active = selected === info.name;
  return (
    <group
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect(info);
      }}
      scale={active ? 1.055 : 1}
    >
      {children}
      {active && (
        <Html center position={[0, 0.45, 0]} distanceFactor={9}>
          <span className="anatomyPin">{info.name}</span>
        </Html>
      )}
    </group>
  );
}

function Material({ layer, opacity = 1, color }: { layer: Layer; opacity?: number; color?: string }) {
  return (
    <meshStandardMaterial
      color={color ?? COLORS[layer]}
      roughness={layer === "teeth" ? 0.3 : 0.65}
      metalness={0}
      transparent={opacity < 1}
      opacity={opacity}
      side={THREE.DoubleSide}
    />
  );
}

function BoneBetween({
  a,
  b,
  radius,
  name,
  selected,
  onSelect,
  opacity,
  layer = "bone",
}: {
  a: [number, number, number];
  b: [number, number, number];
  radius: number;
  name: string;
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  layer?: Layer;
}) {
  const midpoint = new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(0.5);
  const direction = new THREE.Vector3(...b).sub(new THREE.Vector3(...a));
  const length = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return (
    <Pickable info={partInfo(name, layer, layer === "nerve" ? "nerve" : layer === "vessel" ? (name.toLowerCase().includes("vein") || name.toLowerCase().includes("vena") ? "vein" : "artery") : undefined)} selected={selected} onSelect={onSelect}>
      <mesh position={midpoint} quaternion={quaternion}>
        <capsuleGeometry args={[radius, Math.max(0.01, length - radius * 2), 8, 14]} />
        <Material layer={layer} opacity={opacity} color={layer === "vessel" && (name.toLowerCase().includes("vein") || name.toLowerCase().includes("vena")) ? "#477db4" : undefined} />
      </mesh>
    </Pickable>
  );
}

function Tooth({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  name,
  selected,
  onSelect,
  opacity,
  molar = false,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  name: string;
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  molar?: boolean;
}) {
  return (
    <Pickable info={partInfo(name, "teeth")} selected={selected} onSelect={onSelect}>
      <group position={position} rotation={rotation} scale={scale}>
        <mesh position={[0, 0.22, 0]} scale={molar ? [0.34, 0.38, 0.34] : [0.25, 0.38, 0.22]}>
          <sphereGeometry args={[1, 20, 16]} />
          <Material layer="teeth" opacity={opacity} />
        </mesh>
        <mesh position={[0, -0.35, 0]} scale={molar ? [0.18, 0.62, 0.18] : [0.13, 0.72, 0.13]}>
          <coneGeometry args={[1, 1, 16]} />
          <Material layer="teeth" opacity={opacity} />
        </mesh>
        {molar && (
          <>
            <mesh position={[-0.16, -0.35, 0.08]} scale={[0.11, 0.58, 0.11]}><coneGeometry args={[1, 1, 12]} /><Material layer="teeth" opacity={opacity} /></mesh>
            <mesh position={[0.16, -0.35, -0.08]} scale={[0.11, 0.58, 0.11]}><coneGeometry args={[1, 1, 12]} /><Material layer="teeth" opacity={opacity} /></mesh>
          </>
        )}
      </group>
    </Pickable>
  );
}

function DentalArch({
  selected,
  onSelect,
  opacity,
  explode,
  single = false,
  layers = new Set<Layer>(["bone", "teeth", "tissue"]),
}: {
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  explode: number;
  single?: boolean;
  layers?: Set<Layer>;
}) {
  if (single) {
    return (
      <group scale={1.7} position={[0, -0.3, 0]}>
        {layers.has("teeth") && <Tooth position={[0, 0, 0]} name="Maxillary first molar" selected={selected} onSelect={onSelect} opacity={opacity} molar />}
      </group>
    );
  }
  const rows = [-1, 1].flatMap((jaw) =>
    Array.from({ length: 16 }, (_, index) => {
      const side = index < 8 ? -1 : 1;
      const distance = Math.abs(index - 7.5);
      const angle = (index / 15) * Math.PI;
      const x = Math.cos(angle) * 2.85;
      const z = Math.sin(angle) * 1.7 - 0.65;
      const y = jaw * (0.68 + explode * 0.45);
      const toothNumber = jaw === 1 ? index + 1 : 32 - index;
      const molar = distance > 4.3;
      return (
        <Tooth
          key={`${jaw}-${index}`}
          position={[x, y, z]}
          rotation={[jaw === -1 ? Math.PI : 0, side * 0.06, -Math.cos(angle) * 0.1]}
          scale={molar ? 0.68 : distance > 2.5 ? 0.62 : 0.56}
          name={`Tooth ${toothNumber}`}
          selected={selected}
          onSelect={onSelect}
          opacity={opacity}
          molar={molar}
        />
      );
    }),
  );
  return (
    <group rotation={[-0.08, 0, 0]}>
      {layers.has("teeth") && rows}
      {layers.has("bone") && <Pickable info={partInfo("Maxilla", "bone", "maxilla")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, 1.13 + explode * 0.35, 0.35]} scale={[3.25, 0.32, 2.05]}>
          <torusGeometry args={[1, 0.25, 12, 48, Math.PI]} />
          <Material layer="bone" opacity={opacity} />
        </mesh>
      </Pickable>}
      {layers.has("bone") && <Pickable info={partInfo("Mandible", "bone", "mandible")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, -1.2 - explode * 0.35, 0.32]} rotation={[0, 0, Math.PI]} scale={[3.1, 0.36, 1.95]}>
          <torusGeometry args={[1, 0.26, 12, 48, Math.PI]} />
          <Material layer="bone" opacity={opacity} />
        </mesh>
      </Pickable>}
      {layers.has("tissue") && <Pickable info={partInfo("Gingiva", "tissue", "gingiva")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, 0, 0.25]} scale={[3.18, 1.32 + explode * 0.25, 1.92]}>
          <torusGeometry args={[1, 0.18, 12, 48, Math.PI]} />
          <Material layer="tissue" opacity={Math.min(opacity, 0.76)} color="#d97c7b" />
        </mesh>
      </Pickable>}
    </group>
  );
}

function ToothLayers({
  selected,
  onSelect,
  opacity,
  explode,
}: {
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  explode: number;
}) {
  return (
    <group position={[0, -0.15, 0]} scale={1.55}>
      <Pickable info={partInfo("Enamel", "teeth", "enamel")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, 0.55 + explode * 0.18, 0]} scale={[0.86, 0.86, 0.72]}>
          <sphereGeometry args={[1, 30, 22]} />
          <Material layer="teeth" opacity={Math.min(opacity, 0.62)} />
        </mesh>
      </Pickable>
      <Pickable info={partInfo("Dentin", "tissue", "dentin")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, 0.52, 0]} scale={[0.67, 0.72, 0.55]}>
          <sphereGeometry args={[1, 28, 20]} />
          <Material layer="tissue" opacity={opacity} color="#dfb55e" />
        </mesh>
      </Pickable>
      <Pickable info={partInfo("Dental pulp", "tissue", "pulp")} selected={selected} onSelect={onSelect}>
        <group position={[explode * 0.65, 0, 0]}>
          <mesh position={[0, 0.43, 0]} scale={[0.28, 0.45, 0.22]}><sphereGeometry args={[1, 22, 16]} /><Material layer="tissue" opacity={opacity} color="#a9383e" /></mesh>
          <mesh position={[0, -0.32, 0]} scale={[0.11, 0.75, 0.1]}><coneGeometry args={[1, 1.45, 16]} /><Material layer="vessel" opacity={opacity} color="#a9383e" /></mesh>
        </group>
      </Pickable>
      <Pickable info={partInfo("Root dentin and cementum", "tissue", "dentin")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, -0.58, 0]} scale={[0.36, 1.05, 0.3]}><coneGeometry args={[1, 1.8, 24]} /><Material layer="tissue" opacity={Math.min(opacity, 0.72)} color="#d4aa68" /></mesh>
      </Pickable>
      <Pickable info={partInfo("Periodontal ligament", "tissue")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, -0.58 - explode * 0.1, 0]} scale={[0.43, 1.1, 0.37]}><coneGeometry args={[1, 1.8, 24]} /><Material layer="nerve" opacity={Math.min(opacity, 0.35)} color="#eecb75" /></mesh>
      </Pickable>
      <Pickable info={partInfo("Alveolar bone", "bone")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, -0.65 - explode * 0.25, 0]} scale={[1.25, 0.75, 1]}><cylinderGeometry args={[1, 1.2, 1.4, 32]} /><Material layer="bone" opacity={Math.min(opacity, 0.4)} /></mesh>
      </Pickable>
    </group>
  );
}

const vertebralNames = [
  ...Array.from({ length: 7 }, (_, i) => `C${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `T${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `L${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `S${i + 1}`),
  ...Array.from({ length: 4 }, (_, i) => `Co${i + 1}`),
];

function Spine({
  selected,
  onSelect,
  opacity,
  explode,
  isolated = false,
}: {
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  explode: number;
  isolated?: boolean;
}) {
  const levels = isolated ? vertebralNames : vertebralNames.slice(0, 29);
  return (
    <group position={[0, isolated ? 0 : 1.15, 0]} scale={isolated ? 0.82 : 0.56}>
      {levels.map((name, index) => {
        const y = 4.6 - index * (isolated ? 0.29 + explode * 0.045 : 0.27);
        const regionScale = index < 7 ? 0.72 : index < 19 ? 0.9 : index < 24 ? 1.18 : 1.05;
        const curve = index < 7 ? Math.sin(index / 6 * Math.PI) * 0.16 : index < 19 ? -Math.sin((index - 7) / 12 * Math.PI) * 0.2 : 0.13;
        return (
          <Pickable key={name} info={partInfo(`${name} vertebra`, "bone", "vertebra")} selected={selected} onSelect={onSelect}>
            <group position={[0, y, curve]}>
              <mesh scale={[0.52 * regionScale, 0.16, 0.42 * regionScale]}><cylinderGeometry args={[1, 1, 1, 16]} /><Material layer="bone" opacity={opacity} /></mesh>
              <mesh position={[0, 0, -0.48 * regionScale]} rotation={[Math.PI / 2, 0, 0]} scale={[0.12, 0.42 * regionScale, 0.12]}><coneGeometry args={[1, 1, 8]} /><Material layer="bone" opacity={opacity} /></mesh>
              {index < 24 && <mesh position={[0, -0.17, 0]} scale={[0.54 * regionScale, 0.045, 0.44 * regionScale]}><cylinderGeometry args={[1, 1, 1, 20]} /><Material layer="tissue" opacity={Math.min(opacity, 0.8)} color="#6f9da0" /></mesh>}
            </group>
          </Pickable>
        );
      })}
    </group>
  );
}

const skullBones: Array<{ name: string; position: [number, number, number]; scale: [number, number, number]; color?: string }> = [
  { name: "Frontal bone", position: [0, 1.72, 0.48], scale: [0.92, 0.55, 0.62] },
  { name: "Left parietal bone", position: [-0.52, 2.08, -0.05], scale: [0.62, 0.75, 0.74] },
  { name: "Right parietal bone", position: [0.52, 2.08, -0.05], scale: [0.62, 0.75, 0.74] },
  { name: "Occipital bone", position: [0, 1.72, -0.68], scale: [0.82, 0.7, 0.35] },
  { name: "Left temporal bone", position: [-0.82, 1.42, -0.12], scale: [0.38, 0.5, 0.52], color: "#ded1b4" },
  { name: "Right temporal bone", position: [0.82, 1.42, -0.12], scale: [0.38, 0.5, 0.52], color: "#ded1b4" },
  { name: "Sphenoid bone", position: [0, 1.32, 0.02], scale: [0.88, 0.22, 0.45], color: "#d3bb8d" },
  { name: "Ethmoid bone", position: [0, 1.36, 0.55], scale: [0.18, 0.32, 0.2], color: "#d8c49c" },
  { name: "Left zygomatic bone", position: [-0.67, 0.96, 0.56], scale: [0.3, 0.3, 0.26] },
  { name: "Right zygomatic bone", position: [0.67, 0.96, 0.56], scale: [0.3, 0.3, 0.26] },
  { name: "Left maxilla", position: [-0.28, 0.72, 0.59], scale: [0.42, 0.31, 0.28] },
  { name: "Right maxilla", position: [0.28, 0.72, 0.59], scale: [0.42, 0.31, 0.28] },
  { name: "Left nasal bone", position: [-0.1, 1.12, 0.8], scale: [0.11, 0.25, 0.08] },
  { name: "Right nasal bone", position: [0.1, 1.12, 0.8], scale: [0.11, 0.25, 0.08] },
  { name: "Left lacrimal bone", position: [-0.24, 1.2, 0.68], scale: [0.07, 0.15, 0.08], color: "#d4c39f" },
  { name: "Right lacrimal bone", position: [0.24, 1.2, 0.68], scale: [0.07, 0.15, 0.08], color: "#d4c39f" },
  { name: "Left palatine bone", position: [-0.18, 0.56, 0.24], scale: [0.2, 0.08, 0.34], color: "#d6c39c" },
  { name: "Right palatine bone", position: [0.18, 0.56, 0.24], scale: [0.2, 0.08, 0.34], color: "#d6c39c" },
  { name: "Left inferior nasal concha", position: [-0.16, 0.92, 0.7], scale: [0.08, 0.2, 0.08], color: "#d5bc90" },
  { name: "Right inferior nasal concha", position: [0.16, 0.92, 0.7], scale: [0.08, 0.2, 0.08], color: "#d5bc90" },
  { name: "Vomer", position: [0, 0.85, 0.67], scale: [0.05, 0.3, 0.14], color: "#cfb98f" },
];

function SkullAssembly({
  selected,
  onSelect,
  opacity,
  explode,
}: {
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  explode: number;
}) {
  return (
    <group position={[0, -0.85, 0]} scale={1.12}>
      {skullBones.map((bone, index) => {
        const direction = new THREE.Vector3(...bone.position).sub(new THREE.Vector3(0, 1.2, 0)).normalize().multiplyScalar(explode * 0.22);
        return (
          <Pickable key={bone.name} info={partInfo(bone.name, "bone", bone.name.includes("maxilla") ? "maxilla" : "skull")} selected={selected} onSelect={onSelect}>
            <mesh position={[bone.position[0] + direction.x, bone.position[1] + direction.y, bone.position[2] + direction.z]} scale={bone.scale}>
              {index < 8 ? <sphereGeometry args={[1, 22, 16]} /> : <boxGeometry args={[1, 1, 1]} />}
              <Material layer="bone" opacity={opacity} color={bone.color} />
            </mesh>
          </Pickable>
        );
      })}
      <Pickable info={partInfo("Mandible", "bone", "mandible")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, 0.22 - explode * 0.22, 0.47]} rotation={[0, 0, Math.PI]} scale={[0.78, 0.43, 0.68]}><torusGeometry args={[1, 0.2, 10, 32, Math.PI]} /><Material layer="bone" opacity={opacity} /></mesh>
      </Pickable>
      <Pickable info={partInfo("Hyoid bone", "bone")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, -0.55 - explode * 0.28, 0.18]} rotation={[Math.PI / 2, 0, 0]} scale={[0.45, 0.2, 0.2]}><torusGeometry args={[0.65, 0.11, 8, 24, Math.PI]} /><Material layer="bone" opacity={opacity} /></mesh>
      </Pickable>
      {["Left malleus", "Left incus", "Left stapes", "Right malleus", "Right incus", "Right stapes"].map((name, index) => {
        const side = index < 3 ? -1 : 1;
        const offset = index % 3;
        return (
          <Pickable key={name} info={partInfo(name, "bone")} selected={selected} onSelect={onSelect}>
            <mesh position={[side * (0.55 + explode * 0.25), 1.36 - offset * 0.06, -0.02]} scale={[0.045, 0.065, 0.04]}><sphereGeometry args={[1, 10, 8]} /><Material layer="bone" opacity={opacity} color="#ceb988" /></mesh>
          </Pickable>
        );
      })}
      <group position={[0, 0.55, 0.65]} scale={0.24}>
        <DentalArch selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} layers={new Set<Layer>(["teeth"])} />
      </group>
    </group>
  );
}

const handBoneNames = [
  "Scaphoid", "Lunate", "Triquetrum", "Pisiform", "Trapezium", "Trapezoid", "Capitate", "Hamate",
  ...Array.from({ length: 5 }, (_, i) => `metacarpal ${i + 1}`),
  ...[2, 3, 3, 3, 3].flatMap((count, digit) => Array.from({ length: count }, (_, i) => `${["proximal", "middle", "distal"][count === 2 && i === 1 ? 2 : i]} phalanx of digit ${digit + 1}`)),
];
const footBoneNames = [
  "Talus", "Calcaneus", "Navicular", "Cuboid", "Medial cuneiform", "Intermediate cuneiform", "Lateral cuneiform",
  ...Array.from({ length: 5 }, (_, i) => `metatarsal ${i + 1}`),
  ...[2, 3, 3, 3, 3].flatMap((count, digit) => Array.from({ length: count }, (_, i) => `${["proximal", "middle", "distal"][count === 2 && i === 1 ? 2 : i]} phalanx of toe ${digit + 1}`)),
];

function SmallBoneCluster({
  side,
  kind,
  selected,
  onSelect,
  opacity,
  explode,
}: {
  side: -1 | 1;
  kind: "hand" | "foot";
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  explode: number;
}) {
  const names = kind === "hand" ? handBoneNames : footBoneNames;
  const originX = side * (kind === "hand" ? 2.02 + explode * 0.25 : 0.78 + explode * 0.18);
  const originY = kind === "hand" ? 0.16 : -4.42;
  return (
    <group>
      {names.map((name, index) => {
        const isRoot = index < (kind === "hand" ? 8 : 7);
        const digitIndex = isRoot ? index % 4 : (index - (kind === "hand" ? 8 : 7)) % 5;
        const row = isRoot ? Math.floor(index / 4) : Math.floor((index - (kind === "hand" ? 8 : 7)) / 5);
        const x = originX + side * ((digitIndex - 2) * 0.075 + (isRoot ? 0 : row * 0.045));
        const y = originY - (isRoot ? row * 0.08 : 0.12 + row * 0.16);
        const z = kind === "foot" ? 0.22 + row * 0.08 : row * 0.025;
        return (
          <Pickable key={`${side}-${kind}-${name}`} info={partInfo(`${side < 0 ? "Left" : "Right"} ${name}`, "bone")} selected={selected} onSelect={onSelect}>
            <mesh position={[x, y, z]} scale={isRoot ? [0.07, 0.07, 0.06] : [0.045, 0.12, 0.045]}>
              <boxGeometry />
              <Material layer="bone" opacity={opacity} />
            </mesh>
          </Pickable>
        );
      })}
    </group>
  );
}

function Skeleton({
  selected,
  onSelect,
  opacity,
  explode,
  headOnly = false,
}: {
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  explode: number;
  headOnly?: boolean;
}) {
  const gap = explode * 0.25;
  if (headOnly) {
    return (
      <group scale={1.35} position={[0, -0.25, 0]}>
        <SkullAssembly selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} />
      </group>
    );
  }
  const limbs: Array<{ a: [number, number, number]; b: [number, number, number]; r: number; name: string }> = [
    { a: [-0.7 - gap, 2.7, 0], b: [-1.8 - gap, 1.65, 0], r: 0.16, name: "Left humerus" },
    { a: [-1.8 - gap, 1.65, 0], b: [-2.05 - gap, 0.35, 0], r: 0.12, name: "Left radius" },
    { a: [-1.65 - gap, 1.62, 0.08], b: [-1.83 - gap, 0.35, 0.08], r: 0.1, name: "Left ulna" },
    { a: [0.7 + gap, 2.7, 0], b: [1.8 + gap, 1.65, 0], r: 0.16, name: "Right humerus" },
    { a: [1.8 + gap, 1.65, 0], b: [2.05 + gap, 0.35, 0], r: 0.12, name: "Right radius" },
    { a: [1.65 + gap, 1.62, 0.08], b: [1.83 + gap, 0.35, 0.08], r: 0.1, name: "Right ulna" },
    { a: [-0.58 - gap, -0.75, 0], b: [-0.66 - gap, -2.75, 0], r: 0.22, name: "Left femur" },
    { a: [-0.66 - gap, -2.75, 0], b: [-0.72 - gap, -4.28, 0], r: 0.15, name: "Left tibia" },
    { a: [-0.94 - gap, -2.76, 0.05], b: [-0.99 - gap, -4.2, 0.05], r: 0.09, name: "Left fibula" },
    { a: [0.58 + gap, -0.75, 0], b: [0.66 + gap, -2.75, 0], r: 0.22, name: "Right femur" },
    { a: [0.66 + gap, -2.75, 0], b: [0.72 + gap, -4.28, 0], r: 0.15, name: "Right tibia" },
    { a: [0.94 + gap, -2.76, 0.05], b: [0.99 + gap, -4.2, 0.05], r: 0.09, name: "Right fibula" },
  ];
  return (
    <group scale={0.72} position={[0, 0.05, 0]}>
      <Pickable info={partInfo("Skull", "bone", "skull")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, 4.45 + gap, 0]} scale={[0.76, 0.9, 0.72]}><sphereGeometry args={[1, 24, 18]} /><Material layer="bone" opacity={opacity} /></mesh>
      </Pickable>
      <Pickable info={partInfo("Mandible", "bone", "mandible")} selected={selected} onSelect={onSelect}>
        <mesh position={[0, 3.8 + gap * 0.5, 0.1]} rotation={[0, 0, Math.PI]} scale={[0.68, 0.35, 0.6]}><torusGeometry args={[1, 0.2, 10, 28, Math.PI]} /><Material layer="bone" opacity={opacity} /></mesh>
      </Pickable>
      <Spine selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} />
      {Array.from({ length: 12 }, (_, index) => {
        const y = 2.9 - index * 0.25;
        const width = 0.9 + Math.sin(index / 11 * Math.PI) * 0.65;
        return (
          <group key={`rib-${index}`}>
            <Pickable info={partInfo(`Left rib ${index + 1}`, "bone")} selected={selected} onSelect={onSelect}>
              <mesh position={[-width * 0.52, y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[width, 0.62, 0.78]}><torusGeometry args={[0.55, 0.055, 8, 28, Math.PI]} /><Material layer="bone" opacity={opacity} /></mesh>
            </Pickable>
            <Pickable info={partInfo(`Right rib ${index + 1}`, "bone")} selected={selected} onSelect={onSelect}>
              <mesh position={[width * 0.52, y, 0]} rotation={[Math.PI / 2, Math.PI, 0]} scale={[width, 0.62, 0.78]}><torusGeometry args={[0.55, 0.055, 8, 28, Math.PI]} /><Material layer="bone" opacity={opacity} /></mesh>
            </Pickable>
          </group>
        );
      })}
      <BoneBetween a={[0, 3.08, 0.35]} b={[0, 0.45, 0.35]} radius={0.09} name="Sternum" selected={selected} onSelect={onSelect} opacity={opacity} />
      <BoneBetween a={[-0.05, 3.15, 0.25]} b={[-1.05 - gap, 3.02, 0.1]} radius={0.08} name="Left clavicle" selected={selected} onSelect={onSelect} opacity={opacity} />
      <BoneBetween a={[0.05, 3.15, 0.25]} b={[1.05 + gap, 3.02, 0.1]} radius={0.08} name="Right clavicle" selected={selected} onSelect={onSelect} opacity={opacity} />
      {[-1, 1].map((side) => (
        <Pickable key={`scapula-${side}`} info={partInfo(`${side < 0 ? "Left" : "Right"} scapula`, "bone")} selected={selected} onSelect={onSelect}>
          <mesh position={[side * (0.92 + gap), 2.35, -0.42]} rotation={[0.1, 0, side * 0.18]} scale={[0.55, 0.82, 0.08]}><circleGeometry args={[1, 3]} /><Material layer="bone" opacity={opacity} /></mesh>
        </Pickable>
      ))}
      {limbs.map((limb) => <BoneBetween key={limb.name} a={limb.a} b={limb.b} radius={limb.r} name={limb.name} selected={selected} onSelect={onSelect} opacity={opacity} />)}
      {[-1, 1].map((side) => (
        <Pickable key={`hip-${side}`} info={partInfo(`${side < 0 ? "Left" : "Right"} hip bone`, "bone")} selected={selected} onSelect={onSelect}>
          <mesh position={[side * (0.48 + gap * 0.4), -0.55, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.78, 0.78, 0.8]}><torusGeometry args={[0.72, 0.18, 12, 30, Math.PI]} /><Material layer="bone" opacity={opacity} /></mesh>
        </Pickable>
      ))}
      {[-1, 1].map((side) => (
        <Pickable key={`patella-${side}`} info={partInfo(`${side < 0 ? "Left" : "Right"} patella`, "bone")} selected={selected} onSelect={onSelect}>
          <mesh position={[side * (0.66 + gap), -2.72, 0.24]} scale={[0.15, 0.22, 0.09]}><sphereGeometry args={[1, 14, 10]} /><Material layer="bone" opacity={opacity} /></mesh>
        </Pickable>
      ))}
      <SmallBoneCluster side={-1} kind="hand" selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} />
      <SmallBoneCluster side={1} kind="hand" selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} />
      <SmallBoneCluster side={-1} kind="foot" selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} />
      <SmallBoneCluster side={1} kind="foot" selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} />
    </group>
  );
}

function SoftBody({
  selected,
  onSelect,
  opacity,
  explode,
  layers,
  headOnly = false,
}: {
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  explode: number;
  layers: Set<Layer>;
  headOnly?: boolean;
}) {
  const shift = explode * 0.45;
  if (headOnly) {
    return (
      <group scale={1.15} position={[0, -0.2, 0]}>
        {layers.has("organ") && <Pickable info={partInfo("Brain", "organ", "brain")} selected={selected} onSelect={onSelect}><mesh position={[0, 1.4, 0]} scale={[0.88, 0.78, 0.8]}><sphereGeometry args={[1, 28, 20]} /><Material layer="organ" opacity={Math.min(opacity, 0.58)} color="#c98da1" /></mesh></Pickable>}
        {layers.has("muscle") && [-1, 1].map((side) => <Pickable key={side} info={partInfo(`${side < 0 ? "Left" : "Right"} masseter`, "muscle", "muscle")} selected={selected} onSelect={onSelect}><mesh position={[side * (0.73 + shift), 0.32, 0.4]} scale={[0.24, 0.62, 0.18]}><capsuleGeometry args={[0.35, 0.7, 8, 14]} /><Material layer="muscle" opacity={opacity} /></mesh></Pickable>)}
        {layers.has("organ") && [-1, 1].map((side) => <Pickable key={`gland-${side}`} info={partInfo(`${side < 0 ? "Left" : "Right"} parotid gland`, "organ")} selected={selected} onSelect={onSelect}><mesh position={[side * 0.9, 0.18, -0.05]} scale={[0.3, 0.5, 0.24]}><sphereGeometry args={[1, 16, 12]} /><Material layer="organ" opacity={opacity} color="#d4a764" /></mesh></Pickable>)}
        {layers.has("nerve") && [-1, 1].flatMap((side) => [0.75, 0.25, -0.35].map((dy, i) => <BoneBetween key={`${side}-${i}`} a={[side * 0.1, 1.1, 0.7]} b={[side * (0.65 + i * 0.17 + shift), dy, 0.72]} radius={0.025} name={`${side < 0 ? "Left" : "Right"} trigeminal division ${i + 1}`} selected={selected} onSelect={onSelect} opacity={opacity} layer="nerve" />))}
        {layers.has("vessel") && [-1, 1].map((side) => <BoneBetween key={`carotid-${side}`} a={[side * 0.24, -0.85, 0.1]} b={[side * (0.35 + shift), 0.75, 0.05]} radius={0.045} name={`${side < 0 ? "Left" : "Right"} carotid artery`} selected={selected} onSelect={onSelect} opacity={opacity} layer="vessel" />)}
      </group>
    );
  }
  return (
    <group scale={0.7} position={[0, 0.05, 0]}>
      {layers.has("organ") && (
        <>
          <Pickable info={partInfo("Heart", "organ", "heart")} selected={selected} onSelect={onSelect}><mesh position={[-0.22 - shift, 1.55, 0.35]} rotation={[0, 0, -0.22]} scale={[0.55, 0.75, 0.48]}><sphereGeometry args={[1, 22, 18]} /><Material layer="organ" opacity={opacity} color="#9e3542" /></mesh></Pickable>
          {[-1, 1].map((side) => <Pickable key={`lung-${side}`} info={partInfo(`${side < 0 ? "Left" : "Right"} lung`, "organ", "lung")} selected={selected} onSelect={onSelect}><mesh position={[side * (0.68 + shift), 1.75, 0]} scale={[0.58, 1.18, 0.44]}><sphereGeometry args={[1, 22, 18]} /><Material layer="organ" opacity={Math.min(opacity, 0.62)} color="#c98991" /></mesh></Pickable>)}
          <Pickable info={partInfo("Liver", "organ", "liver")} selected={selected} onSelect={onSelect}><mesh position={[0.48 + shift, 0.12, 0.25]} scale={[1.05, 0.45, 0.58]}><sphereGeometry args={[1, 22, 16]} /><Material layer="organ" opacity={opacity} color="#7f403d" /></mesh></Pickable>
          <Pickable info={partInfo("Stomach", "organ", "stomach")} selected={selected} onSelect={onSelect}><mesh position={[-0.5 - shift, -0.02, 0.2]} rotation={[0, 0, -0.3]} scale={[0.55, 0.82, 0.45]}><sphereGeometry args={[1, 20, 16]} /><Material layer="organ" opacity={opacity} color="#d08c73" /></mesh></Pickable>
          <Pickable info={partInfo("Pancreas", "organ")} selected={selected} onSelect={onSelect}><mesh position={[-0.05, -0.42, 0.25 + shift]} rotation={[0, 0, Math.PI / 2]} scale={[0.18, 0.72, 0.18]}><capsuleGeometry args={[1, 1, 8, 14]} /><Material layer="organ" opacity={opacity} color="#d4a15e" /></mesh></Pickable>
          <Pickable info={partInfo("Spleen", "organ")} selected={selected} onSelect={onSelect}><mesh position={[-0.88 - shift, 0.08, -0.05]} scale={[0.27, 0.5, 0.2]}><sphereGeometry args={[1, 18, 14]} /><Material layer="organ" opacity={opacity} color="#844052" /></mesh></Pickable>
          <Pickable info={partInfo("Gallbladder", "organ")} selected={selected} onSelect={onSelect}><mesh position={[0.55 + shift, -0.28, 0.55]} scale={[0.12, 0.32, 0.12]}><sphereGeometry args={[1, 14, 10]} /><Material layer="organ" opacity={opacity} color="#678552" /></mesh></Pickable>
          {[-1, 1].map((side) => <Pickable key={`kidney-${side}`} info={partInfo(`${side < 0 ? "Left" : "Right"} kidney`, "organ", "kidney")} selected={selected} onSelect={onSelect}><mesh position={[side * (0.62 + shift), -0.75, -0.25]} scale={[0.3, 0.55, 0.23]}><sphereGeometry args={[1, 18, 14]} /><Material layer="organ" opacity={opacity} color="#924a4c" /></mesh></Pickable>)}
          <Pickable info={partInfo("Small and large intestine", "organ")} selected={selected} onSelect={onSelect}><mesh position={[0, -1.45, 0.14]} scale={[0.88, 0.78, 0.4]}><torusKnotGeometry args={[0.55, 0.13, 64, 8, 2, 3]} /><Material layer="organ" opacity={opacity} color="#c98268" /></mesh></Pickable>
          <Pickable info={partInfo("Urinary bladder", "organ")} selected={selected} onSelect={onSelect}><mesh position={[0, -2.35 - shift, 0.15]} scale={[0.38, 0.42, 0.34]}><sphereGeometry args={[1, 18, 14]} /><Material layer="organ" opacity={Math.min(opacity, 0.7)} color="#c5a56b" /></mesh></Pickable>
          <Pickable info={partInfo("Thyroid gland", "organ")} selected={selected} onSelect={onSelect}><mesh position={[0, 3.22 + shift, 0.23]} scale={[0.36, 0.22, 0.18]}><torusGeometry args={[0.7, 0.2, 8, 24]} /><Material layer="organ" opacity={opacity} color="#c57a66" /></mesh></Pickable>
          <Pickable info={partInfo("Trachea", "organ")} selected={selected} onSelect={onSelect}><mesh position={[0, 2.65, 0.05]} scale={[0.14, 0.66, 0.14]}><cylinderGeometry args={[1, 1, 1, 16]} /><Material layer="organ" opacity={Math.min(opacity, 0.75)} color="#84aaa5" /></mesh></Pickable>
        </>
      )}
      {layers.has("nerve") && (
        <>
          <Pickable info={partInfo("Brain and spinal cord", "nerve", "brain")} selected={selected} onSelect={onSelect}>
            <group position={[-shift, 0, 0]}><mesh position={[0, 4.45, 0]} scale={[0.62, 0.68, 0.58]}><sphereGeometry args={[1, 20, 16]} /><Material layer="nerve" opacity={opacity} /></mesh><mesh position={[0, 1.2, -0.1]} scale={[0.06, 2.65, 0.06]}><capsuleGeometry args={[1, 1, 8, 12]} /><Material layer="nerve" opacity={opacity} /></mesh></group>
          </Pickable>
          {Array.from({ length: 14 }, (_, i) => <BoneBetween key={`nerve-${i}`} a={[0, 3.1 - i * 0.35, -0.1]} b={[(i % 2 ? -1 : 1) * (1.05 + shift), 2.85 - i * 0.35, 0]} radius={0.025} name={`Spinal nerve ${i + 1}`} selected={selected} onSelect={onSelect} opacity={opacity} layer="nerve" />)}
        </>
      )}
      {layers.has("vessel") && (
        <>
          <BoneBetween a={[0.05 + shift, -2.4, 0.18]} b={[0.05 + shift, 3.45, 0.18]} radius={0.075} name="Aorta" selected={selected} onSelect={onSelect} opacity={opacity} layer="vessel" />
          <BoneBetween a={[-0.12 - shift, -2.4, 0.05]} b={[-0.12 - shift, 3.35, 0.05]} radius={0.09} name="Vena cava" selected={selected} onSelect={onSelect} opacity={opacity} layer="vessel" />
        </>
      )}
      {layers.has("muscle") && (
        <>
          {[-1, 1].map((side) => <group key={`muscles-${side}`} position={[side * shift, 0, 0.25]}>
            <BoneBetween a={[side * 0.55, 3, 0]} b={[side * 1.65, 1.55, 0]} radius={0.25} name={`${side < 0 ? "Left" : "Right"} upper-limb muscle group`} selected={selected} onSelect={onSelect} opacity={opacity} />
            <BoneBetween a={[side * 0.5, -0.55, 0]} b={[side * 0.72, -4.2, 0]} radius={0.32} name={`${side < 0 ? "Left" : "Right"} lower-limb muscle group`} selected={selected} onSelect={onSelect} opacity={opacity} />
          </group>)}
          <Pickable info={partInfo("Thoracoabdominal muscle wall", "muscle", "muscle")} selected={selected} onSelect={onSelect}><mesh position={[0, 0.8, 0.18]} scale={[1.18, 2.25, 0.42]}><capsuleGeometry args={[1, 1, 12, 18]} /><Material layer="muscle" opacity={Math.min(opacity, 0.35)} /></mesh></Pickable>
        </>
      )}
    </group>
  );
}

function Scene({
  preset,
  layers,
  selected,
  onSelect,
  opacity,
  explode,
  motion,
}: {
  preset: AnatomyPreset;
  layers: Set<Layer>;
  selected: string | null;
  onSelect: (info: PartInfo) => void;
  opacity: number;
  explode: number;
  motion: boolean;
}) {
  const moving = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (moving.current && motion) moving.current.rotation.y += 0.003;
    if (moving.current && preset === "dentition" && motion) moving.current.rotation.x = Math.sin(clock.elapsedTime * 1.2) * 0.035;
  });
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 8, 6]} intensity={2.2} />
      <directionalLight position={[-5, 2, -4]} intensity={0.8} color="#9bd8d1" />
      <group ref={moving}>
        {preset === "dentition" && <DentalArch selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} layers={layers} />}
        {preset === "tooth" && <DentalArch selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} single layers={layers} />}
        {preset === "tissue" && <ToothLayers selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} />}
        {preset === "spine" && layers.has("bone") && <Spine selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} isolated />}
        {preset === "skeleton" && layers.has("bone") && <Skeleton selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} />}
        {preset === "head" && (
          <>
            {layers.has("bone") && <Skeleton selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} headOnly />}
            <SoftBody selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} layers={layers} headOnly />
          </>
        )}
        {preset === "body" && (
          <>
            {layers.has("bone") && <Skeleton selected={selected} onSelect={onSelect} opacity={Math.min(opacity, 0.74)} explode={explode} />}
            <SoftBody selected={selected} onSelect={onSelect} opacity={opacity} explode={explode} layers={layers} />
          </>
        )}
      </group>
      <ContactShadows position={[0, -4.2, 0]} opacity={0.35} scale={12} blur={2.5} far={8} />
      <gridHelper args={[16, 16, "#31504c", "#20312f"]} position={[0, -4.22, 0]} />
      <OrbitControls makeDefault enablePan enableDamping minDistance={3} maxDistance={16} />
    </>
  );
}

const PRESET_LAYERS: Record<AnatomyPreset, Layer[]> = {
  dentition: ["teeth", "bone", "tissue"],
  tooth: ["teeth", "tissue"],
  head: ["bone", "teeth", "muscle", "organ", "nerve", "vessel"],
  skeleton: ["bone"],
  spine: ["bone", "tissue"],
  body: ["bone", "muscle", "organ", "nerve", "vessel"],
  tissue: ["teeth", "tissue", "nerve", "vessel", "bone"],
};

export function OriginalAnatomyViewer({ preset, label }: { preset: AnatomyPreset; label?: string }) {
  const available = PRESET_LAYERS[preset];
  const [layers, setLayers] = useState<Set<Layer>>(() => new Set(available));
  const [selected, setSelected] = useState<PartInfo | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [explode, setExplode] = useState(0);
  const [motion, setMotion] = useState(false);
  const camera = useMemo<[number, number, number]>(() => {
    if (preset === "dentition") return [0, 0.4, 7.5];
    if (preset === "tooth" || preset === "tissue") return [0, 0.3, 5.8];
    if (preset === "head") return [0, 0.8, 7.2];
    return [0, 0.2, 9.5];
  }, [preset]);
  const toggleLayer = (layer: Layer) => {
    setLayers((current) => {
      const next = new Set(current);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };
  return (
    <div className="originalViewer">
      <div className="originalToolbar">
        <div className="layerToggles">
          {available.map((layer) => (
            <button key={layer} className={layers.has(layer) ? "active" : ""} onClick={() => toggleLayer(layer)}>
              <i style={{ background: COLORS[layer] }} />{layer}
            </button>
          ))}
        </div>
        <div className="anatomyActions">
          <button className={explode > 0 ? "active" : ""} onClick={() => setExplode(explode ? 0 : 1)}>Explode</button>
          <button className={opacity < 1 ? "active" : ""} onClick={() => setOpacity(opacity < 1 ? 1 : 0.34)}>X-ray</button>
          <button className={motion ? "active" : ""} onClick={() => setMotion(!motion)}>Motion</button>
        </div>
      </div>
      <div className="anatomyCanvas" onDoubleClick={() => setSelected(null)}>
        <Canvas camera={{ position: camera, fov: preset === "body" || preset === "skeleton" || preset === "spine" ? 46 : 40 }} dpr={[1, 1.75]}>
          <color attach="background" args={["#0d1817"]} />
          <fog attach="fog" args={["#0d1817", 10, 22]} />
          <Scene preset={preset} layers={layers} selected={selected?.name ?? null} onSelect={setSelected} opacity={opacity} explode={explode} motion={motion} />
        </Canvas>
        {!selected && <div className="anatomyHint">Click a structure · Drag to rotate · Pinch or scroll to zoom</div>}
      </div>
      <div className="originalMeta">
        <div>
          <span>ORIGINAL EDUCATIONAL RECONSTRUCTION</span>
          <b>{label ?? `${preset[0].toUpperCase()}${preset.slice(1)} anatomy`}</b>
          <small>Procedurally modeled for this atlas · selectable layers · not a patient scan</small>
        </div>
        {selected ? (
          <div className="selectedAnatomyInfo">
            <span>{selected.layer.toUpperCase()} · SELECTED</span>
            <b>{selected.name}</b>
            <p><strong>Definition:</strong> {selected.definition}</p>
            <p><strong>Function:</strong> {selected.function}</p>
          </div>
        ) : (
          <div className="selectedAnatomyInfo empty"><b>Select any visible part</b><p>Its name, definition, and function will appear here.</p></div>
        )}
      </div>
      <div className="reconstructionNotice">This original model is an invented educational reconstruction. It is designed for spatial learning, not diagnosis, measurement, surgery, or replacement of validated specimens, scans, radiographs, or faculty instruction.</div>
    </div>
  );
}
