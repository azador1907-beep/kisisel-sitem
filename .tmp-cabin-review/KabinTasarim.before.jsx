import { useState, Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';

const W = 1.72;
const H = 2.38;
const D = 1.78;
const steel = { color: '#aab6bc', metalness: 0.48, roughness: 0.34 };
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
function useSurfaceTexture(source, width, height, tiled = false) {
  const gl = useThree(state => state.gl);
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.colorSpace = THREE.SRGBColorSpace;
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
    copy.needsUpdate = true;
    return copy;
  }, [source, width, height, tiled, gl]);
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
  }), [texture, ceiling, tint]);
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
          varying vec3 worldPoint;
          void main() {
            vec3 ray = worldPoint - cameraPosition;
            float safeY = abs(ray.y) < 0.0001 ? 0.0001 : ray.y;
            float t = (surfaceY - worldPoint.y) / safeY;
            vec3 hit = worldPoint + ray * t;
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

function KendiAsansorumuz({ duvarDoku, tavanDoku, granitDoku }) {
  const wallChoice = materialSource(duvarDoku);
  const roofChoice = materialSource(tavanDoku);
  const floorChoice = materialSource(granitDoku);
  const [wall, roof, floor] = useTexture([wallChoice.url, roofChoice.url, floorChoice.url]);
  const rearMap = useSurfaceTexture(wall, W, H, true);
  const sideMap = useSurfaceTexture(wall, D, H, true);
  const roofMap = useSurfaceTexture(roof, W, D);
  const floorMap = useSurfaceTexture(floor, W, D);
  const laminate = duvarDoku.includes('laminant');
  const wallMaterial = { color: wallChoice.color, metalness: laminate ? 0 : 0.16,
    roughness: laminate ? 0.72 : 0.48, side: THREE.DoubleSide };
  const panelW = W * 0.43;
  const railY = -0.12;
  const topH = 0.29;
  const bottomH = 0.29;
  const panelTop = H / 2 - topH;
  const panelBottom = -H / 2 + bottomH;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -H / 2, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={floorMap} color={floorChoice.color} roughness={0.68} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H / 2, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={roofMap} color="#ffffff" emissive="#ffffff" emissiveMap={roofMap}
          emissiveIntensity={0.38} roughness={0.66} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -D / 2]}>
        <planeGeometry args={[W, H]} /><meshStandardMaterial map={rearMap} {...wallMaterial} />
      </mesh>
      {[-1, 1].map(side => (
        <group key={side}>
          <mesh rotation={[0, -side * Math.PI / 2, 0]} position={[side * W / 2, 0, 0]}>
            <planeGeometry args={[D, H]} /><meshStandardMaterial map={sideMap} {...wallMaterial} />
          </mesh>
          {[0.28, -0.63].map(y => <MetalBox key={y} position={[side * (W / 2 - 0.008), y, 0]} size={[0.012, 0.022, D]} />)}
          <MetalBox position={[side * (W / 2 - 0.009), -H / 2 + 0.035, 0]} size={[0.014, 0.07, D]} />
          <Rail position={[side * (W / 2 - 0.07), railY, -0.12]} length={D * 0.62} rotation={[Math.PI / 2, 0, 0]} />
          {[-0.55, 0.31].map(z => <Rail key={z} position={[side * (W / 2 - 0.036), railY, z]} length={0.07} rotation={[0, 0, Math.PI / 2]} />)}
          <MetalBox position={[side * (W / 2 + 0.015), 0, D / 2]} size={[0.03, H + 0.06, 0.035]} />
        </group>
      ))}
      <SurfaceReflection texture={roofMap} ceiling y={H / 2 - topH / 2} height={topH} width={panelW} />
      <mesh position={[0, (panelTop + panelBottom) / 2, -D / 2 + 0.014]}>
        <planeGeometry args={[panelW, panelTop - panelBottom]} />
        <meshStandardMaterial color="#b9cbd1" roughness={0.8} metalness={0} />
      </mesh>
      <SurfaceReflection texture={floorMap} tint={floorChoice.color} ceiling={false} y={-H / 2 + bottomH / 2} height={bottomH} width={panelW} />
      {[-1, 1].map(side => <MetalBox key={side} position={[side * (panelW / 2 + 0.005), 0, -D / 2 + 0.02]} size={[0.009, H, 0.012]} />)}
      {[panelTop, panelBottom].map(y => <MetalBox key={y} position={[0, y, -D / 2 + 0.021]} size={[panelW, 0.009, 0.012]} />)}
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
  );
}

  const MenuBaslik = ({
    id,
    baslik,
    activeTab,
    setActiveTab,
  }) => {
    const isActive =
      activeTab === id;

    return (
      <button
        type="button"
        onClick={() =>
          setActiveTab(
            isActive ? '' : id
          )
        }
        className={`w-full py-4 font-bold text-lg flex items-center gap-4 transition-colors border-b border-slate-300 ${
          isActive
            ? 'text-[#e85d36]'
            : 'text-slate-700 hover:text-slate-500'
        }`}
      >
        <span className="text-2xl">
          {isActive ? '−' : '+'}
        </span>

        <span>{baslik}</span>
      </button>
    );
  };

  const MalzemeKutusu = ({
    item,
    secili,
    onClick,
    contain = false,
  }) => (
    <button
      type="button"
      aria-label={item.path.split('/').pop().replace('.png', '')}
      title={materialSource(item.path).name || item.path.split('/').pop().replace('.png', '')}
      aria-pressed={secili}
      onClick={onClick}
      className={`aspect-square w-full border bg-white shadow-sm transition-all hover:scale-105 ${
        secili
          ? 'border-orange-500 ring-2 ring-orange-200'
          : 'border-slate-200'
      }`}
      style={{
        backgroundImage:
          `url('${materialSource(item.path).url}')`,
        backgroundColor: materialSource(item.path).color,
        backgroundBlendMode: 'multiply',
        backgroundSize:
          contain
            ? 'contain'
            : 'cover',
        backgroundRepeat:
          'no-repeat',
        backgroundPosition:
          'center',
      }}
    />
  );


