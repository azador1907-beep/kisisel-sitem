const fs=require('fs');const p='src/components/KabinTasarim.jsx';let s=fs.readFileSync(p,'utf8');function r(a,b){if(!s.includes(a))throw Error(a);s=s.replace(a,b)}
r("roughness: 0.34 };","roughness: 0.34, envMapIntensity: 0 };");
r('roughness={choice.roughness} metalness={choice.metalness} envMapIntensity={1.15}', 'roughness={Math.max(0.4, choice.roughness)} metalness={Math.min(0.6, choice.metalness)} envMapIntensity={0.3}');
r('  const panelW = W * config.mirrorWidth / 100;\n  const margin = (W - panelW) / 2;\n','');
r('  const mirror = mirrorGeometry(config);','  const mirror = mirrorGeometry(config);\n  const panelW = mirror.width;');
s=s.replaceAll('metalness={0} side={THREE.DoubleSide}', 'metalness={0} envMapIntensity={0} side={THREE.DoubleSide}');
r("      const rear = side === -1 ? 'rearLeft' : 'rearRight';\n",'');
r('        <PanelWall wall={rear} config={config.walls[rear]} length={margin} position={[side * (panelW / 2 + margin / 2), 0, -D / 2]}\n          selection={selection} onSelect={onSelect} editing={editing} />\n','');
r('config={config.walls.rearCenter} length={panelW}','config={config.walls.rearCenter} length={W}');
r("editing={editing && config.mirrorMode === 'none'}","editing={editing}");
r("{config.mirrorMode !== 'none' && <group onClick=","{config.mirrorMode !== 'none' && <group position={[mirror.x, 0, 0]} onClick=");
r('<SurfaceReflection texture={roofMap} ceiling y={mirror.top - topH / 2} height={topH} width={panelW} />','{topH > 0 && <SurfaceReflection texture={roofMap} ceiling y={mirror.top - topH / 2} height={topH} width={panelW} />}');
r('<meshStandardMaterial color="#b9cbd1" roughness={0.8} metalness={0} />','<meshBasicMaterial color="#b9cbd1" />');
r('<SurfaceReflection texture={floorMap} tint={floorChoice.color} ceiling={false} y={mirror.bottom + bottomH / 2} height={bottomH} width={panelW} />','{bottomH > 0 && <SurfaceReflection texture={floorMap} tint={floorChoice.color} ceiling={false} y={mirror.bottom + bottomH / 2} height={bottomH} width={panelW} />}');
const a=s.indexOf('    </group>}\n    {[-1, 1].map(side => <MetalBox key={side} position={[side * (panelW');const b=s.indexOf('    <Rail position={[0, railY',a);if(a<0||b<0)throw Error('frame block');s=s.slice(0,a)+`      {[-1, 1].map(side => <MetalBox key={side} position={[side * panelW / 2, (mirror.top + mirror.bottom) / 2, -D / 2 + 0.02]} size={[0.006, mirror.height, 0.012]} />)}
      {[mirror.top, mirror.bottom].map(y => <MetalBox key={y} position={[0, y, -D / 2 + 0.021]} size={[panelW, 0.009, 0.012]} />)}
    </group>}
`+s.slice(b);
const c=s.indexOf("  const [collection, setCollection]");const d=s.indexOf('    {entries.map',c);s=s.slice(0,c)+`  const entries = [...ekaMaterials.filter(item => item.type === type).map(item => item.id), ...Array.from({ length: count }, (_, i) => materialPath(type, i + 1))];
  return <><div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-6 gap-2">
`+s.slice(d);
r("aria-label={collection === 'eka' ? `EKA · ${materialName(path)}` : `${type}-${i + 1}`}","aria-label={materialName(path)}");
r("const selectedLength = selection.wall === 'rearCenter' ? W * config.mirrorWidth / 100 : selection.wall.startsWith('rear') ? W * (1 - config.mirrorWidth / 100) / 2 : D;", "const selectedLength = selection.wall === 'rearCenter' ? W : D;");
r('15 bağımsız bölüm','9 bağımsız bölüm');
s=s.replaceAll('Math.round(W * config.mirrorWidth)','Math.round(mirrorGeometry(config).width * 100)');
r('<RangeControl label="Orta alan / ayna genişliği" value={config.mirrorWidth} min={32} max={64} onChange={value => change(old => ({ ...old, mirrorWidth: value }), \'mirror-width\')} onFinish={finishGesture} />','<RangeControl label="Orta panel / ayna genişliği" value={config.walls.rearCenter.widths[1]} min={15} max={70} onChange={value => change(old => changeWall(old, \'rearCenter\', wall => ({ ...wall, widths: resizePanels(wall.widths, 1, value) })), \'mirror-width\')} onFinish={finishGesture} />');
r('<details className="text-xs border-t border-slate-100 pt-4"><summary',"{config.mirrorMode === 'full' && <details className=\"text-xs border-t border-slate-100 pt-4\"><summary");
r('</div></details>','</div></details>}');
r('Kısa aynalarda yansımalar ayna boyuna göre otomatik sınırlanır.','Yansıma yalnız tam boy aynada gösterilir.');
r('Arka ortada üç bağımsız panel var. Aynayı ekleyebilir, boyunu değiştirebilir veya kaldırabilirsin; panel seçimlerin korunur.','Arka duvar toplam üç dikey panelden oluşur. Ayna orta panele eklenir; panel seçimlerin korunur. Yansıma yalnız tam boy aynada görünür.');
r('style={{ height: `${mirrorGeometry(config).height / H * 100}%` }}','style={{ height: `${mirrorGeometry(config).height / H * 100}%`, left: `${config.walls.rearCenter.widths[0]}%`, width: `${config.walls.rearCenter.widths[1]}%` }}');
r('absolute top-0 inset-x-0 bg-gradient','absolute top-0 bg-gradient');
fs.writeFileSync(p,s)
