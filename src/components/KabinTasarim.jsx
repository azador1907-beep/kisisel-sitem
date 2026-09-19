import {
  useState,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useTransition,
  useDeferredValue,
  createContext,
  useContext,
} from 'react';

import * as THREE from 'three';

import {
  RectAreaLightUniformsLib,
} from 'three/addons/lights/RectAreaLightUniformsLib.js';

import './cabinMobile.css';

import {
  Canvas,
  useThree,
} from '@react-three/fiber';

import {
  OrbitControls,
  useTexture,
  Html,
} from '@react-three/drei';

import {
  Layers3,
  ScanLine,
  LampCeiling,
  Grid2X2,
  RotateCcw,
  Undo2,
  Redo2,
  MousePointer2,
  Check,
  ArrowRight,
  Link2,
  Unlink2,
  Expand,
  ChevronDown,
  ImageDown,
  FileDown,
  MessageCircle,
} from 'lucide-react';

import {
  WALLS,
  DEFAULT_MATERIAL,
  materialPath,
  createCabinConfig,
  changeWall,
  mirrorGeometry,
} from './cabinConfig';

import ekaMaterials from '../data/ekaMaterials.json';

import {
  company,
  whatsapp,
} from '../data/site';

import {
  CEILING_COLORS,
  ceilingColor,
  composeCeiling,
} from './ceilingDesign';


const ekaById =
  Object.fromEntries(
    ekaMaterials.map(
      item => [
        item.id,
        item,
      ],
    ),
  );


const MetalEnvironment =
  createContext(null);


RectAreaLightUniformsLib.init();


const W = 1.72;
const H = 2.38;
const D = 1.78;


const steel = {
  color: '#aab6bc',
  metalness: 0.48,
  roughness: 0.34,
  envMapIntensity: 0,
};


const steelNames = [
  'Fırçalı Gümüş',
  'Fırçalı Altın',
  'Parlak Gümüş',
  'Parlak Altın',
  'Okyanus Mavisi',
  'Buz Mavisi',
  'Siyah İnoks',
  'Oval Gümüş',
  'Oval Altın',
  'Kare Gümüş',
  'Kare Altın',
  'Benekli Gümüş',
  'Benekli Altın',
  'Yaprak Gümüş',
  'Yaprak Altın',
  'Arabesk Gümüş',
  'Arabesk Altın',
  'Çizgili Gümüş',
  'Çizgili Altın',
  'Örgü Gümüş',
  'Örgü Altın',
  'Dama Gümüş',
  'Dama Altın',
  'Altıgen Gümüş',
  'Altıgen Altın',
  'Kabartma Gümüş',
  'Kabartma Altın',
];


const stoneColors = [
  '#687780',
  '#a6ac85',
  '#3f595b',
  '#44474a',
  '#847065',
  '#ffffff',
  '#e6e5dc',
  '#e3d7c1',
  '#e8d8bd',
  '#b18a54',
  '#a54f4b',
  '#b07d66',
  '#e9c590',
  '#dcc7a5',
  '#d1987d',
  '#526caa',
  '#809db4',
  '#51565d',
  '#a7a7a1',
  '#c9d0c0',
  '#bdb4a4',
  '#497264',
  '#353535',
  '#484f5a',
  '#656270',
];


const woodColors = [
  '#f4d8a8',
  '#e9c99f',
  '#e4ba87',
  '#d9bd9c',
  '#f8eee0',
  '#d5b280',
  '#ffffff',
  '#d5c4b4',
  '#c79e78',
  '#b88d67',
  '#d2b08b',
  '#aeb1b1',
  '#e1e0dc',
  '#b8bab7',
  '#9c9d9a',
  '#8d7c74',
  '#c2a691',
  '#f1d5bd',
  '#d9c7b4',
  '#ac9179',
  '#b38870',
  '#a79a84',
  '#ccc4b8',
  '#a4b2af',
  '#968d9c',
  '#d1ad88',
  '#939a9c',
];


function materialSource(path) {
  if (ekaById[path]) {
    return ekaById[path];
  }

  const [
    ,
    type,
    number,
  ] =
    path.match(
      /(paslanmaz|laminant|tavan|granit)-(\d+)\.png$/,
    ) || [];

  const id =
    Number(number);

  const root =
    '/kabin-materyalleri/hd/';

  if (type === 'paslanmaz') {
    return {
      url:
        `${root}paslanmaz-${id}.svg?v=3`,

      color:
        '#ffffff',

      name:
        steelNames[id - 1],
    };
  }

  if (type === 'tavan') {
    return {
      url:
        `${root}${type}-${id}.svg`,

      color:
        '#ffffff',

      name:
        id >= 24
          ? `T-${String(
              [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                21,
                22,
                23,
                24,
              ][id - 24],
            ).padStart(
              2,
              '0',
            )}`
          : `Tavan ${id}`,
    };
  }

  if (type === 'granit') {
    if (id >= 26) {
      return {
        url:
          `${root}granit-${id}.png`,

        color:
          '#ffffff',
      };
    }

    return {
      url:
        root +
        (
          [
            2,
            5,
            18,
            19,
            21,
            25,
          ].includes(id)
            ? 'gneiss.png'
            : 'granite.png'
        ),

      color:
        stoneColors[id - 1],
    };
  }

  if (type === 'laminant') {
    return {
      url:
        root +
        (
          [
            3,
            7,
            9,
            10,
            11,
            16,
            20,
            21,
            26,
          ].includes(id)
            ? 'walnut.png'
            : 'oak.png'
        ),

      color:
        woodColors[id - 1],
    };
  }

  return {
    url: path,
    color: '#ffffff',
  };
}


function useSurfaceTexture(
  source,
  width,
  height,
  tiled = false,
  dataMap = false,
  repeatX = 1,
  repeatY = 1,
) {
  const gl =
    useThree(
      state =>
        state.gl,
    );

  const texture =
    useMemo(
      () => {
        const copy =
          source.clone();

        copy.colorSpace =
          dataMap
            ? THREE.NoColorSpace
            : THREE.SRGBColorSpace;

        copy.anisotropy =
          gl.capabilities.getMaxAnisotropy();

        copy.minFilter =
          THREE.LinearMipmapLinearFilter;

        copy.magFilter =
          THREE.LinearFilter;

        copy.generateMipmaps =
          true;

        copy.wrapS =
          copy.wrapT =
            tiled
              ? THREE.MirroredRepeatWrapping
              : THREE.ClampToEdgeWrapping;

        if (tiled) {
          const aspect =
            source.image.width /
            source.image.height;

          const tileHeight =
            1.18;

          copy.repeat.set(
            width /
              (
                tileHeight *
                aspect
              ),

            height /
              tileHeight,
          );
        } else {
          copy.repeat.set(
            1,
            1,
          );
        }

        copy.repeat.x *=
          repeatX;

        copy.repeat.y *=
          repeatY;

        copy.needsUpdate =
          true;

        return copy;
      },

      [
        source,
        width,
        height,
        tiled,
        gl,
        dataMap,
        repeatX,
        repeatY,
      ],
    );

  useEffect(
    () =>
      () =>
        texture.dispose(),

    [
      texture,
    ],
  );

  return texture;
}


