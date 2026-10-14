import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-candidates';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const SETS = [
  {
    'indian man sketching ideas notebook office': ['4238498', '4238483', '545067', '12911289', '10474140', '5124844', '7963840', '7278869', '6476806', '10474153', '4443121', '12903124'],
    'indian team meeting laptop research office': ['7691693', '5253942', '7988663', '7691707', '7108697', '7691696', '7550396', '7710156', '6147027', '12903181', '3184661', '3860813'],
    'cad design engineer computer screen 3d': ['19895882', '3913017', '3862372', '15764116', '3912948', '3862367', '7504599', '3862379', '7504746', '5904081', '19895919', '19149826'],
    'cnc machine mold factory india': ['8956445', '8865187', '32972129', '28929510', '7480241', '7480239', '28929513', '33748028', '10119310', '14805032', '38852436', '38852437'],
    'electronics testing oscilloscope lab engineer': ['7858287', '7858289', '7858297', '18471567', '7858300', '34132693', '7858288', '7858293', '7858291', '7858299', '7858294', '19895784'],
    'indian factory worker blue uniform': ['31321047', '31112186', '31336007', '31259217', '31112185', '31335982', '31212947', '31251581', '31335999', '31335985', '31336018', '31336015'],
    'electronics factory india workers': ['31321061', '31321057', '31047142', '31321056', '31321059', '31212954', '31259265', '31047145', '31336008', '31047158', '32399719', '31321058'],
    'cleanroom worker india': ['10514721', '10514768', '31090802', '5118462', '33514502', '38688812', '9894216', '4177016', '9574572', '8413094', '9894207', '9893834'],
  },
  {
    'pcb assembly line worker factory': ['5554948', '31091544', '36522029', '31336029', '32048386', '31336009', '5554949', '31336008', '31090808', '31335994', '39351225', '31336018'],
    'quality inspection electronics factory india': ['31090818', '36594160', '32399715', '35290693', '31030919', '31112180', '31030921', '31336024', '31031037', '31090804', '31335983', '31112229'],
    'packing boxes warehouse worker india': ['31112254', '39351270', '39351202', '4487484', '4487383', '31112245', '36256798', '4483864', '6170402', '6170398', '39351218', '8069547'],
    'business analytics dashboard computer india': ['34069', '139387', '577195', '12969403', '7013070', '38246349', '35501997', '8636589', '38906370', '4405384', '31738798', '577210'],
    'customer support agent headset india': ['4267526', '13062478', '4267524', '13062477', '4267473', '7709179', '7709255', '5453809', '7681839', '8866823', '7709231', '8867177'],
    'woman engineer india factory': ['31336020', '31336016', '31336011', '31199526', '31212943', '31336010', '31321057', '31336030', '31321061', '31335988', '31336019', '32845680'],
    'indian technicians laboratory': ['9574556', '8851456', '9243558', '9408640', '9243716', '18689301', '8533136', '34642915', '38145551', '8851626', '8442371', '8442366'],
    'smartphone repair technician india': ['6755075', '6754839', '33958627', '6755056', '33755641', '31862950', '13629278', '35290682', '6755049', '10568286', '6755137', '35155421'],
  },
];

const meta = {};
const jobs = [];
for (const set of SETS) {
  for (const [query, ids] of Object.entries(set)) {
    for (const id of ids) {
      if (meta[id]) {
        meta[id].push(query);
        continue;
      }
      meta[id] = [query];
      jobs.push(id);
    }
  }
}

await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, '_meta.json'), JSON.stringify(meta, null, 2));

async function download(id) {
  const urls = [
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpg?auto=compress&cs=tinysrgb&w=1600`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA, referer: 'https://www.pexels.com/' } });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 8000) continue;
      await writeFile(path.join(OUT, `${id}.jpg`), buf);
      return true;
    } catch {}
  }
  console.log(`  x ${id}`);
  return false;
}

let ok = 0;
for (let i = 0; i < jobs.length; i += 8) {
  const r = await Promise.all(jobs.slice(i, i + 8).map(download));
  ok += r.filter(Boolean).length;
}
console.log(`ids=${jobs.length} downloaded=${ok}`);
