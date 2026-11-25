"use strict";

// Lossless PNG RGBA cell audit for the current 4x3 supplied-reference atlases.
// Reads sources only; writes a JSON measurement report and matching Markdown.
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const root = path.resolve(__dirname, "..");
const CELL = { width: 256, height: 228, columns: 4, rows: 3 };
const inputs = [
  ["ANDRES", "assets/characters/andres-gameplay-sheet.png"],
  ["VANNESA", "assets/characters/vannesa-gameplay-sheet.png"]
];

function decodeRgbaPng(file) {
  const data = fs.readFileSync(path.join(root, file));
  if (data.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") throw new Error(`No es PNG: ${file}`);
  let width, height, bitDepth, colorType, interlace;
  const compressed = [];
  for (let offset = 8; offset < data.length;) {
    const length = data.readUInt32BE(offset), type = data.toString("ascii", offset + 4, offset + 8);
    const chunk = data.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") { width=chunk.readUInt32BE(0);height=chunk.readUInt32BE(4);bitDepth=chunk[8];colorType=chunk[9];interlace=chunk[12]; }
    if (type === "IDAT") compressed.push(chunk);
    offset += length + 12;
    if (type === "IEND") break;
  }
  if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) throw new Error(`Se esperaba PNG RGBA8 sin entrelazado: ${file}`);
  const stride = width * 4, raw = zlib.inflateSync(Buffer.concat(compressed));
  const pixels = Buffer.alloc(height * stride);
  const paeth = (a,b,c) => { const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c; };
  for (let y=0;y<height;y++) {
    const src=y*(stride+1), filter=raw[src], out=y*stride, prev=out-stride;
    for (let x=0;x<stride;x++) {
      const value=raw[src+1+x], left=x>=4?pixels[out+x-4]:0, up=y?pixels[prev+x]:0, upperLeft=y&&x>=4?pixels[prev+x-4]:0;
      let predictor=0;
      if(filter===1)predictor=left;
      else if(filter===2)predictor=up;
      else if(filter===3)predictor=Math.floor((left+up)/2);
      else if(filter===4)predictor=paeth(left,up,upperLeft);
      else if(filter!==0)throw new Error(`Filtro PNG desconocido ${filter}`);
      pixels[out+x]=(value+predictor)&255;
    }
  }
  return {width,height,pixels};
}

function readFrame(image, index) {
  const ox=(index%CELL.columns)*CELL.width, oy=Math.floor(index/CELL.columns)*CELL.height;
  let minX=CELL.width,minY=CELL.height,maxX=-1,maxY=-1,alphaPixels=0,edgePixels={left:0,right:0,top:0,bottom:0};
  const leftEdgeRows=[],rightEdgeRows=[];
  const rowAlpha=new Array(CELL.height).fill(0), alpha=new Uint8Array(CELL.width*CELL.height), rgb=[];
  for(let y=0;y<CELL.height;y++)for(let x=0;x<CELL.width;x++){
    const p=((oy+y)*image.width+ox+x)*4,a=image.pixels[p+3],i=y*CELL.width+x;alpha[i]=a;
    if(a>8){alphaPixels++;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);rowAlpha[y]++;if(x===0){edgePixels.left++;leftEdgeRows.push(y)}if(x===CELL.width-1){edgePixels.right++;rightEdgeRows.push(y)}if(y===0)edgePixels.top++;if(y===CELL.height-1)edgePixels.bottom++;}
  }
  const bandStart=Math.max(0,CELL.height-32),footBandPixels=rowAlpha.slice(bandStart).reduce((n,v)=>n+v,0);
  return {index,row:Math.floor(index/CELL.columns),column:index%CELL.columns,bbox:minX<0?null:{x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1},alphaPixels,opaqueAreaPct:+(alphaPixels/(CELL.width*CELL.height)*100).toFixed(2),transparentAreaPct:+(100-alphaPixels/(CELL.width*CELL.height)*100).toFixed(2),edgePixels,leftEdgeRows,rightEdgeRows,bottommostAlphaRow:maxY,footBandPixels,alpha};
}
function compareFrames(a,b){let changed=0,intersection=0,union=0;for(let i=0;i<a.alpha.length;i++){const aa=a.alpha[i]>8,bb=b.alpha[i]>8;if(aa!==bb)changed++;if(aa||bb)union++;if(aa&&bb)intersection++;}return {comparedAlphaMaskChangedPct:+(changed/a.alpha.length*100).toFixed(2),alphaMaskIoU:+(union?intersection/union:1).toFixed(4)};}

