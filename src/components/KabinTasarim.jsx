import { useState, Suspense, useEffect, useMemo, useRef, useTransition, useDeferredValue } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import { Layers3, ScanLine, LampCeiling, Grid2X2, RotateCcw, Undo2, Redo2, MousePointer2, Check, ArrowRight, Link2, Unlink2, Expand, ChevronDown } from 'lucide-react';
import { WALLS, DEFAULT_MATERIAL, materialPath, createCabinConfig, resizePanels, changeWall, mirrorGeometry } from './cabinConfig';
import ekaMaterials from '../data/ekaMaterials.json';
const ekaById = Object.fromEntries(ekaMaterials.map(item => [item.id, item]));
const W = 1.72;
const H = 2.38;
const D = 1.78;
const steel = { color: '#aab6bc', metalness: 0.48, roughness: 0.34, envMapIntensity: 0 };
const steelNames = [
  'Fırçalı Gümüş', 'Fırçalı Altın', 'Parlak Gümüş', 'Parlak Altın',
  'Okyanus Mavisi', 'Buz Mavisi', 'Siyah İnoks', 'Oval Gümüş', 'Oval Altın',
  'Kare Gümüş', 'Kare Altın', 'Benekli Gümüş', 'Benekli Altın',
  'Yaprak Gümüş', 'Yaprak Altın', 'Arabesk Gümüş', 'Arabesk Altın',
  'Çizgili Gümüş', 'Çizgili Altın', 'Örgü Gümüş', 'Örgü Altın',
  'Dama Gümüş', 'Dama Altın', 'Altıgen Gümüş', 'Altıgen Altın',
  'Kabartma Gümüş', 'Kabartma Altın',
];

// HD kaynaklar ortak kullanılır; renk seçenekleri malzeme rengidir.
// Eski 104 seçenek kimliği korunur, küçük ekran görüntüleri 3D'ye yüklenmez.
const stoneColors = [
  '#687780', '#a6ac85', '#3f595b', '#44474a', '#847065',
  '#ffffff', '#e6e5dc', '#e3d7c1', '#e8d8bd', '#b18a54',
  '#a54f4b', '#b07d66', '#e9c590', '#dcc7a5', '#d1987d',
  '#526caa', '#809db4', '#51565d', '#a7a7a1', '#c9d0c0',
  '#bdb4a4', '#497264', '#353535', '#484f5a', '#656270',
];
const woodColors = [
  '#f4d8a8', '#e9c99f', '#e4ba87', '#d9bd9c', '#f8eee0',
  '#d5b280', '#ffffff', '#d5c4b4', '#c79e78', '#b88d67',
  '#d2b08b', '#aeb1b1', '#e1e0dc', '#b8bab7', '#9c9d9a',
  '#8d7c74', '#c2a691', '#f1d5bd', '#d9c7b4', '#ac9179',
  '#b38870', '#a79a84', '#ccc4b8', '#a4b2af', '#968d9c',
  '#d1ad88', '#939a9c',
];
function materialSource(path) {
  if (ekaById[path]) return ekaById[path];
  const [, type, number] = path.match(/(paslanmaz|laminant|tavan|granit)-(\d+)\.png$/) || [];
  const id = Number(number);
  const root = '/kabin-materyalleri/hd/';
  if (type === 'paslanmaz')
    return { url: `${root}paslanmaz-${id}.svg?v=3`, color: '#ffffff', name: steelNames[id - 1] };
  if (type === 'tavan')
    return { url: `${root}${type}-${id}.svg`, color: '#ffffff' };
  if (type === 'granit') {
    if (id >= 26) return { url: `${root}granit-${id}.png`, color: '#ffffff' };
    return { url: root + ([2, 5, 18, 19, 21, 25].includes(id) ? 'gneiss.png' : 'granite.png'), color: stoneColors[id - 1] };
  }
  if (type === 'laminant')
    return { url: root + ([3, 7, 9, 10, 11, 16, 20, 21, 26].includes(id) ? 'walnut.png' : 'oak.png'), color: woodColors[id - 1] };
  return { url: path, color: '#ffffff' };
}

// Her yüzey kendi dokusuna sahip: useTexture önbelleği değiştirilmez.
function useSurfaceTexture(source, width, height, tiled = false, dataMap = false, repeatX = 1, repeatY = 1) {
  const gl = useThree(state => state.gl);
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.colorSpace = dataMap ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    copy.anisotropy = gl.capabilities.getMaxAnisotropy();
    copy.minFilter = THREE.LinearMipmapLinearFilter;
    copy.magFilter = THREE.LinearFilter;
    copy.generateMipmaps = true;
    copy.wrapS = copy.wrapT = tiled ? THREE.MirroredRepeatWrapping : THREE.ClampToEdgeWrapping;
    if (tiled) {
      const aspect = source.image.width / source.image.height;
      const tileHeight = 1.18;
      copy.repeat.set(width / (tileHeight * aspect), height / tileHeight);
    } else {
      copy.repeat.set(1, 1);
    }
    copy.repeat.x *= repeatX;
    copy.repeat.y *= repeatY;
    copy.needsUpdate = true;
    return copy;
  }, [source, width, height, tiled, gl, dataMap, repeatX, repeatY]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

