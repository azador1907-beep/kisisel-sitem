export const WALLS = { left: 'Sol duvar', right: 'Sağ duvar', rearCenter: 'Arka duvar' };
export const PANEL_WIDTHS = Object.freeze([30, 40, 30]);
export const DEFAULT_MATERIAL = '/kabin-materyalleri/paslanmaz-1.png';
export const materialPath = (type, id) => `/kabin-materyalleri/${type}-${id}.png`;
export function createCabinConfig() {
  return {
    walls: Object.fromEntries(Object.keys(WALLS).map(key => [key, {
      widths: PANEL_WIDTHS, materials: [DEFAULT_MATERIAL, DEFAULT_MATERIAL, DEFAULT_MATERIAL],
    }])),
    ceilingColor: 'silver', floorTrimColor: 'silver',
    mirrorMode: 'none', mirrorHeight: 160, topReflection: 42, bottomReflection: 40,
    ceiling: materialPath('tavan', 36), floor: materialPath('granit', 26),
  };
}
export function changeWall(config, wall, update, linked = false) {
  const pair = { left: 'right', right: 'left' };
  const apply = key => ({ ...update(config.walls[key]), widths: PANEL_WIDTHS });
  const walls = { ...config.walls, [wall]: apply(wall) };
  if (linked && pair[wall]) walls[pair[wall]] = apply(pair[wall]);
  return { ...config, walls };
}
export function mirrorGeometry(config) {
  const height = config.mirrorMode === 'none' ? 0 : config.mirrorMode === 'full' ? 238 : config.mirrorMode === 'half' ? 119 : Math.max(60, Math.min(238, config.mirrorHeight));
  // Short mirrors stay at eye level, with the three original panels beneath.
  const top = 119;
  const bottom = top - height;
  const [left, center] = config.walls.rearCenter.widths;
  const reflect = config.mirrorMode === 'full';
  return { height: height / 100, top: top / 100, bottom: bottom / 100,
    width: 1.72 * center / 100, x: -1.72 / 2 + 1.72 * (left + center / 2) / 100,
    topReflection: reflect ? Math.min(config.topReflection, height * 0.32) / 100 : 0,
    bottomReflection: reflect ? Math.min(config.bottomReflection, height * 0.32) / 100 : 0 };
}
