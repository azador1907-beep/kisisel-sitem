import test from 'node:test';
import assert from 'node:assert/strict';
import { createCabinConfig, changeWall, mirrorGeometry } from '../src/components/cabinConfig.js';

test('wall panel dimensions remain fixed during material and mirror changes', () => {
  const config=createCabinConfig();
  for (const wall of Object.keys(config.walls)) {
    const next=changeWall(config, wall, value=>({...value, widths:[10,80,10], materials:['a','b','c']}));
    assert.deepEqual(next.walls[wall].widths,[30,40,30]);
    assert.deepEqual(next.walls[wall].materials,['a','b','c']);
  }
});
test('center panels survive mirror presets and have no linked counterpart', () => {
  const base = createCabinConfig();
  assert.equal(base.mirrorMode, 'none');
  assert.equal(Object.values(base.walls).flatMap(wall => wall.materials).length, 9);
  const edited = changeWall(base, 'rearCenter', wall => ({ ...wall, materials: ['a', 'b', 'c'] }), true);
  assert.equal(Object.keys(edited.walls).length, 3);
  assert.deepEqual(edited.walls.left, base.walls.left);
  for (const [mirrorMode, expected] of [['none', 0], ['full', 2.38], ['half', 1.19], ['custom', 1.6]]) {
    const config = { ...edited, mirrorMode };
    assert.equal(mirrorGeometry(config).height, expected);
    assert.deepEqual(config.walls.rearCenter.materials, ['a', 'b', 'c']);
  }
});
test('custom mirror bounds leave room for both reflections and stay inside cabin', () => {
  for (let height = 0; height <= 300; height++) {
    const shape = mirrorGeometry({ ...createCabinConfig(), mirrorMode: 'custom', mirrorHeight: height, topReflection: 62, bottomReflection: 62 });
    assert.ok(shape.height >= .6 && shape.height <= 2.38);
    assert.ok(shape.bottom >= -1.19 && shape.top <= 1.19);
    assert.ok(shape.height - shape.topReflection - shape.bottomReflection > 0);
  }
});
test('an independent material edit touches only its chosen panel', () => {
  const before = createCabinConfig();
  const after = changeWall(before, 'rearCenter', wall => ({ ...wall,
    materials: wall.materials.map((path, i) => i === 1 ? 'new-material' : path) }));
  assert.equal(after.walls.rearCenter.materials[1], 'new-material');
  for (const key of ['left', 'right']) assert.deepEqual(after.walls[key], before.walls[key]);
  assert.notEqual(before.walls.rearCenter.materials[1], 'new-material');
  assert.equal(after.walls.rearCenter.materials[0], before.walls.rearCenter.materials[0]);
  assert.equal(after.walls.rearCenter.materials[2], before.walls.rearCenter.materials[2]);
});
test('linking updates only the matching wall pair', () => {
  const before = createCabinConfig();
  const after = changeWall(before, 'left', wall => ({ ...wall, materials: ['linked','linked','linked'] }), true);
  assert.deepEqual(after.walls.left.materials, after.walls.right.materials);
  assert.deepEqual(after.walls.rearCenter, before.walls.rearCenter);
});
test('only full mirror reflects and its bounds follow the middle of exactly three rear panels', () => {
  for (const widths of [[30,40,30],[15,70,15],[60,15,25]]) for (const mirrorMode of ['none','half','custom','full']) {
    const config=createCabinConfig(); config.walls.rearCenter.widths=widths; config.mirrorMode=mirrorMode;
    const shape=mirrorGeometry(config);
    assert.equal(shape.width, 1.72 * widths[1] / 100);
    assert.ok(Math.abs(shape.x - shape.width / 2 - (-.86 + 1.72 * widths[0] / 100)) < 1e-9);
    assert.equal(shape.topReflection > 0, mirrorMode === 'full');
    assert.equal(shape.bottomReflection > 0, mirrorMode === 'full');
    assert.equal(config.walls.rearCenter.materials.length,3);
  }
});

import { readFileSync } from 'node:fs';
test('every EKA catalog asset is a local valid image and identities are unique', () => {
  const catalog = JSON.parse(readFileSync(new URL('../src/data/ekaMaterials.json', import.meta.url)));
  assert.equal(new Set(catalog.map(item => item.id)).size, 38);
  assert.deepEqual(catalog.reduce((counts, item) => ({ ...counts, [item.type]: (counts[item.type] || 0) + 1 }), {}), { paslanmaz: 23, laminant: 8, granit: 3, tavan: 4 });
  for (const item of catalog) for (const key of ['url', 'thumbnail', 'normalMap', 'roughnessMap']) {
    if (!item[key]) continue;
    assert.ok(item[key].startsWith('/kabin-materyalleri/eka/'));
    const bytes = readFileSync(new URL('../public' + item[key], import.meta.url));
    const signature = bytes.subarray(0, 20).toString();
    assert.ok(bytes[0] === 0xff && bytes[1] === 0xd8 || bytes[0] === 0x89 && bytes[1] === 0x50 || signature.startsWith('<svg'), item.id + ' ' + key);
  }
});