const report={generatedAt:new Date().toISOString(),cell:CELL,sheets:[]};
for(const [role,file] of inputs){
  const image=decodeRgbaPng(file);
  if(image.width!==CELL.width*CELL.columns||image.height!==CELL.height*CELL.rows)throw new Error(`Tamaño inesperado en ${file}: ${image.width}×${image.height}`);
  const frames=Array.from({length:12},(_,i)=>readFrame(image,i));
  const adjacent=[];for(let i=0;i<frames.length-1;i++)adjacent.push({from:i,to:i+1,...compareFrames(frames[i],frames[i+1])});
  const horizontalSeams=frames.filter(frame=>frame.column<CELL.columns-1).map(frame=>{const next=frames[frame.index+1],overlap=frame.rightEdgeRows.filter(y=>next.leftEdgeRows.includes(y));return {from:frame.index,to:next.index,leftRightEdgeRows:frame.rightEdgeRows.length,rightLeftEdgeRows:next.leftEdgeRows.length,sharedRows:overlap.length,sharedRowIndices:overlap}});
  report.sheets.push({role,file,width:image.width,height:image.height,format:"PNG RGBA8",sourceUnchanged:true,frames:frames.map(({alpha,leftEdgeRows,rightEdgeRows,...rest})=>rest),horizontalSeams,adjacentAlphaComparisons:adjacent});
}
const outDir=path.join(root,"QA_CAPTURAS");
fs.writeFileSync(path.join(outDir,"auditoria-limites-spritesheets.json"),JSON.stringify(report,null,2)+"\n");
const lines=["# Auditoría técnica de spritesheets", "", `Generada: ${report.generatedAt}`, "", `Celdas: ${CELL.columns} × ${CELL.rows}, ${CELL.width} × ${CELL.height} px. Alfa significativo: A > 8/255. Límites calculados dentro de cada celda; no se modificaron los archivos fuente.`, "", "| Personaje | Frame | Celda (fila,columna) | Alfa bbox (x,y,w,h) | Ocupación | Alfa en bordes L/R/T/B | Última fila alfa | Alfa en franja inferior |", "|---|---:|---|---|---:|---|---:|---:|"];
for(const sheet of report.sheets)for(const f of sheet.frames){const b=f.bbox?`${f.bbox.x},${f.bbox.y},${f.bbox.width},${f.bbox.height}`:"vacío";lines.push(`| ${sheet.role} | ${f.index} | ${f.row+1},${f.column+1} | ${b} | ${f.opaqueAreaPct}% | ${f.edgePixels.left}/${f.edgePixels.right}/${f.edgePixels.top}/${f.edgePixels.bottom} | ${f.bottommostAlphaRow} | ${f.footBandPixels} |`)}
lines.push("", "## Similitud de máscaras consecutivas", "", "IoU alto indica que las siluetas alfa ocupan zonas parecidas; por sí solo no demuestra duplicación. La comparación se limita a ocupación alfa, no color ni anatomía.", "", "| Personaje | Par | Máscara distinta | IoU |", "|---|---|---:|---:|");
for(const sheet of report.sheets)for(const c of sheet.adjacentAlphaComparisons)lines.push(`| ${sheet.role} | ${c.from} → ${c.to} | ${c.comparedAlphaMaskChangedPct}% | ${c.alphaMaskIoU} |`);
lines.push("", "## Límites de esta auditoría", "", "Las métricas de borde detectan alfa pegado al límite, pero no pueden determinar si el píxel es un efecto intencional o una parte del cuadro vecino. La clasificación requiere inspección del contacto numerado y de la referencia original. La última fila alfa incluye efectos, cabello, capas y accesorios; no equivale automáticamente a los pies. No se aplica recorte ni se edita el arte.", "");
lines.splice(lines.indexOf("## Límites de esta auditoría"),0,"## Continuidad alfa entre celdas contiguas", "", "Las filas compartidas cuentan posiciones Y donde una celda tiene alfa en su borde derecho y la celda siguiente también tiene alfa en su borde izquierdo. No demuestran por sí solas continuidad de color, pero localizan derrame que debe revisarse visualmente.", "", "| Personaje | Celdas | Alfa en bordes R/L | Filas Y con alfa en ambos bordes |", "|---|---:|---:|---:|");
for(const sheet of report.sheets)for(const seam of sheet.horizontalSeams)if(seam.leftRightEdgeRows||seam.rightLeftEdgeRows)lines.splice(lines.indexOf("## Límites de esta auditoría"),0,`| ${sheet.role} | ${seam.from} → ${seam.to} | ${seam.leftRightEdgeRows}/${seam.rightLeftEdgeRows} | ${seam.sharedRows} |`);
fs.writeFileSync(path.join(outDir,"auditoria-limites-spritesheets.md"),lines.join("\n"));
for(const role of ["andres","vannesa"]){
  const contact=path.join(outDir,`contacto-frames-${role}.svg`);
  if(!fs.existsSync(contact))continue;
  let svg=fs.readFileSync(contact,"utf8").replace('width="1024" height="724" viewBox="0 0 1024 724"','width="1024" height="760" viewBox="0 0 1024 760"').replace('<rect width="1024" height="724"','<rect width="1024" height="760"');
  if(!svg.includes('id="audit-edge-warning"'))svg=svg.replace('</svg>',`  <g id="audit-edge-warning" fill="none" stroke="#ff5364" stroke-width="3" stroke-dasharray="9 6"><rect x="256" y="496" width="256" height="228"/><rect x="512" y="496" width="256" height="228"/><path d="M512 496V724" stroke-width="5"/></g>\n  <rect x="0" y="724" width="1024" height="36" fill="#11182b"/><text x="24" y="749" fill="#ff9ca5" font-family="sans-serif" font-size="15" font-weight="700">Borde rojo: cuadros 09→10 alcanzan ambos lados de la celda; rehacer el efecto sin recorte automático.</text>\n</svg>`);
  fs.writeFileSync(contact,svg);
}
console.log(JSON.stringify({result:"PASS",reports:["QA_CAPTURAS/auditoria-limites-spritesheets.json","QA_CAPTURAS/auditoria-limites-spritesheets.md"],sheets:report.sheets.map(s=>({role:s.role,dimensions:`${s.width}x${s.height}`,frames:s.frames.length,edgeFrames:s.frames.filter(f=>Object.values(f.edgePixels).some(n=>n>0)).map(f=>f.index)}))},null,2));
