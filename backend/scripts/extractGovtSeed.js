import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDataPath = path.resolve(__dirname, '../../frontend/src/data/govtJobsData.ts');
const outputPath = path.resolve(__dirname, '../data/govt_jobs_seed.json');

const content = fs.readFileSync(frontendDataPath, 'utf8');

// Find start and end of govtJobNotifications array
const startTag = 'export const govtJobNotifications: GovtJobNotification[] = [';
const startIdx = content.indexOf(startTag);

if (startIdx === -1) {
  console.error('Could not find start of govtJobNotifications in ' + frontendDataPath);
  process.exit(1);
}

const sliceFrom = content.slice(startIdx + startTag.length - 1);
// Find matching closing bracket
let depth = 0;
let endIdx = -1;

for (let i = 0; i < sliceFrom.length; i++) {
  const ch = sliceFrom[i];
  if (ch === '[') depth++;
  else if (ch === ']') {
    depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
  }
}

if (endIdx === -1) {
  console.error('Could not find matching closing bracket');
  process.exit(1);
}

const arrayStr = sliceFrom.slice(0, endIdx + 1);

// Parse using Function constructor
const parsed = new Function(`return ${arrayStr}`)();

fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2), 'utf8');
console.log(`Successfully extracted ${parsed.length} government notifications to ${outputPath}`);