// Kontrollü yansıma: kamera ışını arka düzlemden sanal tavan/zemine uzatılır.
// Böylece doku bir resim gibi sıkıştırılmaz; kamera döndükçe perspektif değişir.
function SurfaceReflection({ texture, ceiling, y, height, width, tint = '#ffffff' }) {
  const uniforms = useMemo(() => ({
    surfaceMap: { value: texture },
    surfaceY: { value: ceiling ? H / 2 : -H / 2 },
    ceiling: { value: ceiling ? 1 : 0 },
    cabinSize: { value: new THREE.Vector2(W, D) },
    surfaceTint: { value: new THREE.Color(tint) },
    reflectionScale: { value: height / 0.29 },
    edgeY: { value: ceiling ? y + height / 2 : y - height / 2 },
  }), [texture, ceiling, tint, height, y]);
  return (
    <mesh position={[0, y, -D / 2 + 0.014]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec3 worldPoint;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            worldPoint = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `}
        fragmentShader={`
          uniform sampler2D surfaceMap;
          uniform float surfaceY;
          uniform float ceiling;
          uniform vec2 cabinSize;
          uniform vec3 surfaceTint;
          uniform float reflectionScale;
          uniform float edgeY;
          varying vec3 worldPoint;
          void main() {
            vec3 samplePoint = worldPoint;
            samplePoint.y = surfaceY + (worldPoint.y - edgeY) / reflectionScale;
            vec3 ray = samplePoint - cameraPosition;
            float safeY = abs(ray.y) < 0.0001 ? 0.0001 : ray.y;
            float t = (surfaceY - samplePoint.y) / safeY;
            vec3 hit = samplePoint + ray * t;
            float sourceZ = -cabinSize.y - hit.z;
            vec2 uv = vec2(hit.x / cabinSize.x + 0.5,
              sourceZ / cabinSize.y + 0.5);
            if (ceiling < 0.5) uv.y = 1.0 - uv.y;
            float edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
            float valid = smoothstep(-0.025, 0.015, edge) * step(0.0, t);
            vec3 neutral = vec3(0.43, 0.49, 0.51);
            vec3 reflected = texture2D(surfaceMap, clamp(uv, 0.0, 1.0)).rgb * surfaceTint;
            vec3 tint = mix(reflected * 0.83, neutral, 0.08);
            gl_FragColor = vec4(mix(neutral, tint, valid), 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `}
      />
    </mesh>
  );
}

function MetalBox({ position, size }) {
  return <mesh position={position}><boxGeometry args={size} /><meshStandardMaterial {...steel} /></mesh>;
}

function Rail({ position, length, rotation }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.013, 0.013, length, 24]} />
      <meshStandardMaterial {...steel} />
    </mesh>
  );
}

function EkaSteelMaterial({ choice, map, width }) {
  const gl = useThree(state => state.gl);
  const environment = useMemo(() => {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const target = generator.fromScene(room, 0.04);
    room.dispose(); generator.dispose();
    return target;
  }, [gl]);
  useEffect(() => () => environment.dispose(), [environment]);
  const [normalSource, roughnessSource] = useTexture([choice.normalMap, choice.roughnessMap || choice.url]);
  const normal = useSurfaceTexture(normalSource, width, H, true, true, ...(choice.normalRepeat || [1, 1]));
  const roughness = useSurfaceTexture(roughnessSource, width, H, true, true, ...(choice.roughnessRepeat || [1, 1]));
  return <meshStandardMaterial map={map} color={choice.color} normalMap={normal}
    normalScale={[choice.normalStrength, choice.normalStrength]} roughnessMap={choice.roughnessMap ? roughness : null}
    envMap={environment.texture} roughness={Math.max(0.4, choice.roughness)} metalness={Math.min(0.6, choice.metalness)} envMapIntensity={0.3} side={THREE.DoubleSide} />;
}

function WallPanel({ path, width, x, selected, onSelect }) {
  const choice = materialSource(path);
  const source = useTexture(choice.url);
  const map = useSurfaceTexture(source, width, H, true);
  const laminate = path.includes('laminant');
  return (
    <group position={[x, 0, 0]}>
      <mesh onClick={event => { event.stopPropagation(); if (event.delta < 5) onSelect(); }}>
        <planeGeometry args={[width, H]} />
        {choice.normalMap ? <EkaSteelMaterial choice={choice} map={map} width={width} /> : <meshStandardMaterial map={map} color={choice.color} metalness={laminate ? 0 : 0.16} roughness={laminate ? 0.72 : 0.48} envMapIntensity={0} side={THREE.DoubleSide} />}
      </mesh>
      <MetalBox position={[width / 2 - 0.003, 0, 0.008]} size={[0.006, H, 0.01]} />
      {selected && <group>
        {[-1, 1].map(side => <mesh key={side} position={[side * (width / 2 - 0.009), 0, 0.017]}>
          <planeGeometry args={[0.009, H - 0.025]} /><meshBasicMaterial color="#ef784d" depthWrite={false} />
        </mesh>)}
        {[-1, 1].map(side => <mesh key={side} position={[0, side * (H / 2 - 0.012), 0.017]}>
          <planeGeometry args={[width - 0.018, 0.009]} /><meshBasicMaterial color="#ef784d" depthWrite={false} />
        </mesh>)}
      </group>}
    </group>
  );
}

function PanelWall({ wall, config, length, position, rotation = [0, 0, 0], selection, onSelect, reverse = false, editing }) {
  return <group position={position} rotation={rotation}>
    {config.widths.map((ratio, index) => {
      const width = length * ratio / 100;
      const preceding = config.widths.slice(0, index).reduce((sum, value) => sum + value, 0);
      const center = -length / 2 + length * preceding / 100 + width / 2;
      return <WallPanel key={index} path={config.materials[index]} width={width}
        x={reverse ? -center : center} selected={editing && selection.wall === wall && selection.index === index}
        onSelect={() => onSelect({ wall, index })} />;
    })}
  </group>;
}

function KendiAsansorumuz({ config: requestedConfig, selection, onSelect, editing, onMirrorSelect }) {
  const config = useDeferredValue(requestedConfig);
  const roofChoice = materialSource(config.ceiling);
  const floorChoice = materialSource(config.floor);
  const [roof, floor] = useTexture([roofChoice.url, floorChoice.url]);
  const roofMap = useSurfaceTexture(roof, W, D);
  const floorMap = useSurfaceTexture(floor, W, D);
  const railY = -0.12;
  const mirror = mirrorGeometry(config);
  const panelW = mirror.width;
  const topH = mirror.topReflection;
  const bottomH = mirror.bottomReflection;
  const panelTop = mirror.top - topH;
  const panelBottom = mirror.bottom + bottomH;
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -H / 2, 0]}>
      <planeGeometry args={[W, D]} />
      <meshStandardMaterial map={floorMap} color={floorChoice.color} roughness={0.68} metalness={0} envMapIntensity={0} side={THREE.DoubleSide} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H / 2, 0]}>
      <planeGeometry args={[W, D]} />
      <meshStandardMaterial map={roofMap} color="#ffffff" emissive="#ffffff" emissiveMap={roofMap} emissiveIntensity={0.38} roughness={0.66} metalness={0} envMapIntensity={0} side={THREE.DoubleSide} />
    </mesh>
    {[-1, 1].map(side => {
      const wall = side === -1 ? 'left' : 'right';
      return <group key={side}>
        <PanelWall wall={wall} config={config.walls[wall]} length={D} position={[side * W / 2, 0, 0]}
          rotation={[0, -side * Math.PI / 2, 0]} reverse={side === 1} selection={selection} onSelect={onSelect} editing={editing} />
        {[0.28, -0.63].map(y => <MetalBox key={y} position={[side * (W / 2 - 0.008), y, 0]} size={[0.012, 0.018, D]} />)}
        <MetalBox position={[side * (W / 2 - 0.009), -H / 2 + 0.035, 0]} size={[0.014, 0.07, D]} />
        <Rail position={[side * (W / 2 - 0.07), railY, -0.12]} length={D * 0.62} rotation={[Math.PI / 2, 0, 0]} />
        {[-0.55, 0.31].map(z => <Rail key={z} position={[side * (W / 2 - 0.036), railY, z]} length={0.07} rotation={[0, 0, Math.PI / 2]} />)}
        <MetalBox position={[side * (W / 2 + 0.015), 0, D / 2]} size={[0.03, H + 0.06, 0.035]} />
      </group>;
    })}
    <PanelWall wall="rearCenter" config={config.walls.rearCenter} length={W} position={[0, 0, -D / 2]} selection={selection} onSelect={onSelect} editing={editing} />
    {config.mirrorMode !== 'none' && <group position={[mirror.x, 0, 0]} onClick={event => { event.stopPropagation(); if (event.delta < 5) onMirrorSelect(); }}>
      {topH > 0 && <SurfaceReflection texture={roofMap} ceiling y={mirror.top - topH / 2} height={topH} width={panelW} />}
      <mesh position={[0, (panelTop + panelBottom) / 2, -D / 2 + 0.014]}>
        <planeGeometry args={[panelW, panelTop - panelBottom]} /><meshBasicMaterial color="#b9cbd1" />
      </mesh>
      {bottomH > 0 && <SurfaceReflection texture={floorMap} tint={floorChoice.color} ceiling={false} y={mirror.bottom + bottomH / 2} height={bottomH} width={panelW} />}
      {[-1, 1].map(side => <MetalBox key={side} position={[side * panelW / 2, (mirror.top + mirror.bottom) / 2, -D / 2 + 0.02]} size={[0.006, mirror.height, 0.012]} />)}
      {[mirror.top, mirror.bottom].map(y => <MetalBox key={y} position={[0, y, -D / 2 + 0.021]} size={[panelW, 0.009, 0.012]} />)}
    </group>}
    <Rail position={[0, railY, -D / 2 + 0.08]} length={W * 0.7} rotation={[0, 0, Math.PI / 2]} />
    {[-0.49, 0.49].map(x => <Rail key={x} position={[x, railY, -D / 2 + 0.043]} length={0.075} rotation={[Math.PI / 2, 0, 0]} />)}
    <MetalBox position={[0, -H / 2 + 0.025, -D / 2 + 0.006]} size={[W, 0.05, 0.012]} />
    <MetalBox position={[0, H / 2 + 0.015, D / 2]} size={[W + 0.06, 0.03, 0.035]} />
    <MetalBox position={[0, -H / 2 - 0.012, D / 2]} size={[W + 0.06, 0.024, 0.08]} />
      {/* Sağ duvara sıfıra yakın, ince fırçalı çelik kumanda paneli. */}
      <group position={[W / 2 - 0.019, 0.08, D * 0.32]} rotation={[0, -Math.PI / 2, 0]}>
        <MetalBox position={[0, 0, 0]} size={[0.18, 1.85, 0.012]} />
        <mesh position={[0, 0.65, 0.008]}>
          <planeGeometry args={[0.132, 0.23]} /><meshBasicMaterial color="#111d26" />
        </mesh>
        {/* Yerel geometri ile dijital 3 ve yukarı oku; dış font gerektirmez. */}
        {[[-0.015, 0.71, 0.041, 0.006], [-0.015, 0.68, 0.041, 0.006],
          [-0.015, 0.65, 0.041, 0.006], [0.003, 0.695, 0.006, 0.03], [0.003, 0.665, 0.006, 0.03],
          [0.038, 0.68, 0.005, 0.04]].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.009]}><planeGeometry args={[w, h]} /><meshBasicMaterial color="#b8e8ff" toneMapped={false} /></mesh>
        ))}
        <mesh position={[0.038, 0.707, 0.009]}><circleGeometry args={[0.014, 3]} /><meshBasicMaterial color="#b8e8ff" toneMapped={false} /></mesh>
        {Array.from({ length: 12 }, (_, i) => (
          <group key={i} position={[(i % 2 - 0.5) * 0.069, 0.2 - Math.floor(i / 2) * 0.075, 0.011]}>
            <mesh><ringGeometry args={[0.016, 0.02, 24]} /><meshStandardMaterial color={i === 2 ? '#94c8db' : '#626d72'} roughness={0.5} /></mesh>
            <mesh position={[0, 0, 0.001]}><circleGeometry args={[0.015, 24]} /><meshStandardMaterial {...steel} /></mesh>
            <mesh position={[0, 0, 0.002]}><circleGeometry args={[0.002, 8]} /><meshBasicMaterial color="#45535b" /></mesh>
          </group>
        ))}
        <mesh position={[0, -0.67, 0.007]}><planeGeometry args={[0.125, 0.28]} /><meshStandardMaterial color="#aeb9be" roughness={0.65} /></mesh>
      </group>
    </group>
  ;
}

function CameraView({ view }) {
  const controls = useRef();
  const { camera } = useThree();
  useEffect(() => {
    const positions = { front: [0, 0.02, 5.25], left: [1.45, 0.03, 5.1], right: [-1.45, 0.03, 5.1] };
    camera.position.set(...positions[view.name]);
    controls.current?.target.set(0, -0.03, 0);
    controls.current?.update();
  }, [camera, view]);
  return <OrbitControls ref={controls} enablePan={false} enableDamping dampingFactor={0.08}
    minDistance={4.9} maxDistance={6.2} minAzimuthAngle={-0.34} maxAzimuthAngle={0.34}
    minPolarAngle={Math.PI / 2 - 0.07} maxPolarAngle={Math.PI / 2 + 0.07} target={[0, -0.03, 0]} />;
}

const swatchStyle = path => {
  const source = materialSource(path);
  return { backgroundImage: `url('${source.thumbnail || source.url}')`, backgroundColor: source.thumbnail ? '#ffffff' : source.color,
    backgroundBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center' };
};
const materialName = path => materialSource(path).name || path.split('/').pop().replace('.png', '').replace('laminant-', 'Laminant ').replace('granit-', 'Granit ').replace('tavan-', 'Tavan ');
const categories = [
  { id: 'walls', name: 'Duvarlar', icon: Layers3 }, { id: 'mirror', name: 'Ayna', icon: ScanLine },
  { id: 'ceiling', name: 'Tavan', icon: LampCeiling }, { id: 'floor', name: 'Zemin', icon: Grid2X2 },
];

function RangeControl({ label, value, min, max, suffix = '%', onChange, onFinish }) {
  return <label className="block">
    <span className="flex justify-between text-sm mb-3"><span className="text-slate-600">{label}</span><strong className="font-semibold text-slate-900 tabular-nums">{value}{suffix}</strong></span>
    <input className="w-full h-1.5 accent-[#e66b43] cursor-pointer" type="range" aria-label={label}
      min={min} max={max} step={1} value={value} onChange={event => onChange(Number(event.target.value))}
      onPointerUp={onFinish} onPointerCancel={onFinish} onKeyUp={onFinish} onBlur={onFinish} />
    <span className="flex justify-between text-[10px] mt-2 text-slate-400"><span>{min}{suffix}</span><span>{max}{suffix}</span></span>
  </label>;
}

function MaterialGrid({ type, count, selected, onSelect }) {
  const entries = [...ekaMaterials.filter(item => item.type === type).map(item => item.id), ...Array.from({ length: count }, (_, i) => materialPath(type, i + 1))];
  return <><div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-6 gap-2">
    {entries.map((path, i) => {
      return <button key={path} type="button" title={materialName(path)} aria-label={materialName(path)}
        aria-pressed={selected === path} onClick={() => onSelect(path)}
        className={`relative aspect-square rounded-md border transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-orange-500 ${selected === path ? 'border-[#e66b43] ring-2 ring-orange-200' : 'border-slate-200'}`}
        style={swatchStyle(path)}>
        <span className="absolute bottom-1 left-1 text-[9px] bg-black/40 text-white rounded px-1 leading-4">{String(i + 1).padStart(2, '0')}</span>
        {selected === path && <span className="absolute top-1 right-1 bg-[#e66b43] text-white p-0.5 rounded-full"><Check size={10} /></span>}
      </button>;
    })}
  </div><p className="mt-2 text-[10px] text-slate-400">{entries.length} seçenek · Malzeme adını görmek için üzerine gel.</p></>;
}

export default function KabinTasarim() {
  const [history, setHistory] = useState(() => ({ past: [], present: createCabinConfig(), future: [] }));
  const config = history.present;
  const [section, setSection] = useState('walls');
  const [selection, setSelection] = useState({ wall: 'rearCenter', index: 1 });
  const [family, setFamily] = useState('paslanmaz');
  const [linked, setLinked] = useState(false);
  const [view, setView] = useState({ name: 'front', version: 0 });
  const [pending, startTransition] = useTransition();
  const gesture = useRef(null);
  const change = (update, group = null) => {
    const coalesce = group !== null && gesture.current === group;
    gesture.current = group;
    setHistory(old => ({ past: coalesce ? old.past : [...old.past, old.present].slice(-40),
      present: typeof update === 'function' ? update(old.present) : update, future: [] }));
  };
  const finishGesture = () => { gesture.current = null; };
  const undo = () => {
    finishGesture();
    setHistory(old => old.past.length ? { past: old.past.slice(0, -1), present: old.past.at(-1), future: [old.present, ...old.future] } : old);
  };
  const redo = () => {
    finishGesture();
    setHistory(old => old.future.length ? { past: [...old.past, old.present], present: old.future[0], future: old.future.slice(1) } : old);
  };
  const choosePanel = next => {
    setSelection(next);
    setSection('walls');
    setFamily(config.walls[next.wall].materials[next.index].includes('laminant') ? 'laminant' : 'paslanmaz');
  };
  const setMaterial = path => startTransition(() => change(old => changeWall(old, selection.wall,
    wall => ({ ...wall, materials: wall.materials.map((value, index) => index === selection.index ? path : value) }), linked)));
  const selectedWall = config.walls[selection.wall];
  const selectedPath = selectedWall.materials[selection.index];
  const selectedLength = selection.wall === 'rearCenter' ? W : D;
  const mm = Math.round(selectedLength * selectedWall.widths[selection.index] * 10);
  const changedPanels = Object.values(config.walls).reduce((sum, wall) => sum + wall.materials.filter(path => path !== DEFAULT_MATERIAL).length, 0);

  return <div className="bg-[#f5f6f7] min-h-[calc(100vh-80px)] text-slate-800 font-sans px-4 sm:px-7 lg:px-10 pt-7 pb-10">
    <div className="max-w-[1480px] mx-auto">
      <header className="flex flex-wrap justify-between items-end gap-4 mb-7">
        <div><p className="text-[10px] uppercase tracking-[0.28em] text-[#bc674b] font-semibold mb-2">HAS DOOR / TASARIM STÜDYOSU</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kendi kabinini oluştur<span className="text-[#e66b43]">.</span></h1>
          <p className="text-sm text-slate-500 mt-2">Malzemeleri bir araya getir. Her panelde kendi çizgini yansıt.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={undo} disabled={!history.past.length} aria-label="Geri al" title="Geri al" className="p-2.5 bg-white rounded-lg border border-slate-200 disabled:opacity-30"><Undo2 size={17} /></button>
          <button type="button" onClick={redo} disabled={!history.future.length} aria-label="Yinele" title="Yinele" className="p-2.5 bg-white rounded-lg border border-slate-200 disabled:opacity-30"><Redo2 size={17} /></button>
          <button type="button" onClick={() => { change(createCabinConfig()); setSelection({ wall: 'rearCenter', index: 1 }); setLinked(false); setFamily('paslanmaz'); setSection('walls'); setView({ name: 'front', version: view.version + 1 }); }} className="flex items-center gap-2 px-3 py-2.5 text-xs bg-white rounded-lg border border-slate-200"><RotateCcw size={15} /> Baştan başla</button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[370px_minmax(0,1fr)] xl:grid-cols-[410px_minmax(0,1fr)] gap-5 lg:gap-7 items-start">
        <aside className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden order-2 lg:order-1 lg:max-h-[calc(100svh-120px)] lg:overflow-y-auto lg:sticky lg:top-24">
          <nav aria-label="Tasarım kategorileri" className="grid grid-cols-4 border-b border-slate-100 bg-[#fafafa] p-2 gap-1 sticky top-0 z-20">
            {categories.map(({ id, name, icon: Icon }) => <button key={id} type="button" onClick={() => setSection(id)} aria-pressed={section === id}
              className={`flex flex-col items-center gap-2 py-3 text-xs rounded-xl transition ${section === id ? 'bg-white text-[#d7623c] shadow-sm font-semibold' : 'text-slate-500 hover:bg-white'}`}><Icon size={19} strokeWidth={1.6} />{name}</button>)}
          </nav>
          <div className="p-5 sm:p-6">
            {section === 'walls' && <>
              <div className="flex justify-between items-center mb-4"><h2 className="font-semibold text-base">Duvar & panel seçimi</h2><span className="text-[10px] text-slate-400">01 / 04</span></div>
              <div className="grid grid-cols-2 gap-2 mb-5">{Object.entries(WALLS).map(([key, name]) => <button type="button" key={key}
                onClick={() => choosePanel({ wall: key, index: selection.index })} aria-pressed={selection.wall === key}
                className={`rounded-lg border py-2.5 text-xs transition ${selection.wall === key ? 'border-[#e4a68e] bg-[#fcf1ec] text-[#ac4d2d] font-semibold' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}>{name}</button>)}</div>
              <div className="flex justify-between items-center mb-2"><span className="text-xs text-slate-500">{selection.wall.startsWith('rear') ? 'Soldan sağa üç dikey panel' : 'Girişten arkaya üç dikey panel'}</span><span className="text-[10px] uppercase tracking-wider text-slate-400">PANEL SEÇ</span></div>
              <div className="flex gap-1.5 h-24 mb-3">{selectedWall.materials.map((path, index) => <button type="button" key={index}
                style={{ ...swatchStyle(path), flex: selectedWall.widths[index] }} onClick={() => choosePanel({ ...selection, index })}
                aria-label={`Panel ${index + 1}`} aria-pressed={selection.index === index}
                className={`relative rounded-md border-2 overflow-hidden min-w-0 ${selection.index === index ? 'border-[#e66b43]' : 'border-transparent'}`}>
                <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-2 inset-x-0 text-white text-[11px] font-medium">{index + 1} · %{selectedWall.widths[index]}</span>
                {selection.index === index && <Check size={13} className="absolute right-1 top-1 text-white bg-[#e66b43] rounded-full p-0.5" />}
              </button>)}</div>
              <p className="text-[11px] text-slate-400 mb-5 flex items-center gap-1.5"><MousePointer2 size={12} /> Kabin üzerinden bir panele de tıklayabilirsin.</p>
              <RangeControl label="Seçili panel genişliği" min={15} max={70} value={selectedWall.widths[selection.index]}
                onChange={value => change(old => changeWall(old, selection.wall, wall => ({ ...wall, widths: resizePanels(wall.widths, selection.index, value) }), linked), 'panel-width')}
                onFinish={finishGesture} />
              <p className="text-[11px] text-slate-400 mt-2 mb-4">Yaklaşık {mm} mm · Diğer iki panel otomatik dengelenir.</p>
              {selection.wall !== 'rearCenter' && <button type="button" onClick={() => setLinked(!linked)} aria-pressed={linked} className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs ${linked ? 'bg-[#fcf1ec] border-orange-200 text-[#ac4d2d]' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                <span className="flex gap-2 items-center">{linked ? <Link2 size={14} /> : <Unlink2 size={14} />} {selection.wall.startsWith('rear') ? 'Arka iki yana aynı uygula' : 'İki yan duvara aynı uygula'}</span>
                <span className={`w-7 h-4 rounded-full relative ${linked ? 'bg-[#e66b43]' : 'bg-slate-300'}`}><span className={`absolute top-0.5 bg-white w-3 h-3 rounded-full ${linked ? 'right-0.5' : 'left-0.5'}`} /></span>
              </button>}
              {selection.wall === 'rearCenter' && config.mirrorMode !== 'none' && <button type="button" onClick={() => change(old => ({ ...old, mirrorMode: 'none' }))} className="text-xs bg-orange-50 text-orange-800 rounded-lg p-3 w-full">Panelleri görmek için aynayı kaldır</button>}
              <div className="border-t border-slate-100 mt-5 pt-5">
                <div className="flex justify-between items-center mb-3"><h3 className="text-sm font-semibold">Panel malzemesi</h3><span className="text-[10px] text-[#c56b4a]">PANEL {selection.index + 1}</span></div>
                <div className="flex p-1 bg-slate-100 rounded-lg mb-4">{[['paslanmaz', 'Paslanmazlar'], ['laminant', 'Laminantlar']].map(([id, name]) => <button key={id} type="button" onClick={() => setFamily(id)} aria-pressed={family === id} className={`flex-1 py-2 rounded-md text-xs ${family === id ? 'bg-white shadow-sm font-semibold' : 'text-slate-500'}`}>{name}</button>)}</div>
                <MaterialGrid type={family} count={27} selected={selectedPath} onSelect={setMaterial} />
                <p className="text-xs text-slate-500 mt-3 min-h-4">Seçili: <span className="text-slate-800 font-medium">{materialName(selectedPath)}</span></p>
                <button type="button" onClick={() => startTransition(() => change(old => changeWall(old, selection.wall, wall => ({ ...wall, materials: Array(3).fill(selectedPath) }), linked)))}
                  className="mt-4 flex items-center justify-between w-full text-xs text-slate-600 bg-slate-50 rounded-lg py-3 px-3 hover:bg-slate-100">Bu malzemeyi duvarın üç paneline uygula <ArrowRight size={14} /></button>
              </div>
            </>}
            {section === 'mirror' && <>
              <div className="flex justify-between mb-2"><h2 className="font-semibold">İsteğe bağlı ayna</h2><span className="text-[10px] text-slate-400">02 / 04</span></div>
              <p className="text-xs leading-5 text-slate-500 mb-5">Arka duvar toplam üç dikey panelden oluşur. Ayna orta panele eklenir; panel seçimlerin korunur. Yansıma yalnız tam boy aynada görünür.</p>
              <div className="grid grid-cols-2 gap-2 mb-6">{[['none','Ayna yok'],['full','Tam boy'],['half','Yarım boy'],['custom','Özel ölçü']].map(([mode, label]) => <button type="button" key={mode} aria-pressed={config.mirrorMode === mode} onClick={() => change(old => ({ ...old, mirrorMode: mode }))} className={`border rounded-lg py-3 text-xs ${config.mirrorMode === mode ? 'border-orange-300 bg-orange-50 text-orange-800 font-semibold' : 'border-slate-200 text-slate-500'}`}>{label}</button>)}</div>
              <div className="flex h-44 gap-1 mx-auto max-w-52 mb-6 relative border-4 border-slate-200 rounded overflow-hidden">
                {config.walls.rearCenter.materials.map((path, i) => <div key={i} style={{ ...swatchStyle(path), flex: config.walls.rearCenter.widths[i] }} />)}
                {config.mirrorMode !== 'none' && <div style={{ height: `${mirrorGeometry(config).height / H * 100}%`, left: `${config.walls.rearCenter.widths[0]}%`, width: `${config.walls.rearCenter.widths[1]}%` }} className="absolute top-0 bg-gradient-to-br from-slate-100 via-[#b8cdd4] to-[#e8f3f5] border-b border-slate-400 flex items-center justify-center text-[10px] text-slate-600 tracking-wider">AYNA</div>}
              </div>
              <div className="space-y-6">
                <RangeControl label="Orta panel / ayna genişliği" value={config.walls.rearCenter.widths[1]} min={15} max={70} onChange={value => change(old => changeWall(old, 'rearCenter', wall => ({ ...wall, widths: resizePanels(wall.widths, 1, value) })), 'mirror-width')} onFinish={finishGesture} />
                {config.mirrorMode !== 'none' && <>
                  <RangeControl label="Ayna yüksekliği" value={Math.round(mirrorGeometry(config).height * 100)} min={60} max={238} suffix=" cm" onChange={value => change(old => ({ ...old, mirrorMode: 'custom', mirrorHeight: value }), 'mirror-height')} onFinish={finishGesture} />
                  <p className="text-xs text-slate-500">Ayna ölçüsü: {Math.round(mirrorGeometry(config).width * 100)} × {Math.round(mirrorGeometry(config).height * 100)} cm</p>
                  {config.mirrorMode === 'full' && <details className="text-xs border-t border-slate-100 pt-4"><summary className="cursor-pointer text-slate-500">Yansıma ayarları</summary><div className="space-y-5 mt-5">
                    <RangeControl label="Üst yansıma yüksekliği" value={config.topReflection} min={25} max={62} suffix=" cm" onChange={value => change(old => ({ ...old, topReflection: value }), 'mirror-top')} onFinish={finishGesture} />
                    <RangeControl label="Alt yansıma yüksekliği" value={config.bottomReflection} min={25} max={62} suffix=" cm" onChange={value => change(old => ({ ...old, bottomReflection: value }), 'mirror-bottom')} onFinish={finishGesture} />
                    <p className="text-slate-400 leading-5">Yansıma yalnız tam boy aynada gösterilir.</p>
                  </div></details>}
                </>}
              </div>
              <button type="button" onClick={() => choosePanel({ wall: 'rearCenter', index: 1 })} className="mt-6 w-full rounded-lg bg-slate-50 p-3 text-xs text-slate-600">Orta alanın üç panelini düzenle →</button>
            </>}
            {(section === 'ceiling' || section === 'floor') && <>
              <div className="flex justify-between mb-2"><h2 className="font-semibold">{section === 'ceiling' ? 'Tavanlar' : 'Taban Granitleri'}</h2><span className="text-[10px] text-slate-400">{section === 'ceiling' ? '03' : '04'} / 04</span></div>
              <p className="text-xs leading-5 text-slate-500 mb-5">{section === 'ceiling' ? 'Kabinine ışık ve karakter katan dekoratif tavanlar.' : 'Doğal taşlar ve tek parça dekoratif zeminler.'}</p>
              <MaterialGrid type={section === 'ceiling' ? 'tavan' : 'granit'} count={section === 'ceiling' ? 23 : 27} selected={config[section]}
                onSelect={path => startTransition(() => change(old => ({ ...old, [section]: path })))} />
              <div className="mt-5 rounded-xl border border-slate-200 overflow-hidden">
                <div className="aspect-[2/1]" style={{ ...swatchStyle(config[section]), backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
                <p className="text-xs px-3 py-3 border-t border-slate-100">{materialName(config[section])}</p>
              </div>
            </>}
          </div>
        </aside>

        <section aria-label="3D kabin önizlemesi" className="order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-[#e9edef] shadow-sm">
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
              <div><p className="text-[10px] tracking-[0.22em] uppercase text-slate-400">TASARIMINIZ</p><p className="text-sm font-medium mt-1">{section === 'walls' ? `${WALLS[selection.wall]} · Panel ${selection.index + 1}` : 'Kabin görünümü'}</p></div>
              <span role="status" className="text-[10px] bg-white/80 border border-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-slate-500"><span className={`w-1.5 h-1.5 rounded-full ${pending ? 'bg-orange-400' : 'bg-emerald-500'}`} />{pending ? 'Malzeme yükleniyor' : 'Canlı önizleme'}</span>
            </div>
            <div className="h-[470px] sm:h-[560px] lg:h-[min(740px,calc(100svh-320px))] lg:min-h-[340px]">
              <Canvas camera={{ position: [0, 0.02, 5.25], fov: 34 }} dpr={[1.5, 2]} gl={{ antialias: true }}
                onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; gl.outputColorSpace = THREE.SRGBColorSpace; }}>
                <color attach="background" args={['#e9edef']} />
                <hemisphereLight args={['#ffffff', '#d6dde2', 2.2]} />
                <directionalLight position={[2.5, 3, 4]} intensity={1.5} /><directionalLight position={[-3, 0.5, 3]} intensity={0.85} />
                <Suspense fallback={<Html center><span className="text-xs whitespace-nowrap bg-white p-3 rounded-lg shadow-sm">Kabin hazırlanıyor…</span></Html>}>
                  <KendiAsansorumuz config={config} selection={selection} onSelect={choosePanel} editing={section === 'walls'} onMirrorSelect={() => setSection('mirror')} />
                </Suspense>
                <CameraView view={view} />
              </Canvas>
            </div>
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none"><p className="text-[10px] sm:text-xs text-slate-500 bg-white/80 border border-white rounded-full px-3 py-2">Sürükleyerek döndür · Bir panele dokunarak seç</p></div>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-3 mt-3">
            <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200">{[['front', 'Karşıdan'], ['left', 'Sol duvar'], ['right', 'Sağ duvar']].map(([name, label]) => <button key={name} type="button" onClick={() => setView({ name, version: view.version + 1 })} aria-label={`${label} görünümü`}
              className={`px-3 py-2 text-[11px] rounded-lg ${view.name === name ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>{label}</button>)}</div>
            <button type="button" onClick={() => setView({ name: 'front', version: view.version + 1 })} className="flex gap-1.5 items-center text-xs text-slate-500"><Expand size={14} /> Görünümü sıfırla</button>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-200 pt-4">
            <div><p className="text-[9px] uppercase tracking-widest text-slate-400">KABİN ÖLÇÜSÜ</p><p className="text-xs mt-1.5 font-medium">172 × 178 × 238 cm</p></div>
            <div><p className="text-[9px] uppercase tracking-widest text-slate-400">DİKEY PANELLER</p><p className="text-xs mt-1.5 font-medium">9 bağımsız bölüm</p></div>
            <div><p className="text-[9px] uppercase tracking-widest text-slate-400">AYNA</p><p className="text-xs mt-1.5 font-medium">{config.mirrorMode === 'none' ? 'Ayna yok' : `${Math.round(mirrorGeometry(config).width * 100)} × ${Math.round(mirrorGeometry(config).height * 100)} cm`}</p></div>
          </div>
          <details className="mt-5 bg-white rounded-xl border border-slate-200 text-xs">
            <summary className="px-4 py-3 cursor-pointer flex items-center justify-between text-slate-600">Tasarım özeti <span className="flex items-center gap-2 text-slate-400">{changedPanels} panel özelleştirildi <ChevronDown size={14} /></span></summary>
            <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">{Object.entries(WALLS).map(([wall, name]) => <div key={wall}><p className="font-semibold mb-1">{name}</p><p className="text-slate-500 leading-5">{config.walls[wall].materials.map((path, i) => `${i + 1}. ${materialName(path)} (%${config.walls[wall].widths[i]})`).join(' · ')}</p></div>)}</div>
          </details>
        </section>
      </div>
    </div>
  </div>;
}
