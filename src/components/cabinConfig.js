export const WALLS = { left: 'Sol duvar', right: 'Sağ duvar', rearCenter: 'Arka duvar' };
export const DEFAULT_MATERIAL = '/kabin-materyalleri/paslanmaz-1.png';
export const materialPath = (type, id) => `/kabin-materyalleri/${type}-${id}.png`;
export function createCabinConfig() {
  return {
    walls: Object.fromEntries(Object.keys(WALLS).map(key => [key, {
      widths: [30, 40, 30], materials: [DEFAULT_MATERIAL, DEFAULT_MATERIAL, DEFAULT_MATERIAL],
    }])),
    mirrorMode: 'none', mirrorHeight: 160, topReflection: 42, bottomReflection: 40,
    ceiling: materialPath('tavan', 1), floor: materialPath('granit', 26),
  };
}
// Preserve a closed wall: changing one panel proportionally redistributes the rest.
export function resizePanels(widths, index, requested) {
  const next = Math.max(15, Math.min(70, Number(requested)));
  if (!Number.isFinite(next) || index < 0 || index > 2) return widths;
  const others = [0, 1, 2].filter(i => i !== index);
  const remaining = 100 - next;
  const total = widths[others[0]] + widths[others[1]];
  const first = Math.max(15, Math.min(remaining - 15, Math.round(remaining * widths[others[0]] / total)));
  const result = [...widths];
  result[index] = next;
  result[others[0]] = first;
  result[others[1]] = remaining - first;
  return result;
}
export function changeWall(config, wall, update, linked = false) {
  const pair = { left: 'right', right: 'left' };
  const walls = { ...config.walls, [wall]: update(config.walls[wall]) };
  if (linked && pair[wall]) walls[pair[wall]] = update(config.walls[pair[wall]]);
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