export default function KabinTasarim() {
  const [activeTab, setActiveTab] =
    useState('granit');

  const [duvarDoku, setDuvarDoku] =
    useState(
      '/kabin-materyalleri/paslanmaz-1.png'
    );

  const [tavanDoku, setTavanDoku] =
    useState(
      '/kabin-materyalleri/tavan-1.png'
    );

  const [granitDoku, setGranitDoku] =
    useState(
      '/kabin-materyalleri/granit-1.png'
    );

  const paslanmazSecenekleri =
    Array.from(
      { length: 27 },
      (_, i) => ({
        id: i + 1,
        path:
          `/kabin-materyalleri/paslanmaz-${i + 1}.png`,
      })
    );

  const laminantSecenekleri =
    Array.from(
      { length: 27 },
      (_, i) => ({
        id: i + 1,
        path:
          `/kabin-materyalleri/laminant-${i + 1}.png`,
      })
    );

  const tavanSecenekleri =
    Array.from(
      { length: 23 },
      (_, i) => ({
        id: i + 1,
        path:
          `/kabin-materyalleri/tavan-${i + 1}.png`,
      })
    );

  const granitSecenekleri =
    Array.from(
      { length: 27 },
      (_, i) => ({
        id: i + 1,
        path:
          `/kabin-materyalleri/granit-${i + 1}.png`,
      })
    );

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-slate-50 py-6 px-4 sm:px-8 font-sans">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* ====================================================
            SOL PANEL
        ==================================================== */}

        <div className="lg:col-span-5">

          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-800 uppercase border-b-2 border-slate-300 pb-4 mb-2">
            Kendi Kabinini Oluştur
          </h2>

          {/* TAVAN */}

          <MenuBaslik activeTab={activeTab} setActiveTab={setActiveTab}
            id="tavan"
            baslik="Tavanlar"
          />

          {activeTab ===
            'tavan' && (
            <div className="grid grid-cols-7 gap-2 py-4">
              {tavanSecenekleri.map(
                (item) => (
                  <MalzemeKutusu
                    key={
                      `tavan-${item.id}`
                    }
                    item={item}
                    contain
                    secili={
                      tavanDoku ===
                      item.path
                    }
                    onClick={() =>
                      setTavanDoku(
                        item.path
                      )
                    }
                  />
                )
              )}
            </div>
          )}

          {/* PASLANMAZ */}

          <MenuBaslik activeTab={activeTab} setActiveTab={setActiveTab}
            id="paslanmaz"
            baslik="Yan Duvar Paslanmazlar"
          />

          {activeTab ===
            'paslanmaz' && (
            <div className="grid grid-cols-7 gap-2 py-4">
              {paslanmazSecenekleri.map(
                (item) => (
                  <MalzemeKutusu
                    key={
                      `paslanmaz-${item.id}`
                    }
                    item={item}
                    secili={
                      duvarDoku ===
                      item.path
                    }
                    onClick={() =>
                      setDuvarDoku(
                        item.path
                      )
                    }
                  />
                )
              )}
            </div>
          )}

          {/* LAMİNANT */}

          <MenuBaslik activeTab={activeTab} setActiveTab={setActiveTab}
            id="laminant"
            baslik="Yan Duvar Laminantlar"
          />

          {activeTab ===
            'laminant' && (
            <div className="grid grid-cols-7 gap-2 py-4">
              {laminantSecenekleri.map(
                (item) => (
                  <MalzemeKutusu
                    key={
                      `laminant-${item.id}`
                    }
                    item={item}
                    secili={
                      duvarDoku ===
                      item.path
                    }
                    onClick={() =>
                      setDuvarDoku(
                        item.path
                      )
                    }
                  />
                )
              )}
            </div>
          )}

          {/* GRANİT */}

          <MenuBaslik activeTab={activeTab} setActiveTab={setActiveTab}
            id="granit"
            baslik="Taban Granitleri"
          />

          {activeTab ===
            'granit' && (
            <div className="grid grid-cols-7 gap-2 py-4">
              {granitSecenekleri.map(
                (item) => (
                  <MalzemeKutusu
                    key={
                      `granit-${item.id}`
                    }
                    item={item}
                    secili={
                      granitDoku ===
                      item.path
                    }
                    onClick={() =>
                      setGranitDoku(
                        item.path
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* ====================================================
            SAĞ / 3D ALAN
        ==================================================== */}

        <div className="lg:col-span-7 flex justify-center">

          <div className="relative w-full max-w-[680px] aspect-[4/5] lg:max-w-[min(680px,calc((100svh-140px)*0.8))] bg-[#e5e9eb] rounded-xl overflow-hidden shadow-2xl border border-slate-300">

            <Canvas
              camera={{
                position: [
                  0,
                  0.02,
                  5.25,
                ],
                fov: 34,
              }}
              dpr={[1.5, 2]}
              gl={{
                antialias: true,
              }}

              // Kontrollü ışık ve nötr pozlama.
              onCreated={({ gl }) => {
                gl.toneMapping =
                  THREE.ACESFilmicToneMapping;

                gl.toneMappingExposure =
                  1.0;

                gl.outputColorSpace =
                  THREE.SRGBColorSpace;
              }}
            >
              <color
                attach="background"
                args={[
                  '#e5e9eb',
                ]}
              />

              <hemisphereLight args={['#ffffff', '#d6dde2', 2.2]} />
              <directionalLight position={[2.5, 3, 4]} intensity={1.5} />
              <directionalLight position={[-3, 0.5, 3]} intensity={0.85} />
              <Suspense
                fallback={null}
              >
                
                  <KendiAsansorumuz
                    duvarDoku={
                      duvarDoku
                    }
                    tavanDoku={
                      tavanDoku
                    }
                    granitDoku={
                      granitDoku
                    }
                  />
                
              </Suspense>

              <OrbitControls
                enablePan={false}
                enableZoom
                enableDamping
                dampingFactor={0.06}

                minDistance={5.05}
                maxDistance={6.2}

                minAzimuthAngle={
                  -0.16
                }

                maxAzimuthAngle={
                  0.16
                }

                minPolarAngle={
                  Math.PI / 2 - 0.055
                }

                maxPolarAngle={
                  Math.PI / 2 + 0.055
                }

                target={[
                  0,
                  -0.03,
                  0,
                ]}
              />
            </Canvas>

            <div className="absolute bottom-4 left-0 w-full text-center text-slate-600 text-sm pointer-events-none">
              Döndürmek için fareyle sürükleyin
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}