function SurfaceReflection({
  texture,
  ceiling,
  y,
  height,
  width,
  tint = '#ffffff',
}) {
  const uniforms =
    useMemo(
      () => ({
        surfaceMap: {
          value:
            texture,
        },

        surfaceY: {
          value:
            ceiling
              ? H / 2
              : -H / 2,
        },

        ceiling: {
          value:
            ceiling
              ? 1
              : 0,
        },

        cabinSize: {
          value:
            new THREE.Vector2(
              W,
              D,
            ),
        },

        surfaceTint: {
          value:
            new THREE.Color(
              tint,
            ),
        },

        reflectionScale: {
          value:
            height /
            0.29,
        },

        edgeY: {
          value:
            ceiling
              ? y +
                height /
                  2
              : y -
                height /
                  2,
        },
      }),

      [
        texture,
        ceiling,
        tint,
        height,
        y,
      ],
    );

  return (
    <mesh
      position={[
        0,
        y,
        -D / 2 +
          0.014,
      ]}
    >
      <planeGeometry
        args={[
          width,
          height,
        ]}
      />

      <shaderMaterial
        uniforms={
          uniforms
        }
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

            samplePoint.y =
              surfaceY +
              (worldPoint.y - edgeY) /
              reflectionScale;

            vec3 ray =
              samplePoint -
              cameraPosition;

            float safeY =
              abs(ray.y) < 0.0001
                ? 0.0001
                : ray.y;

            float t =
              (surfaceY -
                samplePoint.y) /
              safeY;

            vec3 hit =
              samplePoint +
              ray * t;

            float sourceZ =
              -cabinSize.y -
              hit.z;

            vec2 uv =
              vec2(
                hit.x /
                  cabinSize.x +
                  0.5,

                sourceZ /
                  cabinSize.y +
                  0.5
              );

            if (ceiling < 0.5) {
              uv.y =
                1.0 -
                uv.y;
            }

            float edge =
              min(
                min(
                  uv.x,
                  1.0 - uv.x
                ),

                min(
                  uv.y,
                  1.0 - uv.y
                )
              );

            float valid =
              smoothstep(
                -0.025,
                0.015,
                edge
              ) *
              step(
                0.0,
                t
              );

            vec3 neutral =
              vec3(
                0.43,
                0.49,
                0.51
              );

            vec3 reflected =
              texture2D(
                surfaceMap,
                clamp(
                  uv,
                  0.0,
                  1.0
                )
              ).rgb *
              surfaceTint;

            vec3 tint =
              mix(
                reflected *
                  0.83,
                neutral,
                0.08
              );

            gl_FragColor =
              vec4(
                mix(
                  neutral,
                  tint,
                  valid
                ),
                1.0
              );

            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `}
      />
    </mesh>
  );
}


function MetalBox({
  position,
  size,
  color,
}) {
  const environment =
    useContext(
      MetalEnvironment,
    );

  return (
    <mesh
      position={
        position
      }
    >
      <boxGeometry
        args={size}
      />

      <meshStandardMaterial
        {...steel}
        color={
          color ||
          steel.color
        }
        envMap={
          environment
        }
        envMapIntensity={
          0.25
        }
      />
    </mesh>
  );
}


function CabinEnvironment({
  children,
}) {
  const gl =
    useThree(
      state =>
        state.gl,
    );

  const environment =
    useMemo(
      () => {
        const room =
          new THREE.Scene();

        room.background =
          new THREE.Color(
            '#52565a',
          );

        const addSurface = (
          width,
          height,
          position,
          rotation,
          color,
          intensity = 1,
        ) => {
          const mesh =
            new THREE.Mesh(
              new THREE.PlaneGeometry(
                width,
                height,
              ),

              new THREE.MeshBasicMaterial({
                color:
                  new THREE.Color(
                    color,
                  ).multiplyScalar(
                    intensity,
                  ),

                side:
                  THREE.DoubleSide,
              }),
            );

          mesh.position.set(
            ...position,
          );

          mesh.rotation.set(
            ...rotation,
          );

          room.add(
            mesh,
          );
        };

        addSurface(
          W,
          H,
          [
            0,
            0,
            -D / 2,
          ],
          [
            0,
            0,
            0,
          ],
          '#8e9294',
        );

        for (
          const side of [
            -1,
            1,
          ]
        ) {
          addSurface(
            D,
            H,
            [
              side *
                W /
                2,
              0,
              0,
            ],
            [
              0,
              Math.PI /
                2,
              0,
            ],
            '#85898b',
          );

          addSurface(
            0.035,
            D * 0.9,
            [
              side *
                W *
                0.31,
              H / 2 -
                0.005,
              0,
            ],
            [
              Math.PI /
                2,
              0,
              0,
            ],
            '#fff1da',
            5,
          );
        }

        addSurface(
          W,
          D,
          [
            0,
            -H / 2,
            0,
          ],
          [
            Math.PI /
              2,
            0,
            0,
          ],
          '#343435',
        );

        addSurface(
          W,
          D,
          [
            0,
            H / 2 +
              0.01,
            0,
          ],
          [
            Math.PI /
              2,
            0,
            0,
          ],
          '#a3a09a',
        );

        addSurface(
          W * 0.55,
          D * 0.5,
          [
            0,
            H / 2,
            0,
          ],
          [
            Math.PI /
              2,
            0,
            0,
          ],
          '#fff4e4',
          2,
        );

        addSurface(
          W * 3,
          H * 3,
          [
            0,
            0,
            D * 2,
          ],
          [
            0,
            0,
            0,
          ],
          '#999c9e',
        );

        const generator =
          new THREE.PMREMGenerator(
            gl,
          );

        const target =
          generator.fromScene(
            room,
            0.04,
          );

        room.traverse(
          object => {
            object.geometry
              ?.dispose();

            object.material
              ?.dispose();
          },
        );

        generator.dispose();

        return target;
      },

      [
        gl,
      ],
    );

  useEffect(
    () =>
      () =>
        environment.dispose(),

    [
      environment,
    ],
  );

  return (
    <MetalEnvironment.Provider
      value={
        environment.texture
      }
    >
      {children}
    </MetalEnvironment.Provider>
  );
}


function EkaSteelMaterial({
  choice,
  map,
  width,
  muted = false,
}) {
  const environment =
    useContext(
      MetalEnvironment,
    );

  const [
    normalSource,
    roughnessSource,
  ] =
    useTexture([
      choice.normalMap,

      choice.roughnessMap ||
        choice.url,
    ]);

  const normal =
    useSurfaceTexture(
      normalSource,
      width,
      H,
      true,
      true,
      ...(
        choice.normalRepeat ||
        [
          1,
          1,
        ]
      ),
    );

  const roughness =
    useSurfaceTexture(
      roughnessSource,
      width,
      H,
      true,
      true,
      ...(
        choice.roughnessRepeat ||
        [
          1,
          1,
        ]
      ),
    );

  /*
    Arka duvardaki metal yüzeyi
    yan duvarlara göre biraz daha koyu yapıyoruz.
  */
  const mutedColor =
    useMemo(
      () => {
        const base =
          new THREE.Color(
            choice.color ||
              '#a3a3a3',
          );

        if (muted) {
          base.multiplyScalar(
            0.78,
          );
        }

        return base;
      },

      [
        choice.color,
        muted,
      ],
    );

  return (
    <meshStandardMaterial
      map={map}
      color={
        mutedColor
      }
      normalMap={
        normal
      }
      normalScale={[
        choice.normalStrength *
          (
            muted
              ? 0.72
              : 1
          ),

        choice.normalStrength *
          (
            muted
              ? 0.72
              : 1
          ),
      ]}
      roughnessMap={
        choice.roughnessMap
          ? roughness
          : null
      }
      envMap={
        environment
      }
      roughness={
        muted
          ? Math.max(
              0.68,
              choice.roughness,
            )
          : Math.max(
              0.4,
              choice.roughness,
            )
      }
      metalness={
        muted
          ? Math.min(
              0.48,
              choice.metalness,
            )
          : Math.min(
              0.6,
              choice.metalness,
            )
      }
      envMapIntensity={
        muted
          ? 0.14
          : 0.3
      }
      side={
        THREE.DoubleSide
      }
    />
  );
}


function BrushedSteelMaterial({
  path,
  muted = false,
}) {
  const environment =
    useContext(
      MetalEnvironment,
    );

  const brushing =
    useMemo(
      () => {
        const canvas =
          document.createElement(
            'canvas',
          );

        canvas.width =
          512;

        canvas.height =
          512;

        const context =
          canvas.getContext(
            '2d',
          );

        context.fillStyle =
          '#8080ff';

        context.fillRect(
          0,
          0,
          512,
          512,
        );

        for (
          let x = 0;
          x < 512;
          x += 1
        ) {
          const value =
            128 +
            Math.round(
              12 *
                Math.sin(
                  x *
                    13.37,
                ),
            );

          context.fillStyle =
            `rgb(${value},128,255)`;

          context.fillRect(
            x,
            0,
            1,
            512,
          );
        }

        const texture =
          new THREE.CanvasTexture(
            canvas,
          );

        texture.wrapS =
          texture.wrapT =
            THREE.RepeatWrapping;

        texture.repeat.set(
          3,
          1,
        );

        return texture;
      },

      [],
    );

  useEffect(
    () =>
      () =>
        brushing.dispose(),

    [
      brushing,
    ],
  );

  const baseColor =
    path.includes(
      'paslanmaz-5.',
    )
      ? '#326780'
      : path.includes(
          'paslanmaz-6.',
        )
        ? '#7196ab'
        : '#a2aaae';

  const color =
    useMemo(
      () => {
        const value =
          new THREE.Color(
            baseColor,
          );

        if (muted) {
          value.multiplyScalar(
            0.78,
          );
        }

        return value;
      },

      [
        baseColor,
        muted,
      ],
    );

  return (
    <meshPhysicalMaterial
      color={color}
      metalness={
        muted
          ? 0.45
          : 0.58
      }
      roughness={
        muted
          ? 0.58
          : 0.36
      }
      envMap={
        environment
      }
      envMapIntensity={
        muted
          ? 0.28
          : 1.15
      }
      normalMap={
        brushing
      }
      normalScale={[
        muted
          ? 0.14
          : 0.24,

        muted
          ? 0.14
          : 0.24,
      ]}
      anisotropy={
        muted
          ? 0.34
          : 0.55
      }
      anisotropyRotation={
        Math.PI /
        2
      }
      side={
        THREE.DoubleSide
      }
    />
  );
}


function WallPanel({
  path,
  width,
  x,
  selected,
  onSelect,
  muted = false,
}) {
  const choice =
    materialSource(
      path,
    );

  const source =
    useTexture(
      choice.url,
    );

  const map =
    useSurfaceTexture(
      source,
      width,
      H,
      true,
    );

  const laminate =
    path.includes(
      'laminant',
    );

  return (
    <group
      position={[
        x,
        0,
        0,
      ]}
    >
      <mesh
        onClick={
          event => {
            event.stopPropagation();

            if (
              event.delta <
              5
            ) {
              onSelect();
            }
          }
        }
      >
        <planeGeometry
          args={[
            width,
            H,
          ]}
        />

        {
          choice.normalMap
            ? (
              <EkaSteelMaterial
                choice={
                  choice
                }
                map={map}
                width={
                  width
                }
                muted={
                  muted
                }
              />
            )
            : !laminate
              ? (
                <BrushedSteelMaterial
                  path={
                    path
                  }
                  muted={
                    muted
                  }
                />
              )
              : (
                <meshStandardMaterial
                  map={map}
                  color={
                    choice.color
                  }
                  metalness={
                    0
                  }
                  roughness={
                    0.72
                  }
                  envMapIntensity={
                    0
                  }
                  side={
                    THREE.DoubleSide
                  }
                />
              )
        }
      </mesh>

      <mesh
        position={[
          width /
            2 -
            0.0015,
          0,
          0.002,
        ]}
      >
        <planeGeometry
          args={[
            0.003,
            H,
          ]}
        />

        <meshBasicMaterial
          color="#42484b"
        />
      </mesh>

      {
        selected && (
          <group
            userData={{
              exportHidden:
                true,
            }}
          >
            {
              [
                -1,
                1,
              ].map(
                side => (
                  <mesh
                    key={
                      side
                    }
                    position={[
                      side *
                        (
                          width /
                            2 -
                          0.009
                        ),

                      0,

                      0.017,
                    ]}
                  >
                    <planeGeometry
                      args={[
                        0.009,
                        H -
                          0.025,
                      ]}
                    />

                    <meshBasicMaterial
                      color="#ef784d"
                      depthWrite={
                        false
                      }
                    />
                  </mesh>
                ),
              )
            }

            {
              [
                -1,
                1,
              ].map(
                side => (
                  <mesh
                    key={
                      side
                    }
                    position={[
                      0,

                      side *
                        (
                          H /
                            2 -
                          0.012
                        ),

                      0.017,
                    ]}
                  >
                    <planeGeometry
                      args={[
                        width -
                          0.018,

                        0.009,
                      ]}
                    />

                    <meshBasicMaterial
                      color="#ef784d"
                      depthWrite={
                        false
                      }
                    />
                  </mesh>
                ),
              )
            }
          </group>
        )
      }
    </group>
  );
}


/*
  İşaretlediğin ve kaldırılacak paslanmazlar.
  Numara sırası korunuyor.
*/
const HIDDEN_STAINLESS_MATERIALS =
  new Set([
    'eka-paslanmaz-sat_paslanmaz_3',
    'eka-paslanmaz-gold_sat_paslanmaz_2',
    'eka-paslanmaz-gold_sat_paslanmaz_3',
    'eka-paslanmaz-bronze_sat_paslanmaz_2',
    'eka-paslanmaz-bronze_sat_paslanmaz_3',
    'eka-paslanmaz-champ_sat_paslanmaz_1',
    'eka-paslanmaz-champ_sat_paslanmaz_2',
    'eka-paslanmaz-black_sat_paslanmaz_3',

    '/kabin-materyalleri/paslanmaz-1.png',
    '/kabin-materyalleri/paslanmaz-5.png',
    '/kabin-materyalleri/paslanmaz-6.png',
  ]);


const CABIN_FONT_OPTIONS = [
  {
    id:
      'modern',

    name:
      'Modern',

    family:
      'Arial, Helvetica, sans-serif',
  },

  {
    id:
      'soft',

    name:
      'Yumuşak',

    family:
      '"Trebuchet MS", Arial, sans-serif',
  },

  {
    id:
      'classic',

    name:
      'Klasik',

    family:
      'Georgia, "Times New Roman", serif',
  },

  {
    id:
      'mono',

    name:
      'Teknik',

    family:
      '"Courier New", Courier, monospace',
  },

  {
    id:
      'bold',

    name:
      'Güçlü',

    family:
      'Impact, "Arial Black", Arial, sans-serif',
  },

  {
    id:
      'narrow',

    name:
      'Dar',

    family:
      '"Arial Narrow", Arial, Helvetica, sans-serif',
  },
];


const cabinFont =
  id =>
    CABIN_FONT_OPTIONS.find(
      item =>
        item.id === id,
    ) ||
    CABIN_FONT_OPTIONS[0];


function CabinLabel({
  text,
  fontKey = 'modern',
}) {
  const label =
    String(
      text ?? '',
    )
      .trim()
      .toLocaleUpperCase(
        'tr-TR',
      )
      .slice(
        0,
        18,
      );

  const font =
    cabinFont(
      fontKey,
    );

  const texture =
    useMemo(
      () => {
        const canvas =
          document.createElement(
            'canvas',
          );

        canvas.width =
          1024;

        canvas.height =
          256;

        const context =
          canvas.getContext(
            '2d',
          );

        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        context.textAlign =
          'center';

        context.textBaseline =
          'middle';

        context.lineJoin =
          'round';

        let fontSize =
          142;

        context.font =
          `700 ${fontSize}px ${font.family}`;

        while (
          context.measureText(
            label,
          ).width >
            900 &&
          fontSize >
            62
        ) {
          fontSize -=
            4;

          context.font =
            `700 ${fontSize}px ${font.family}`;
        }

        context.shadowColor =
          'rgba(0, 0, 0, 0.38)';

        context.shadowBlur =
          12;

        context.shadowOffsetY =
          6;

        context.strokeStyle =
          'rgba(37, 46, 52, 0.72)';

        context.lineWidth =
          9;

        context.strokeText(
          label,
          canvas.width /
            2,
          canvas.height /
            2 +
            4,
        );

        context.shadowColor =
          'transparent';

        const gradient =
          context.createLinearGradient(
            0,
            48,
            0,
            208,
          );

        gradient.addColorStop(
          0,
          '#f8fbfc',
        );

        gradient.addColorStop(
          0.35,
          '#bcc6cb',
        );

        gradient.addColorStop(
          0.62,
          '#6f7a80',
        );

        gradient.addColorStop(
          1,
          '#dce3e6',
        );

        context.fillStyle =
          gradient;

        context.fillText(
          label,
          canvas.width /
            2,
          canvas.height /
            2 +
            4,
        );

        const result =
          new THREE.CanvasTexture(
            canvas,
          );

        result.colorSpace =
          THREE.SRGBColorSpace;

        result.minFilter =
          THREE.LinearFilter;

        result.magFilter =
          THREE.LinearFilter;

        result.generateMipmaps =
          false;

        result.needsUpdate =
          true;

        return result;
      },

      [
        label,
        font.family,
      ],
    );

  useEffect(
    () =>
      () =>
        texture.dispose(),

    [
      texture,
    ],
  );

  if (!label) {
    return null;
  }

  return (
    <mesh
      position={[
        0,
        -H / 2 +
          0.17,
        -D / 2 +
          0.028,
      ]}
      raycast={() =>
        null
      }
    >
      <planeGeometry
        args={[
          0.64,
          0.16,
        ]}
      />

      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={
          0.02
        }
        depthWrite={
          false
        }
        toneMapped={
          false
        }
        side={
          THREE.DoubleSide
        }
      />
    </mesh>
  );
}


function WallShadow({
  length,
  height = H,
}) {
  const map =
    useMemo(
      () => {
        const canvas =
          document.createElement(
            'canvas',
          );

        canvas.width =
          canvas.height =
            256;

        const context =
          canvas.getContext(
            '2d',
          );

        for (
          const horizontal of [
            true,
            false,
          ]
        ) {
          const gradient =
            context.createLinearGradient(
              0,
              0,

              horizontal
                ? 256
                : 0,

              horizontal
                ? 0
                : 256,
            );

          gradient.addColorStop(
            0,
            'rgba(17,26,34,.22)',
          );

          gradient.addColorStop(
            0.035,
            'rgba(17,26,34,0)',
          );

          gradient.addColorStop(
            0.965,
            'rgba(17,26,34,0)',
          );

          gradient.addColorStop(
            1,
            'rgba(17,26,34,.22)',
          );

          context.fillStyle =
            gradient;

          context.fillRect(
            0,
            0,
            256,
            256,
          );
        }

        const texture =
          new THREE.CanvasTexture(
            canvas,
          );

        texture.colorSpace =
          THREE.SRGBColorSpace;

        return texture;
      },

      [],
    );

  useEffect(
    () =>
      () =>
        map.dispose(),

    [
      map,
    ],
  );

  return (
    <mesh
      position={[
        0,
        0,
        0.003,
      ]}
      raycast={() =>
        null
      }
    >
      <planeGeometry
        args={[
          length,
          height,
        ]}
      />

      <meshBasicMaterial
        map={map}
        transparent
        depthWrite={
          false
        }
      />
    </mesh>
  );
}


function PanelWall({
  wall,
  config,
  length,
  position,
  rotation = [
    0,
    0,
    0,
  ],
  selection,
  onSelect,
  reverse = false,
  editing,
}) {
  return (
    <group
      position={
        position
      }
      rotation={
        rotation
      }
    >
      <WallShadow
        length={
          length
        }
      />

      {
        config.widths.map(
          (
            ratio,
            index,
          ) => {
            const width =
              length *
              ratio /
              100;

            const preceding =
              config.widths
                .slice(
                  0,
                  index,
                )
                .reduce(
                  (
                    sum,
                    value,
                  ) =>
                    sum +
                    value,

                  0,
                );

            const center =
              -length /
                2 +
              length *
                preceding /
                100 +
              width /
                2;

            return (
              <WallPanel
                key={
                  index
                }
                path={
                  config.materials[
                    index
                  ]
                }
                width={
                  width
                }
                x={
                  reverse
                    ? -center
                    : center
                }
                selected={
                  editing &&
                  selection.wall ===
                    wall &&
                  selection.index ===
                    index
                }
                onSelect={() =>
                  onSelect({
                    wall,
                    index,
                  })
                }
                muted={
                  wall ===
                  'rearCenter'
                }
              />
            );
          },
        )
      }
    </group>
  );
}


function SceneCapture({
  config,
  captureRef,
}) {
  const {
    gl,
    scene,
    camera,
  } =
    useThree();

  useEffect(
    () => {
      const entry = {
        config,

        capture:
          () => {
            const size =
              gl.getSize(
                new THREE.Vector2(),
              );

            const ratio =
              gl.getPixelRatio();

            const aspect =
              camera.aspect;

            const hidden =
              [];

            scene.traverse(
              object => {
                if (
                  object.userData
                    .exportHidden &&
                  object.visible
                ) {
                  hidden.push(
                    object,
                  );

                  object.visible =
                    false;
                }
              },
            );

            try {
              gl.setPixelRatio(
                1,
              );

              gl.setSize(
                1800,
                2100,
                false,
              );

              camera.aspect =
                1800 /
                2100;

              camera.updateProjectionMatrix();

              gl.render(
                scene,
                camera,
              );

              return gl.domElement.toDataURL(
                'image/png',
              );
            } finally {
              hidden.forEach(
                object => {
                  object.visible =
                    true;
                },
              );

              camera.aspect =
                aspect;

              camera.updateProjectionMatrix();

              gl.setPixelRatio(
                ratio,
              );

              gl.setSize(
                size.x,
                size.y,
                false,
              );

              gl.render(
                scene,
                camera,
              );
            }
          },
      };

      captureRef.current =
        entry;

      return () => {
        if (
          captureRef.current ===
          entry
        ) {
          captureRef.current =
            null;
        }
      };
    },

    [
      gl,
      scene,
      camera,
      config,
      captureRef,
    ],
  );

  return null;
}


function KendiAsansorumuz({
  config:
    requestedConfig,
  selection,
  onSelect,
  editing,
  onMirrorSelect,
  onSurfaceSelect,
  captureRef,
}) {
  const environment =
    useContext(
      MetalEnvironment,
    );

  const config =
    useDeferredValue(
      requestedConfig,
    );

  const roofChoice =
    materialSource(
      config.ceiling,
    );

  const floorChoice =
    materialSource(
      config.floor,
    );

  const [
    roof,
    floor,
  ] =
    useTexture([
      roofChoice.url,
      floorChoice.url,
    ]);

  const roofMap =
    useMemo(
      () => {
        const texture =
          new THREE.CanvasTexture(
            composeCeiling(
              roof.image,
              config.ceilingColor,
              config.ceilingSideColor,
            ),
          );

        texture.colorSpace =
          THREE.SRGBColorSpace;

        texture.anisotropy =
          8;

        return texture;
      },

      [
        roof,
        config.ceilingColor,
        config.ceilingSideColor,
      ],
    );

  useEffect(
    () =>
      () =>
        roofMap.dispose(),

    [
      roofMap,
    ],
  );

  const floorMap =
    useSurfaceTexture(
      floor,
      W,
      D,
    );

  const mirror =
    mirrorGeometry(
      config,
    );

  const panelW =
    mirror.width;

  const topH =
    mirror.topReflection;

  const bottomH =
    mirror.bottomReflection;

  const panelTop =
    mirror.top -
    topH;

  const panelBottom =
    mirror.bottom +
    bottomH;

  return (
    <group>
      <SceneCapture
        config={
          config
        }
        captureRef={
          captureRef
        }
      />

      <mesh
        rotation={[
          -Math.PI /
            2,
          0,
          0,
        ]}
        position={[
          0,
          -H / 2,
          0,
        ]}
        onClick={
          event => {
            event.stopPropagation();

            if (
              event.delta <
              5
            ) {
              onSurfaceSelect(
                'floor',
              );
            }
          }
        }
      >
        <planeGeometry
          args={[
            W,
            D,
          ]}
        />

        <meshPhysicalMaterial
          map={
            floorMap
          }
          color={
            floorChoice.color
          }
          roughness={
            0.3
          }
          metalness={
            0
          }
          clearcoat={
            0.35
          }
          clearcoatRoughness={
            0.24
          }
          envMap={
            environment
          }
          envMapIntensity={
            0.4
          }
          side={
            THREE.DoubleSide
          }
        />
      </mesh>

      <group
        rotation={[
          -Math.PI /
            2,
          0,
          0,
        ]}
        position={[
          0,
          -H /
            2 +
            0.002,
          0,
        ]}
      >
        <WallShadow
          length={W}
          height={D}
        />
      </group>

      <mesh
        rotation={[
          Math.PI /
            2,
          0,
          0,
        ]}
        position={[
          0,
          H / 2,
          0,
        ]}
        onClick={
          event => {
            event.stopPropagation();

            if (
              event.delta <
              5
            ) {
              onSurfaceSelect(
                'ceiling',
              );
            }
          }
        }
      >
        <planeGeometry
          args={[
            W,
            D,
          ]}
        />

        <meshBasicMaterial
          map={
            roofMap
          }
          color="#ffffff"
          side={
            THREE.DoubleSide
          }
        />
      </mesh>

      {
        [
          -1,
          1,
        ].map(
          side => {
            const wall =
              side === -1
                ? 'left'
                : 'right';

            return (
              <group
                key={
                  side
                }
              >
                <PanelWall
                  wall={
                    wall
                  }
                  config={
                    config.walls[
                      wall
                    ]
                  }
                  length={D}
                  position={[
                    side *
                      W /
                      2,
                    0,
                    0,
                  ]}
                  rotation={[
                    0,
                    -side *
                      Math.PI /
                      2,
                    0,
                  ]}
                  reverse={
                    side ===
                    1
                  }
                  selection={
                    selection
                  }
                  onSelect={
                    onSelect
                  }
                  editing={
                    editing
                  }
                />

                <MetalBox
                  position={[
                    side *
                      (
                        W /
                          2 -
                        0.009
                      ),

                    -H /
                      2 +
                      0.035,

                    0,
                  ]}
                  size={[
                    0.014,
                    0.07,
                    D,
                  ]}
                  color={
                    ceilingColor(
                      config.floorTrimColor,
                    ).color
                  }
                />

                <MetalBox
                  position={[
                    side *
                      (
                        W /
                          2 +
                        0.015
                      ),

                    0,

                    D / 2,
                  ]}
                  size={[
                    0.03,
                    H +
                      0.06,
                    0.035,
                  ]}
                />
              </group>
            );
          },
        )
      }

      <PanelWall
        wall="rearCenter"
        config={
          config.walls
            .rearCenter
        }
        length={W}
        position={[
          0,
          0,
          -D / 2,
        ]}
        selection={
          selection
        }
        onSelect={
          onSelect
        }
        editing={
          editing
        }
      />


      <CabinLabel
        text={
          config.cabinText ??
          ''
        }
        fontKey={
          config.cabinTextFont ||
          'modern'
        }
      />


      {
        config.mirrorMode !==
          'none' && (
          <group
            position={[
              mirror.x,
              0,
              0,
            ]}
            onClick={
              event => {
                event.stopPropagation();

                if (
                  event.delta <
                  5
                ) {
                  onMirrorSelect();
                }
              }
            }
          >
            {
              topH >
                0 && (
                <SurfaceReflection
                  texture={
                    roofMap
                  }
                  ceiling
                  y={
                    mirror.top -
                    topH /
                      2
                  }
                  height={
                    topH
                  }
                  width={
                    panelW
                  }
                />
              )
            }

            <mesh
              position={[
                0,

                (
                  panelTop +
                  panelBottom
                ) /
                  2,

                -D /
                  2 +
                  0.014,
              ]}
            >
              <planeGeometry
                args={[
                  panelW,

                  panelTop -
                    panelBottom,
                ]}
              />

              <meshBasicMaterial
                color="#b9cbd1"
              />
            </mesh>

            {
              bottomH >
                0 && (
                <SurfaceReflection
                  texture={
                    floorMap
                  }
                  tint={
                    floorChoice.color
                  }
                  ceiling={
                    false
                  }
                  y={
                    mirror.bottom +
                    bottomH /
                      2
                  }
                  height={
                    bottomH
                  }
                  width={
                    panelW
                  }
                />
              )
            }

            {
              [
                -1,
                1,
              ].map(
                side => (
                  <MetalBox
                    key={
                      side
                    }
                    position={[
                      side *
                        panelW /
                        2,

                      (
                        mirror.top +
                        mirror.bottom
                      ) /
                        2,

                      -D /
                        2 +
                        0.02,
                    ]}
                    size={[
                      0.006,
                      mirror.height,
                      0.012,
                    ]}
                  />
                ),
              )
            }

            {
              [
                mirror.top,
                mirror.bottom,
              ].map(
                y => (
                  <MetalBox
                    key={y}
                    position={[
                      0,
                      y,
                      -D /
                        2 +
                        0.021,
                    ]}
                    size={[
                      panelW,
                      0.009,
                      0.012,
                    ]}
                  />
                ),
              )
            }
          </group>
        )
      }


      <MetalBox
        position={[
          0,
          -H /
            2 +
            0.025,
          -D /
            2 +
            0.006,
        ]}
        size={[
          W,
          0.05,
          0.012,
        ]}
        color={
          ceilingColor(
            config.floorTrimColor,
          ).color
        }
      />


      <MetalBox
        position={[
          0,
          H /
            2 +
            0.015,
          D /
            2,
        ]}
        size={[
          W +
            0.06,
          0.03,
          0.035,
        ]}
      />


      <MetalBox
        position={[
          0,
          -H /
            2 -
            0.012,
          D /
            2,
        ]}
        size={[
          W +
            0.06,
          0.024,
          0.08,
        ]}
        color={
          ceilingColor(
            config.floorTrimColor,
          ).color
        }
      />


      <group
        position={[
          W /
            2 -
            0.019,
          0.08,
          D *
            0.32,
        ]}
        rotation={[
          0,
          -Math.PI /
            2,
          0,
        ]}
      >
        <MetalBox
          position={[
            0,
            0,
            0,
          ]}
          size={[
            0.18,
            1.85,
            0.012,
          ]}
        />

        <mesh
          position={[
            0,
            0.65,
            0.008,
          ]}
        >
          <planeGeometry
            args={[
              0.132,
              0.23,
            ]}
          />

          <meshBasicMaterial
            color="#111d26"
          />
        </mesh>

        {
          [
            [
              -0.015,
              0.71,
              0.041,
              0.006,
            ],

            [
              -0.015,
              0.68,
              0.041,
              0.006,
            ],

            [
              -0.015,
              0.65,
              0.041,
              0.006,
            ],

            [
              0.003,
              0.695,
              0.006,
              0.03,
            ],

            [
              0.003,
              0.665,
              0.006,
              0.03,
            ],

            [
              0.038,
              0.68,
              0.005,
              0.04,
            ],
          ].map(
            (
              [
                x,
                y,
                w,
                h,
              ],
              i,
            ) => (
              <mesh
                key={i}
                position={[
                  x,
                  y,
                  0.009,
                ]}
              >
                <planeGeometry
                  args={[
                    w,
                    h,
                  ]}
                />

                <meshBasicMaterial
                  color="#b8e8ff"
                  toneMapped={
                    false
                  }
                />
              </mesh>
            ),
          )
        }

        <mesh
          position={[
            0.038,
            0.707,
            0.009,
          ]}
        >
          <circleGeometry
            args={[
              0.014,
              3,
            ]}
          />

          <meshBasicMaterial
            color="#b8e8ff"
            toneMapped={
              false
            }
          />
        </mesh>

        {
          Array.from(
            {
              length:
                12,
            },

            (
              _,
              i,
            ) => (
              <group
                key={i}
                position={[
                  (
                    i %
                      2 -
                    0.5
                  ) *
                    0.069,

                  0.2 -
                    Math.floor(
                      i /
                        2,
                    ) *
                      0.075,

                  0.011,
                ]}
              >
                <mesh>
                  <ringGeometry
                    args={[
                      0.016,
                      0.02,
                      24,
                    ]}
                  />

                  <meshStandardMaterial
                    color={
                      i ===
                      2
                        ? '#94c8db'
                        : '#626d72'
                    }
                    roughness={
                      0.5
                    }
                  />
                </mesh>

                <mesh
                  position={[
                    0,
                    0,
                    0.001,
                  ]}
                >
                  <circleGeometry
                    args={[
                      0.015,
                      24,
                    ]}
                  />

                  <meshStandardMaterial
                    {...steel}
                  />
                </mesh>

                <mesh
                  position={[
                    0,
                    0,
                    0.002,
                  ]}
                >
                  <circleGeometry
                    args={[
                      0.002,
                      8,
                    ]}
                  />

                  <meshBasicMaterial
                    color="#45535b"
                  />
                </mesh>
              </group>
            ),
          )
        }

        <mesh
          position={[
            0,
            -0.67,
            0.007,
          ]}
        >
          <planeGeometry
            args={[
              0.125,
              0.28,
            ]}
          />

          <meshStandardMaterial
            color="#aeb9be"
            roughness={
              0.65
            }
          />
        </mesh>
      </group>
    </group>
  );
}


function CameraView({
  view,
}) {
  const controls =
    useRef();

  const {
    camera,
  } =
    useThree();

  useEffect(
    () => {
      const positions = {
        front: [
          0,
          0.02,
          5.25,
        ],

        left: [
          1.45,
          0.03,
          5.1,
        ],

        right: [
          -1.45,
          0.03,
          5.1,
        ],
      };

      camera.position.set(
        ...positions[
          view.name
        ],
      );

      controls.current
        ?.target.set(
          0,
          -0.03,
          0,
        );

      controls.current
        ?.update();
    },

    [
      camera,
      view,
    ],
  );

  return (
    <OrbitControls
      ref={
        controls
      }
      enablePan={
        false
      }
      enableDamping
      dampingFactor={
        0.08
      }
      minDistance={
        4.9
      }
      maxDistance={
        6.2
      }
      minAzimuthAngle={
        -0.34
      }
      maxAzimuthAngle={
        0.34
      }
      minPolarAngle={
        Math.PI /
          2 -
        0.07
      }
      maxPolarAngle={
        Math.PI /
          2 +
        0.07
      }
      target={[
        0,
        -0.03,
        0,
      ]}
    />
  );
}


const swatchStyle =
  path => {
    const source =
      materialSource(
        path,
      );

    return {
      backgroundImage:
        `url('${source.thumbnail || source.url}')`,

      backgroundColor:
        source.thumbnail
          ? '#ffffff'
          : source.color,

      backgroundBlendMode:
        'multiply',

      backgroundSize:
        'cover',

      backgroundPosition:
        'center',
    };
  };


const materialName =
  path =>
    materialSource(
      path,
    ).name ||
    path
      .split('/')
      .pop()
      .replace(
        '.png',
        '',
      )
      .replace(
        'laminant-',
        'Laminant ',
      )
      .replace(
        'granit-',
        'Granit ',
      )
      .replace(
        'tavan-',
        'Tavan ',
      );


const mirrorModeNames = {
  full:
    'Tam boy',

  half:
    'Yarım boy',

  custom:
    'Özel ölçü',
};


function createCabinOfferMessage(
  config,
) {
  const wallLines =
    Object.entries(
      WALLS,
    ).map(
      ([
        wallKey,
        wallName,
      ]) => {
        const wall =
          config.walls[
            wallKey
          ];

        const panels =
          wall.materials
            .map(
              (
                path,
                index,
              ) =>
                `Panel ${index + 1}: ${materialName(path)} (%${wall.widths[index]})`,
            )
            .join(
              ' · ',
            );

        return `${wallName}: ${panels}`;
      },
    );


  const mirror =
    mirrorGeometry(
      config,
    );

  const mirrorText =
    config.mirrorMode ===
    'none'
      ? 'Ayna yok'
      : `${mirrorModeNames[config.mirrorMode] || 'Ayna'} - ${Math.round(mirror.width * 100)} × ${Math.round(mirror.height * 100)} cm`;


  return [
    'Merhaba, Has Door Kabin Tasarla üzerinden oluşturduğum tasarım için teklif almak istiyorum.',
    '',
    'Kabin ölçüsü: 172 × 178 × 238 cm',
    '',
    ...wallLines,
    '',
    `Tavan: ${materialName(config.ceiling)}`,
    `Tavan rengi: ${ceilingColor(config.ceilingColor).name}`,
    `Zemin: ${materialName(config.floor)}`,
    `Tarak / eşik rengi: ${ceilingColor(config.floorTrimColor).name}`,
    `Ayna: ${mirrorText}`,
    `Kabin yazısı: ${String(config.cabinText ?? '').trim() || 'Yok'}`,
    `Yazı tipi: ${cabinFont(config.cabinTextFont).name}`,
    '',
    'Bu tasarım için fiyat ve bilgi alabilir miyim?',
  ].join(
    '\n',
  );
}


const categories = [
  {
    id:
      'walls',

    name:
      'Duvarlar',

    icon:
      Layers3,
  },

  {
    id:
      'mirror',

    name:
      'Ayna',

    icon:
      ScanLine,
  },

  {
    id:
      'ceiling',

    name:
      'Tavan',

    icon:
      LampCeiling,
  },

  {
    id:
      'floor',

    name:
      'Zemin',

    icon:
      Grid2X2,
  },
];


function RangeControl({
  label,
  value,
  min,
  max,
  suffix = '%',
  onChange,
  onFinish,
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm mb-3">
        <span className="text-slate-600">
          {label}
        </span>

        <strong className="font-semibold text-slate-900 tabular-nums">
          {value}
          {suffix}
        </strong>
      </span>

      <input
        className="w-full h-1.5 accent-[#e66b43] cursor-pointer"
        type="range"
        aria-label={
          label
        }
        min={min}
        max={max}
        step={1}
        value={
          value
        }
        onChange={
          event =>
            onChange(
              Number(
                event.target.value,
              ),
            )
        }
        onPointerUp={
          onFinish
        }
        onPointerCancel={
          onFinish
        }
        onKeyUp={
          onFinish
        }
        onBlur={
          onFinish
        }
      />

      <span className="flex justify-between text-[10px] mt-2 text-slate-400">
        <span>
          {min}
          {suffix}
        </span>

        <span>
          {max}
          {suffix}
        </span>
      </span>
    </label>
  );
}


function CeilingPreview({
  path,
  color,
  sideColor,
}) {
  const [
    preview,
    setPreview,
  ] =
    useState(
      null,
    );

  const source =
    materialSource(
      path,
    ).url;

  useEffect(
    () => {
      let active =
        true;

      const image =
        new Image();

      image.onload =
        () => {
          if (
            active
          ) {
            setPreview(
              composeCeiling(
                image,
                color,
                sideColor,
              ).toDataURL(),
            );
          }
        };

      image.src =
        source;

      return () => {
        active =
          false;
      };
    },

    [
      source,
      color,
      sideColor,
    ],
  );

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
      {
        preview && (
          <img
            src={
              preview
            }
            alt="Üç bölümlü tavan: sabit yanlar, seçili orta desen"
            className="w-full aspect-square object-contain"
          />
        )
      }
    </div>
  );
}


function MaterialGrid({
  type,
  count,
  selected,
  onSelect,
}) {
  const rawEntries = [
    ...ekaMaterials
      .filter(
        item =>
          item.type ===
          type,
      )
      .map(
        item =>
          item.id,
      ),

    ...Array.from(
      {
        length:
          count,
      },
      (
        _,
        i,
      ) =>
        i +
        1,
    )
      .filter(
        id =>
          type ===
          'paslanmaz'
            ? [
                1,
                5,
                6,
              ].includes(
                id,
              )
            : type !==
                'tavan' ||
              (
                (
                  id <=
                    8 ||
                  id >=
                    24
                ) &&
                id !==
                  35
              ),
      )
      .map(
        id =>
          materialPath(
            type,
            id,
          ),
      ),
  ];


  const entries =
    rawEntries
      .map(
        (
          path,
          index,
        ) => ({
          path,

          originalNumber:
            index +
            1,
        }),
      )
      .filter(
        ({
          path,
        }) =>
          type !==
            'paslanmaz' ||
          !HIDDEN_STAINLESS_MATERIALS.has(
            path,
          ),
      );


  return (
    <>
      <div className="cabin-material-grid grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-6 gap-2">
        {
          entries.map(
            ({
              path,
              originalNumber,
            }) => (
              <button
                key={
                  path
                }
                type="button"
                title={
                  materialName(
                    path,
                  )
                }
                aria-label={
                  materialName(
                    path,
                  )
                }
                aria-pressed={
                  selected ===
                  path
                }
                onClick={() =>
                  onSelect(
                    path,
                  )
                }
                className={`relative aspect-square rounded-md border transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-orange-500 ${
                  selected ===
                  path
                    ? 'border-[#e66b43] ring-2 ring-orange-200'
                    : 'border-slate-200'
                }`}
                style={
                  swatchStyle(
                    path,
                  )
                }
              >
                <span className="absolute bottom-1 left-1 text-[9px] bg-black/40 text-white rounded px-1 leading-4">
                  {
                    String(
                      originalNumber,
                    ).padStart(
                      2,
                      '0',
                    )
                  }
                </span>

                {
                  selected ===
                    path && (
                    <span className="absolute top-1 right-1 bg-[#e66b43] text-white p-0.5 rounded-full">
                      <Check
                        size={
                          10
                        }
                      />
                    </span>
                  )
                }
              </button>
            ),
          )
        }
      </div>

      <p className="mt-2 text-[10px] text-slate-400">
        {
          entries.length
        }{' '}
        seçenek ·
        Malzeme adını
        görmek için
        üzerine gel.
      </p>
    </>
  );
}


export default function KabinTasarim() {
  const [
    history,
    setHistory,
  ] =
    useState(
      () => ({
        past:
          [],

        present:
          createCabinConfig(),

        future:
          [],
      }),
    );


  const config =
    history.present;


  const [
    section,
    setSection,
  ] =
    useState(
      'walls',
    );


  const [
    selection,
    setSelection,
  ] =
    useState({
      wall:
        'rearCenter',

      index:
        1,
    });


  const [
    family,
    setFamily,
  ] =
    useState(
      'paslanmaz',
    );


  const [
    ceilingTab,
    setCeilingTab,
  ] =
    useState(
      'patterns',
    );


  const [
    floorTab,
    setFloorTab,
  ] =
    useState(
      'materials',
    );


  const [
    exporting,
    setExporting,
  ] =
    useState(
      false,
    );


  const [
    exportMessage,
    setExportMessage,
  ] =
    useState(
      '',
    );


  const captureRef =
    useRef(
      null,
    );

  const optionsRef =
    useRef(
      null,
    );

  const materialRef =
    useRef(
      null,
    );


  const focusOptions = (
    wall = false,
  ) =>
    requestAnimationFrame(
      () => {
        if (
          !window.matchMedia(
            '(max-width: 1023px)',
          ).matches ||
          !optionsRef.current
        ) {
          return;
        }

        const aside =
          optionsRef.current;

        const target =
          wall
            ? materialRef.current
            : null;

        aside.scrollTop =
          target
            ? aside.scrollTop +
              target
                .getBoundingClientRect()
                .top -
              aside
                .getBoundingClientRect()
                .top -
              65
            : 0;
      },
    );


  const chooseSurface =
    id => {
      setSection(
        id,
      );

      focusOptions();
    };


  const [
    linked,
    setLinked,
  ] =
    useState(
      false,
    );


  const [
    view,
    setView,
  ] =
    useState({
      name:
        'front',

      version:
        0,
    });


  const [
    pending,
    startTransition,
  ] =
    useTransition();


  const gesture =
    useRef(
      null,
    );


  const change = (
    update,
    group = null,
  ) => {
    const coalesce =
      group !==
        null &&
      gesture.current ===
        group;

    gesture.current =
      group;

    setHistory(
      old => ({
        past:
          coalesce
            ? old.past
            : [
                ...old.past,
                old.present,
              ].slice(
                -40,
              ),

        present:
          typeof update ===
          'function'
            ? update(
                old.present,
              )
            : update,

        future:
          [],
      }),
    );
  };


  const finishGesture =
    () => {
      gesture.current =
        null;
    };


  const undo =
    () => {
      finishGesture();

      setHistory(
        old =>
          old.past.length
            ? {
                past:
                  old.past.slice(
                    0,
                    -1,
                  ),

                present:
                  old.past.at(
                    -1,
                  ),

                future: [
                  old.present,
                  ...old.future,
                ],
              }
            : old,
      );
    };


  const redo =
    () => {
      finishGesture();

      setHistory(
        old =>
          old.future.length
            ? {
                past: [
                  ...old.past,
                  old.present,
                ],

                present:
                  old.future[0],

                future:
                  old.future.slice(
                    1,
                  ),
              }
            : old,
      );
    };


  const choosePanel =
    next => {
      setSelection(
        next,
      );

      setSection(
        'walls',
      );

      focusOptions(
        true,
      );

      setFamily(
        config.walls[
          next.wall
        ].materials[
          next.index
        ].includes(
          'laminant',
        )
          ? 'laminant'
          : 'paslanmaz',
      );
    };


  const setMaterial =
    path =>
      startTransition(
        () =>
          change(
            old =>
              changeWall(
                old,
                selection.wall,

                wall => ({
                  ...wall,

                  materials:
                    wall.materials.map(
                      (
                        value,
                        index,
                      ) =>
                        index ===
                        selection.index
                          ? path
                          : value,
                    ),
                }),

                linked,
              ),
          ),
      );


  const downloadCabin =
    async format => {
      if (
        !captureRef.current ||
        captureRef.current.config !==
          config
      ) {
        setExportMessage(
          'Malzemeler yükleniyor. Birazdan tekrar deneyebilirsin.',
        );

        return;
      }

      setExporting(
        true,
      );

      setExportMessage(
        '',
      );

      try {
        const data =
          captureRef.current.capture();

        const name =
          'has-door-kabin-' +
          new Date()
            .toISOString()
            .slice(
              0,
              10,
            );

        if (
          format ===
          'png'
        ) {
          const link =
            document.createElement(
              'a',
            );

          link.href =
            data;

          link.download =
            name +
            '.png';

          link.click();
        } else {
          const {
            jsPDF,
          } =
            await import(
              'jspdf'
            );

          const pdf =
            new jsPDF({
              orientation:
                'portrait',

              unit:
                'mm',

              format:
                'a4',
            });

          const image =
            pdf.getImageProperties(
              data,
            );

          const width =
            Math.min(
              190,

              250 *
                image.width /
                image.height,
            );

          const height =
            width *
            image.height /
            image.width;

          pdf.setFontSize(
            16,
          );

          pdf.text(
            'HAS DOOR | KABIN TASARIMI',
            105,
            17,
            {
              align:
                'center',
            },
          );

          pdf.addImage(
            data,
            'PNG',
            (
              210 -
              width
            ) /
              2,
            25,
            width,
            height,
          );

          pdf.setFontSize(
            9,
          );

          pdf.text(
            '172 x 178 x 238 cm | ' +
              new Date().toLocaleDateString(
                'tr-TR',
              ),

            105,
            287,
            {
              align:
                'center',
            },
          );

          pdf.save(
            name +
              '.pdf',
          );
        }

        setExportMessage(
          format ===
            'png'
            ? 'PNG indirme başlatıldı.'
            : 'PDF indirme başlatıldı.',
        );
      } catch (
        error
      ) {
        console.error(
          'Kabin görseli indirilemedi',
          error,
        );

        setExportMessage(
          'Görsel hazırlanamadı. Lütfen tekrar dene.',
        );
      } finally {
        setExporting(
          false,
        );
      }
    };


  const selectedWall =
    config.walls[
      selection.wall
    ];

  const selectedPath =
    selectedWall.materials[
      selection.index
    ];

  const selectedLength =
    selection.wall ===
    'rearCenter'
      ? W
      : D;

  const mm =
    Math.round(
      selectedLength *
        selectedWall.widths[
          selection.index
        ] *
        10,
    );


  const changedPanels =
    Object.values(
      config.walls,
    ).reduce(
      (
        sum,
        wall,
      ) =>
        sum +
        wall.materials.filter(
          path =>
            path !==
            DEFAULT_MATERIAL,
        ).length,

      0,
    );


  const offerMessage =
    useMemo(
      () =>
        createCabinOfferMessage(
          config,
        ),

      [
        config,
      ],
    );


  const offerHref =
    whatsapp(
      offerMessage,
      company.phone,
    );


  const shareCabinOffer =
    async () => {
      if (
        !captureRef.current ||
        captureRef.current.config !==
          config
      ) {
        setExportMessage(
          'Malzemeler yükleniyor. Birazdan tekrar deneyebilirsin.',
        );

        return;
      }

      setExporting(
        true,
      );

      setExportMessage(
        '',
      );

      try {
        const dataUrl =
          captureRef.current.capture();

        const fileName =
          'has-door-kabin-' +
          new Date()
            .toISOString()
            .slice(
              0,
              10,
            ) +
          '.png';

        const [
          header,
          base64,
        ] =
          dataUrl.split(
            ',',
          );

        const mime =
          header.match(
            /data:(.*?);base64/,
          )?.[1] ||
          'image/png';

        const binary =
          atob(
            base64,
          );

        const bytes =
          new Uint8Array(
            binary.length,
          );

        for (
          let index = 0;
          index <
          binary.length;
          index += 1
        ) {
          bytes[
            index
          ] =
            binary.charCodeAt(
              index,
            );
        }

        const file =
          new File(
            [
              bytes,
            ],

            fileName,

            {
              type:
                mime,
            },
          );

        const canShareFile =
          typeof navigator !==
            'undefined' &&
          typeof navigator.share ===
            'function' &&
          (
            typeof navigator.canShare !==
              'function' ||
            navigator.canShare({
              files: [
                file,
              ],
            })
          );

        if (
          canShareFile
        ) {
          await navigator.share({
            title:
              'Has Door Kabin Tasarımı',

            text:
              offerMessage,

            files: [
              file,
            ],
          });

          setExportMessage(
            'Kabin resmi ve tasarım bilgileri paylaşım ekranına hazırlandı.',
          );

          return;
        }

        const link =
          document.createElement(
            'a',
          );

        link.href =
          dataUrl;

        link.download =
          fileName;

        link.click();

        window.open(
          offerHref,
          '_blank',
          'noopener,noreferrer',
        );

        setExportMessage(
          'Tarayıcı doğrudan dosya paylaşımını desteklemedi. Kabin resmi indirildi ve WhatsApp mesajı açıldı.',
        );
      } catch (
        error
      ) {
        if (
          error?.name ===
          'AbortError'
        ) {
          setExportMessage(
            'Paylaşım iptal edildi.',
          );

          return;
        }

        console.error(
          'Kabin tasarımı paylaşılamadı',
          error,
        );

        setExportMessage(
          'Tasarım paylaşılamadı. Lütfen tekrar dene.',
        );
      } finally {
        setExporting(
          false,
        );
      }
    };


  return (
    <div className="cabin-studio bg-[#f5f6f7] min-h-[calc(100vh-80px)] text-slate-800 font-sans px-4 sm:px-7 lg:px-10 pt-7 pb-10">
      <div className="max-w-[1480px] mx-auto">

        <div className="cabin-mobile-toolbar">
          <a href="/">
            ← Siteye dön
          </a>

          <button
            type="button"
            disabled={
              exporting ||
              pending
            }
            onClick={() =>
              downloadCabin(
                'png',
              )
            }
          >
            PNG indir
          </button>

          <button
            type="button"
            disabled={
              exporting ||
              pending
            }
            onClick={() =>
              downloadCabin(
                'pdf',
              )
            }
          >
            PDF indir
          </button>
        </div>


        <header className="flex flex-wrap justify-between items-end gap-4 mb-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#bc674b] font-semibold mb-2">
              HAS DOOR /
              TASARIM
              STÜDYOSU
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Kendi kabinini
              oluştur

              <span className="text-[#e66b43]">
                .
              </span>
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Malzemeleri
              bir araya
              getir. Her
              panelde kendi
              çizgini
              yansıt.
            </p>
          </div>


          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={
                undo
              }
              disabled={
                !history.past.length
              }
              aria-label="Geri al"
              title="Geri al"
              className="p-2.5 bg-white rounded-lg border border-slate-200 disabled:opacity-30"
            >
              <Undo2
                size={
                  17
                }
              />
            </button>


            <button
              type="button"
              onClick={
                redo
              }
              disabled={
                !history.future.length
              }
              aria-label="Yinele"
              title="Yinele"
              className="p-2.5 bg-white rounded-lg border border-slate-200 disabled:opacity-30"
            >
              <Redo2
                size={
                  17
                }
              />
            </button>


            <button
              type="button"
              onClick={() => {
                change(
                  createCabinConfig(),
                );

                setSelection({
                  wall:
                    'rearCenter',

                  index:
                    1,
                });

                setLinked(
                  false,
                );

                setFamily(
                  'paslanmaz',
                );

                setCeilingTab(
                  'patterns',
                );

                setSection(
                  'walls',
                );

                setView({
                  name:
                    'front',

                  version:
                    view.version +
                    1,
                });
              }}
              className="flex items-center gap-2 px-3 py-2.5 text-xs bg-white rounded-lg border border-slate-200"
            >
              <RotateCcw
                size={
                  15
                }
              />

              Baştan başla
            </button>
          </div>
        </header>


        <div className="grid grid-cols-1 lg:grid-cols-[370px_minmax(0,1fr)] xl:grid-cols-[410px_minmax(0,1fr)] gap-5 lg:gap-7 items-start">

          <aside
            ref={
              optionsRef
            }
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden order-2 lg:order-1 lg:max-h-[calc(100svh-120px)] lg:overflow-y-auto lg:sticky lg:top-24"
          >
            <nav
              aria-label="Tasarım kategorileri"
              className="grid grid-cols-4 border-b border-slate-100 bg-[#fafafa] p-2 gap-1 sticky top-0 z-20"
            >
              {
                categories.map(
                  ({
                    id,
                    name,
                    icon:
                      Icon,
                  }) => (
                    <button
                      key={
                        id
                      }
                      type="button"
                      onClick={() =>
                        chooseSurface(
                          id,
                        )
                      }
                      aria-pressed={
                        section ===
                        id
                      }
                      className={`flex flex-col items-center gap-2 py-3 text-xs rounded-xl transition ${
                        section ===
                        id
                          ? 'bg-white text-[#d7623c] shadow-sm font-semibold'
                          : 'text-slate-500 hover:bg-white'
                      }`}
                    >
                      <Icon
                        size={
                          19
                        }
                        strokeWidth={
                          1.6
                        }
                      />

                      {name}
                    </button>
                  ),
                )
              }
            </nav>


            <div className="p-5 sm:p-6">

              {
                section ===
                  'walls' && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-semibold text-base">
                        Duvar &
                        panel
                        seçimi
                      </h2>

                      <span className="text-[10px] text-slate-400">
                        01 / 04
                      </span>
                    </div>


                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {
                        Object.entries(
                          WALLS,
                        ).map(
                          ([
                            key,
                            name,
                          ]) => (
                            <button
                              type="button"
                              key={
                                key
                              }
                              onClick={() =>
                                choosePanel({
                                  wall:
                                    key,

                                  index:
                                    selection.index,
                                })
                              }
                              aria-pressed={
                                selection.wall ===
                                key
                              }
                              className={`rounded-lg border py-2.5 text-xs transition ${
                                selection.wall ===
                                key
                                  ? 'border-[#e4a68e] bg-[#fcf1ec] text-[#ac4d2d] font-semibold'
                                  : 'border-slate-200 text-slate-500 hover:border-slate-400'
                              }`}
                            >
                              {name}
                            </button>
                          ),
                        )
                      }
                    </div>


                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-500">
                        {
                          selection.wall.startsWith(
                            'rear',
                          )
                            ? 'Soldan sağa üç dikey panel'
                            : 'Girişten arkaya üç dikey panel'
                        }
                      </span>

                      <span className="text-[10px] uppercase tracking-wider text-slate-400">
                        PANEL SEÇ
                      </span>
                    </div>


                    <div className="flex gap-1.5 h-24 mb-3">
                      {
                        selectedWall.materials.map(
                          (
                            path,
                            index,
                          ) => (
                            <button
                              type="button"
                              key={
                                index
                              }
                              style={{
                                ...swatchStyle(
                                  path,
                                ),

                                flex:
                                  selectedWall.widths[
                                    index
                                  ],
                              }}
                              onClick={() =>
                                choosePanel({
                                  ...selection,
                                  index,
                                })
                              }
                              aria-label={`Panel ${index + 1}`}
                              aria-pressed={
                                selection.index ===
                                index
                              }
                              className={`relative rounded-md border-2 overflow-hidden min-w-0 ${
                                selection.index ===
                                index
                                  ? 'border-[#e66b43]'
                                  : 'border-transparent'
                              }`}
                            >
                              <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                              <span className="absolute bottom-2 inset-x-0 text-white text-[11px] font-medium">
                                {
                                  index +
                                  1
                                }{' '}
                                · %
                                {
                                  selectedWall.widths[
                                    index
                                  ]
                                }
                              </span>

                              {
                                selection.index ===
                                  index && (
                                  <Check
                                    size={
                                      13
                                    }
                                    className="absolute right-1 top-1 text-white bg-[#e66b43] rounded-full p-0.5"
                                  />
                                )
                              }
                            </button>
                          ),
                        )
                      }
                    </div>


                    <p className="text-[11px] text-slate-400 mb-5 flex items-center gap-1.5">
                      <MousePointer2
                        size={
                          12
                        }
                      />

                      Kabin
                      üzerinden
                      bir panele
                      de
                      tıklayabilirsin.
                    </p>


                    <p className="text-[11px] text-slate-400 mb-4">
                      Panel
                      genişliği
                      sabit ·
                      Yaklaşık{' '}
                      {mm} mm
                    </p>


                    {
                      selection.wall !==
                        'rearCenter' && (
                        <button
                          type="button"
                          onClick={() =>
                            setLinked(
                              !linked,
                            )
                          }
                          aria-pressed={
                            linked
                          }
                          className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs ${
                            linked
                              ? 'bg-[#fcf1ec] border-orange-200 text-[#ac4d2d]'
                              : 'bg-slate-50 border-slate-100 text-slate-500'
                          }`}
                        >
                          <span className="flex gap-2 items-center">
                            {
                              linked
                                ? (
                                  <Link2
                                    size={
                                      14
                                    }
                                  />
                                )
                                : (
                                  <Unlink2
                                    size={
                                      14
                                    }
                                  />
                                )
                            }

                            {
                              selection.wall.startsWith(
                                'rear',
                              )
                                ? 'Arka iki yana aynı uygula'
                                : 'İki yan duvara aynı uygula'
                            }
                          </span>

                          <span
                            className={`w-7 h-4 rounded-full relative ${
                              linked
                                ? 'bg-[#e66b43]'
                                : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 bg-white w-3 h-3 rounded-full ${
                                linked
                                  ? 'right-0.5'
                                  : 'left-0.5'
                              }`}
                            />
                          </span>
                        </button>
                      )
                    }


                    {
                      selection.wall ===
                        'rearCenter' &&
                        config.mirrorMode !==
                          'none' && (
                          <button
                            type="button"
                            onClick={() =>
                              change(
                                old => ({
                                  ...old,

                                  mirrorMode:
                                    'none',
                                }),
                              )
                            }
                            className="text-xs bg-orange-50 text-orange-800 rounded-lg p-3 w-full"
                          >
                            Panelleri
                            görmek
                            için aynayı
                            kaldır
                          </button>
                        )
                    }


                    <div
                      ref={
                        materialRef
                      }
                      className="border-t border-slate-100 mt-5 pt-5"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold">
                          Panel
                          malzemesi
                        </h3>

                        <span className="text-[10px] text-[#c56b4a]">
                          PANEL{' '}
                          {
                            selection.index +
                            1
                          }
                        </span>
                      </div>


                      <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
                        {
                          [
                            [
                              'paslanmaz',
                              'Paslanmazlar',
                            ],

                            [
                              'laminant',
                              'Laminantlar',
                            ],
                          ].map(
                            ([
                              id,
                              name,
                            ]) => (
                              <button
                                key={
                                  id
                                }
                                type="button"
                                onClick={() =>
                                  setFamily(
                                    id,
                                  )
                                }
                                aria-pressed={
                                  family ===
                                  id
                                }
                                className={`flex-1 py-2 rounded-md text-xs ${
                                  family ===
                                  id
                                    ? 'bg-white shadow-sm font-semibold'
                                    : 'text-slate-500'
                                }`}
                              >
                                {name}
                              </button>
                            ),
                          )
                        }
                      </div>


                      <MaterialGrid
                        type={
                          family
                        }
                        count={
                          27
                        }
                        selected={
                          selectedPath
                        }
                        onSelect={
                          setMaterial
                        }
                      />


                      <p className="text-xs text-slate-500 mt-3 min-h-4">
                        Seçili:{' '}

                        <span className="text-slate-800 font-medium">
                          {
                            materialName(
                              selectedPath,
                            )
                          }
                        </span>
                      </p>


                      <button
                        type="button"
                        onClick={() =>
                          startTransition(
                            () =>
                              change(
                                old =>
                                  changeWall(
                                    old,
                                    selection.wall,

                                    wall => ({
                                      ...wall,

                                      materials:
                                        Array(
                                          3,
                                        ).fill(
                                          selectedPath,
                                        ),
                                    }),

                                    linked,
                                  ),
                              ),
                          )
                        }
                        className="mt-4 flex items-center justify-between w-full text-xs text-slate-600 bg-slate-50 rounded-lg py-3 px-3 hover:bg-slate-100"
                      >
                        Bu
                        malzemeyi
                        duvarın üç
                        paneline
                        uygula

                        <ArrowRight
                          size={
                            14
                          }
                        />
                      </button>
                    </div>


                    <div className="border-t border-slate-100 mt-5 pt-5">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h3 className="text-sm font-semibold">
                          Kabin yazısı
                        </h3>

                        <span className="text-[10px] text-slate-400">
                          ARKA ALT ORTA
                        </span>
                      </div>


                      <p className="text-xs leading-5 text-slate-500 mb-3">
                        Kabinin arka duvarının alt orta kısmında görünür.
                        Varsayılan yazı HAS DOOR'dur.
                      </p>


                      <input
                        type="text"
                        value={
                          config.cabinText ??
                          ''
                        }
                        maxLength={
                          18
                        }
                        aria-label="Kabin yazısı"
                        onChange={
                          event =>
                            change(
                              old => ({
                                ...old,

                                cabinText:
                                  event.target.value
                                    .toLocaleUpperCase(
                                      'tr-TR',
                                    )
                                    .slice(
                                      0,
                                      18,
                                    ),
                              }),

                              'cabin-text',
                            )
                        }
                        onBlur={
                          finishGesture
                        }
                        placeholder="HAS DOOR"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold tracking-[0.08em] text-slate-800 outline-none transition focus:border-[#e66b43] focus:ring-2 focus:ring-orange-100"
                      />


                      <div className="mt-4">
                        <label
                          htmlFor="cabin-text-font"
                          className="mb-2 block text-xs font-medium text-slate-600"
                        >
                          Yazı tipi
                        </label>


                        <select
                          id="cabin-text-font"
                          value={
                            config.cabinTextFont ||
                            'modern'
                          }
                          onChange={
                            event => {
                              finishGesture();

                              change(
                                old => ({
                                  ...old,

                                  cabinTextFont:
                                    event.target.value,
                                }),
                              );
                            }
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#e66b43] focus:ring-2 focus:ring-orange-100"
                        >
                          {
                            CABIN_FONT_OPTIONS.map(
                              font => (
                                <option
                                  key={
                                    font.id
                                  }
                                  value={
                                    font.id
                                  }
                                >
                                  {
                                    font.name
                                  }
                                </option>
                              ),
                            )
                          }
                        </select>


                        <div
                          className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-center text-lg text-slate-700"
                          style={{
                            fontFamily:
                              cabinFont(
                                config.cabinTextFont,
                              ).family,
                          }}
                        >
                          {
                            config.cabinText?.trim() ||
                            'Önizleme'
                          }
                        </div>
                      </div>


                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-[10px] text-slate-400">
                          En fazla 18 karakter
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            finishGesture();

                            change(
                              old => ({
                                ...old,

                                cabinText:
                                  'HAS DOOR',
                              }),
                            );
                          }}
                          className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                        >
                          HAS DOOR'a sıfırla
                        </button>
                      </div>
                    </div>
                  </>
                )
              }


              {
                section ===
                  'mirror' && (
                  <>
                    <div className="flex justify-between mb-2">
                      <h2 className="font-semibold">
                        İsteğe
                        bağlı ayna
                      </h2>

                      <span className="text-[10px] text-slate-400">
                        02 / 04
                      </span>
                    </div>


                    <p className="text-xs leading-5 text-slate-500 mb-5">
                      Arka duvar
                      toplam üç
                      dikey
                      panelden
                      oluşur.
                      Ayna orta
                      panele
                      eklenir;
                      panel
                      seçimlerin
                      korunur.
                      Yansıma
                      yalnız tam
                      boy aynada
                      görünür.
                    </p>


                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {
                        [
                          [
                            'none',
                            'Ayna yok',
                          ],

                          [
                            'full',
                            'Tam boy',
                          ],

                          [
                            'half',
                            'Yarım boy',
                          ],

                          [
                            'custom',
                            'Özel ölçü',
                          ],
                        ].map(
                          ([
                            mode,
                            label,
                          ]) => (
                            <button
                              type="button"
                              key={
                                mode
                              }
                              aria-pressed={
                                config.mirrorMode ===
                                mode
                              }
                              onClick={() =>
                                change(
                                  old => ({
                                    ...old,

                                    mirrorMode:
                                      mode,
                                  }),
                                )
                              }
                              className={`border rounded-lg py-3 text-xs ${
                                config.mirrorMode ===
                                mode
                                  ? 'border-orange-300 bg-orange-50 text-orange-800 font-semibold'
                                  : 'border-slate-200 text-slate-500'
                              }`}
                            >
                              {label}
                            </button>
                          ),
                        )
                      }
                    </div>


                    <div className="flex h-44 gap-1 mx-auto max-w-52 mb-6 relative border-4 border-slate-200 rounded overflow-hidden">
                      {
                        config.walls.rearCenter.materials.map(
                          (
                            path,
                            i,
                          ) => (
                            <div
                              key={i}
                              style={{
                                ...swatchStyle(
                                  path,
                                ),

                                flex:
                                  config.walls.rearCenter.widths[
                                    i
                                  ],
                              }}
                            />
                          ),
                        )
                      }

                      {
                        config.mirrorMode !==
                          'none' && (
                          <div
                            style={{
                              height:
                                `${mirrorGeometry(config).height / H * 100}%`,

                              left:
                                `${config.walls.rearCenter.widths[0]}%`,

                              width:
                                `${config.walls.rearCenter.widths[1]}%`,
                            }}
                            className="absolute top-0 bg-gradient-to-br from-slate-100 via-[#b8cdd4] to-[#e8f3f5] border-b border-slate-400 flex items-center justify-center text-[10px] text-slate-600 tracking-wider"
                          >
                            AYNA
                          </div>
                        )
                      }
                    </div>


                    <div className="space-y-6">
                      <p className="text-xs text-slate-500">
                        Ayna
                        genişliği
                        orta
                        panelle
                        birlikte
                        sabittir:{' '}

                        {
                          Math.round(
                            mirrorGeometry(
                              config,
                            ).width *
                              100,
                          )
                        }{' '}
                        cm.
                      </p>


                      {
                        config.mirrorMode !==
                          'none' && (
                          <>
                            <RangeControl
                              label="Ayna yüksekliği"
                              value={
                                Math.round(
                                  mirrorGeometry(
                                    config,
                                  ).height *
                                    100,
                                )
                              }
                              min={
                                60
                              }
                              max={
                                238
                              }
                              suffix=" cm"
                              onChange={
                                value =>
                                  change(
                                    old => ({
                                      ...old,

                                      mirrorMode:
                                        'custom',

                                      mirrorHeight:
                                        value,
                                    }),

                                    'mirror-height',
                                  )
                              }
                              onFinish={
                                finishGesture
                              }
                            />


                            <p className="text-xs text-slate-500">
                              Ayna
                              ölçüsü:{' '}

                              {
                                Math.round(
                                  mirrorGeometry(
                                    config,
                                  ).width *
                                    100,
                                )
                              }{' '}
                              ×{' '}

                              {
                                Math.round(
                                  mirrorGeometry(
                                    config,
                                  ).height *
                                    100,
                                )
                              }{' '}
                              cm
                            </p>


                            {
                              config.mirrorMode ===
                                'full' && (
                                <details className="text-xs border-t border-slate-100 pt-4">
                                  <summary className="cursor-pointer text-slate-500">
                                    Yansıma
                                    ayarları
                                  </summary>

                                  <div className="space-y-5 mt-5">
                                    <RangeControl
                                      label="Üst yansıma yüksekliği"
                                      value={
                                        config.topReflection
                                      }
                                      min={
                                        25
                                      }
                                      max={
                                        62
                                      }
                                      suffix=" cm"
                                      onChange={
                                        value =>
                                          change(
                                            old => ({
                                              ...old,

                                              topReflection:
                                                value,
                                            }),

                                            'mirror-top',
                                          )
                                      }
                                      onFinish={
                                        finishGesture
                                      }
                                    />


                                    <RangeControl
                                      label="Alt yansıma yüksekliği"
                                      value={
                                        config.bottomReflection
                                      }
                                      min={
                                        25
                                      }
                                      max={
                                        62
                                      }
                                      suffix=" cm"
                                      onChange={
                                        value =>
                                          change(
                                            old => ({
                                              ...old,

                                              bottomReflection:
                                                value,
                                            }),

                                            'mirror-bottom',
                                          )
                                      }
                                      onFinish={
                                        finishGesture
                                      }
                                    />


                                    <p className="text-slate-400 leading-5">
                                      Yansıma
                                      yalnız
                                      tam boy
                                      aynada
                                      gösterilir.
                                    </p>
                                  </div>
                                </details>
                              )
                            }
                          </>
                        )
                      }
                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        choosePanel({
                          wall:
                            'rearCenter',

                          index:
                            1,
                        })
                      }
                      className="mt-6 w-full rounded-lg bg-slate-50 p-3 text-xs text-slate-600"
                    >
                      Orta
                      alanın üç
                      panelini
                      düzenle →
                    </button>
                  </>
                )
              }


              {
                section ===
                  'ceiling' && (
                  <>
                    <h2 className="font-semibold mb-2">
                      Tavan
                      tasarımı
                    </h2>


                    <p className="text-xs leading-5 text-slate-500 mb-4">
                      Sağ ve sol
                      kenarlar
                      ile dört
                      spot
                      sabit.
                      Seçtiğin
                      desen
                      yalnız orta
                      bölümde
                      değişir.
                    </p>


                    <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
                      <button
                        type="button"
                        aria-pressed={
                          ceilingTab ===
                          'patterns'
                        }
                        onClick={() =>
                          setCeilingTab(
                            'patterns',
                          )
                        }
                        className={
                          ceilingTab ===
                          'patterns'
                            ? 'flex-1 py-2 rounded-md text-xs bg-white shadow-sm font-semibold'
                            : 'flex-1 py-2 rounded-md text-xs text-slate-500'
                        }
                      >
                        Desenler
                      </button>


                      <button
                        type="button"
                        aria-pressed={
                          ceilingTab ===
                          'colors'
                        }
                        onClick={() =>
                          setCeilingTab(
                            'colors',
                          )
                        }
                        className={
                          ceilingTab ===
                          'colors'
                            ? 'flex-1 py-2 rounded-md text-xs bg-white shadow-sm font-semibold'
                            : 'flex-1 py-2 rounded-md text-xs text-slate-500'
                        }
                      >
                        Renkler
                      </button>
                    </div>


                    {
                      ceilingTab ===
                      'patterns'
                        ? (
                          <MaterialGrid
                            type="tavan"
                            count={
                              39
                            }
                            selected={
                              config.ceiling
                            }
                            onSelect={
                              path =>
                                startTransition(
                                  () =>
                                    change(
                                      old => ({
                                        ...old,

                                        ceiling:
                                          path,
                                      }),
                                    ),
                                )
                            }
                          />
                        )
                        : (
                          <div className="grid grid-cols-3 gap-3">
                            {
                              CEILING_COLORS.map(
                                item => (
                                  <button
                                    type="button"
                                    key={
                                      item.id
                                    }
                                    aria-label={
                                      'Tavan rengi: ' +
                                      item.name
                                    }
                                    aria-pressed={
                                      config.ceilingColor ===
                                      item.id
                                    }
                                    onClick={() =>
                                      change(
                                        old => ({
                                          ...old,

                                          ceilingColor:
                                            item.id,
                                        }),
                                      )
                                    }
                                    className={
                                      config.ceilingColor ===
                                      item.id
                                        ? 'rounded-lg p-1 border-2 border-orange-400 text-xs'
                                        : 'rounded-lg p-1 border-2 border-transparent text-xs'
                                    }
                                  >
                                    <span
                                      className="block h-14 rounded-md mb-2"
                                      style={{
                                        background:
                                          'linear-gradient(110deg,#ffffff30,transparent,#00000025),' +
                                          item.color,
                                      }}
                                    />

                                    {
                                      item.name
                                    }
                                  </button>
                                ),
                              )
                            }
                          </div>
                        )
                    }


                    <CeilingPreview
                      path={
                        config.ceiling
                      }
                      color={
                        config.ceilingColor
                      }
                      sideColor={
                        config.ceilingSideColor
                      }
                    />


                    <p className="mt-3 text-xs text-slate-500">
                      {
                        materialName(
                          config.ceiling,
                        )
                      }{' '}
                      ·{' '}

                      {
                        ceilingColor(
                          config.ceilingColor,
                        ).name
                      }
                    </p>
                  </>
                )
              }


              {
                section ===
                  'floor' && (
                  <>
                    <h2 className="font-semibold mb-2">
                      Taban
                      Granitleri
                    </h2>


                    <p className="text-xs leading-5 text-slate-500 mb-5">
                      Doğal
                      taşlar ve
                      tek parça
                      dekoratif
                      zeminler.
                    </p>


                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        aria-pressed={
                          floorTab ===
                          'materials'
                        }
                        onClick={() =>
                          setFloorTab(
                            'materials',
                          )
                        }
                        className="border rounded-lg px-3 py-2 text-xs"
                      >
                        Granitler
                      </button>


                      <button
                        type="button"
                        aria-pressed={
                          floorTab ===
                          'colors'
                        }
                        onClick={() =>
                          setFloorTab(
                            'colors',
                          )
                        }
                        className="border rounded-lg px-3 py-2 text-xs"
                      >
                        Tarak /
                        eşik
                        renkleri
                      </button>
                    </div>


                    {
                      floorTab ===
                        'colors' && (
                        <>
                          <p className="text-xs text-slate-500 mb-3">
                            Zemin
                            kenarlarındaki
                            metal
                            parçalar
                            ve giriş
                            eşiği
                          </p>

                          <div className="grid grid-cols-3 gap-3">
                            {
                              CEILING_COLORS.map(
                                item => (
                                  <button
                                    type="button"
                                    key={
                                      item.id
                                    }
                                    aria-label={
                                      'Zemin tarak rengi: ' +
                                      item.name
                                    }
                                    aria-pressed={
                                      config.floorTrimColor ===
                                      item.id
                                    }
                                    onClick={() =>
                                      change(
                                        old => ({
                                          ...old,

                                          floorTrimColor:
                                            item.id,
                                        }),
                                      )
                                    }
                                    className={
                                      config.floorTrimColor ===
                                      item.id
                                        ? 'border-2 border-orange-400 rounded p-1 text-xs'
                                        : 'border-2 border-transparent rounded p-1 text-xs'
                                    }
                                  >
                                    <span
                                      className="block h-12 rounded mb-2"
                                      style={{
                                        background:
                                          'linear-gradient(110deg,#ffffff35,transparent,#00000030),' +
                                          item.color,
                                      }}
                                    />

                                    {
                                      item.name
                                    }
                                  </button>
                                ),
                              )
                            }
                          </div>
                        </>
                      )
                    }


                    {
                      floorTab ===
                        'materials' && (
                        <MaterialGrid
                          type="granit"
                          count={
                            27
                          }
                          selected={
                            config.floor
                          }
                          onSelect={
                            path =>
                              startTransition(
                                () =>
                                  change(
                                    old => ({
                                      ...old,

                                      floor:
                                        path,
                                    }),
                                  ),
                              )
                          }
                        />
                      )
                    }


                    <div className="mt-5 rounded-xl border border-slate-200 overflow-hidden">
                      <div
                        className="aspect-[2/1]"
                        style={{
                          ...swatchStyle(
                            config.floor,
                          ),

                          backgroundSize:
                            'contain',

                          backgroundRepeat:
                            'no-repeat',
                        }}
                      />

                      <p className="text-xs px-3 py-3 border-t border-slate-100">
                        {
                          materialName(
                            config.floor,
                          )
                        }
                      </p>
                    </div>
                  </>
                )
              }
            </div>
          </aside>


          <section
            aria-label="3D kabin önizlemesi"
            className="order-1 lg:order-2 lg:sticky lg:top-24"
          >
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-[#e9edef] shadow-sm">

              <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-slate-400">
                    TASARIMINIZ
                  </p>

                  <p className="text-sm font-medium mt-1">
                    {
                      section ===
                      'walls'
                        ? `${WALLS[selection.wall]} · Panel ${selection.index + 1}`
                        : 'Kabin görünümü'
                    }
                  </p>
                </div>


                <span
                  role="status"
                  className="text-[10px] bg-white/80 border border-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-slate-500"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      pending
                        ? 'bg-orange-400'
                        : 'bg-emerald-500'
                    }`}
                  />

                  {
                    pending
                      ? 'Malzeme yükleniyor'
                      : 'Canlı önizleme'
                  }
                </span>
              </div>


              <div className="cabin-preview-canvas h-[470px] sm:h-[560px] lg:h-[min(740px,calc(100svh-320px))] lg:min-h-[340px]">
                <Canvas
                  camera={{
                    position: [
                      0,
                      0.02,
                      5.25,
                    ],

                    fov:
                      34,
                  }}
                  dpr={[
                    1.5,
                    2,
                  ]}
                  gl={{
                    antialias:
                      true,

                    preserveDrawingBuffer:
                      true,
                  }}
                  onCreated={
                    ({
                      gl,
                    }) => {
                      gl.toneMapping =
                        THREE.ACESFilmicToneMapping;

                      gl.toneMappingExposure =
                        1;

                      gl.outputColorSpace =
                        THREE.SRGBColorSpace;
                    }
                  }
                >
                  <color
                    attach="background"
                    args={[
                      '#e9edef',
                    ]}
                  />

                  <hemisphereLight
                    args={[
                      '#fff8f0',
                      '#bcc5cc',
                      2.2,
                    ]}
                  />

                  <rectAreaLight
                    position={[
                      0,
                      H /
                        2 -
                        0.015,
                      0,
                    ]}
                    rotation={[
                      Math.PI /
                        2,
                      0,
                      0,
                    ]}
                    width={
                      1.1
                    }
                    height={
                      1.45
                    }
                    intensity={
                      4
                    }
                    color="#fff1df"
                  />

                  <rectAreaLight
                    position={[
                      0,
                      0.5,
                      2.4,
                    ]}
                    width={
                      3.5
                    }
                    height={
                      3
                    }
                    intensity={
                      2.7
                    }
                    color="#edf2f7"
                  />


                  <Suspense
                    fallback={
                      <Html
                        center
                      >
                        <span className="text-xs whitespace-nowrap bg-white p-3 rounded-lg shadow-sm">
                          Kabin
                          hazırlanıyor…
                        </span>
                      </Html>
                    }
                  >
                    <CabinEnvironment>
                      <KendiAsansorumuz
                        config={
                          config
                        }
                        selection={
                          selection
                        }
                        onSelect={
                          choosePanel
                        }
                        editing={
                          section ===
                          'walls'
                        }
                        onSurfaceSelect={
                          chooseSurface
                        }
                        onMirrorSelect={() =>
                          chooseSurface(
                            'mirror',
                          )
                        }
                        captureRef={
                          captureRef
                        }
                      />
                    </CabinEnvironment>
                  </Suspense>


                  <CameraView
                    view={
                      view
                    }
                  />
                </Canvas>
              </div>


              <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
                <p className="text-[10px] sm:text-xs text-slate-500 bg-white/80 border border-white rounded-full px-3 py-2">
                  Sürükleyerek
                  döndür ·
                  Bir panele
                  dokunarak
                  seç
                </p>
              </div>
            </div>


            <div className="flex flex-wrap justify-between items-center gap-3 mt-3">
              <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200">
                {
                  [
                    [
                      'front',
                      'Karşıdan',
                    ],

                    [
                      'left',
                      'Sol duvar',
                    ],

                    [
                      'right',
                      'Sağ duvar',
                    ],
                  ].map(
                    ([
                      name,
                      label,
                    ]) => (
                      <button
                        key={
                          name
                        }
                        type="button"
                        onClick={() =>
                          setView({
                            name,

                            version:
                              view.version +
                              1,
                          })
                        }
                        aria-label={`${label} görünümü`}
                        className={`px-3 py-2 text-[11px] rounded-lg ${
                          view.name ===
                          name
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-500'
                        }`}
                      >
                        {label}
                      </button>
                    ),
                  )
                }
              </div>


              <button
                type="button"
                onClick={() =>
                  setView({
                    name:
                      'front',

                    version:
                      view.version +
                      1,
                  })
                }
                className="flex gap-1.5 items-center text-xs text-slate-500"
              >
                <Expand
                  size={
                    14
                  }
                />

                Görünümü
                sıfırla
              </button>
            </div>


            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-200 pt-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-slate-400">
                  KABİN
                  ÖLÇÜSÜ
                </p>

                <p className="text-xs mt-1.5 font-medium">
                  172 × 178
                  × 238 cm
                </p>
              </div>


              <div>
                <p className="text-[9px] uppercase tracking-widest text-slate-400">
                  DİKEY
                  PANELLER
                </p>

                <p className="text-xs mt-1.5 font-medium">
                  9 bağımsız
                  bölüm
                </p>
              </div>


              <div>
                <p className="text-[9px] uppercase tracking-widest text-slate-400">
                  AYNA
                </p>

                <p className="text-xs mt-1.5 font-medium">
                  {
                    config.mirrorMode ===
                    'none'
                      ? 'Ayna yok'
                      : `${Math.round(
                          mirrorGeometry(
                            config,
                          ).width *
                            100,
                        )} × ${Math.round(
                          mirrorGeometry(
                            config,
                          ).height *
                            100,
                        )} cm`
                  }
                </p>
              </div>
            </div>


            <div className="flex flex-wrap gap-2 mt-4">

              <button
                type="button"
                disabled={
                  exporting ||
                  pending
                }
                onClick={() =>
                  downloadCabin(
                    'png',
                  )
                }
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs disabled:opacity-50"
              >
                <ImageDown
                  size={
                    15
                  }
                />

                Resmi indir
                (PNG)
              </button>


              <button
                type="button"
                disabled={
                  exporting ||
                  pending
                }
                onClick={() =>
                  downloadCabin(
                    'pdf',
                  )
                }
                className="flex items-center gap-2 bg-slate-800 text-white rounded-lg px-4 py-2 text-xs disabled:opacity-50"
              >
                <FileDown
                  size={
                    15
                  }
                />

                PDF indir
              </button>


              <button
                type="button"
                disabled={
                  exporting ||
                  pending
                }
                onClick={
                  shareCabinOffer
                }
                aria-label="Kabin resmini ve tasarım bilgilerini paylaş"
                className="flex items-center gap-2 bg-[#25D366] text-white rounded-lg px-4 py-2 text-xs font-semibold transition hover:brightness-95 disabled:opacity-50"
              >
                <MessageCircle
                  size={
                    15
                  }
                />

                Resim +
                Bilgileri
                Paylaş
              </button>
            </div>


            <p className="text-[11px] text-slate-400 mt-2">
              Telefonda
              paylaşım
              ekranı açılır.
              WhatsApp'ı
              seçtiğinde
              kabin resmi ve
              tasarım
              bilgileri aynı
              paylaşımda
              hazırlanır.
              Desteklenmeyen
              tarayıcılarda
              görsel indirilir
              ve WhatsApp
              mesajı açılır.
            </p>


            <p
              role="status"
              className="text-xs text-slate-500 mt-2"
            >
              {
                exporting
                  ? 'Görsel hazırlanıyor…'
                  : exportMessage
              }
            </p>


            <details className="mt-5 bg-white rounded-xl border border-slate-200 text-xs">
              <summary className="px-4 py-3 cursor-pointer flex items-center justify-between text-slate-600">
                Tasarım özeti

                <span className="flex items-center gap-2 text-slate-400">
                  {
                    changedPanels
                  }{' '}
                  panel
                  özelleştirildi

                  <ChevronDown
                    size={
                      14
                    }
                  />
                </span>
              </summary>


              <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                {
                  Object.entries(
                    WALLS,
                  ).map(
                    ([
                      wall,
                      name,
                    ]) => (
                      <div
                        key={
                          wall
                        }
                      >
                        <p className="font-semibold mb-1">
                          {name}
                        </p>

                        <p className="text-slate-500 leading-5">
                          {
                            config.walls[
                              wall
                            ].materials
                              .map(
                                (
                                  path,
                                  i,
                                ) =>
                                  `${i + 1}. ${materialName(path)} (%${config.walls[wall].widths[i]})`,
                              )
                              .join(
                                ' · ',
                              )
                          }
                        </p>
                      </div>
                    ),
                  )
                }
              </div>
            </details>

          </section>

        </div>
      </div>
    </div>
  );
}