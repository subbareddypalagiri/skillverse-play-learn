#!/usr/bin/env node

/**
 * Combined Seed Script
 * Run both seedAll.js and seedReels.js in sequence
 * Usage: node runSeeds.js
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`\n📌 Running: ${path.basename(scriptPath)} ${args.join(' ')}`);
    console.log('━'.repeat(60));
    
    const child = spawn('node', [scriptPath, ...args], {
      stdio: 'inherit',
      cwd: path.dirname(scriptPath)
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`✅ ${path.basename(scriptPath)} completed successfully\n`);
        resolve();
      } else {
        console.log(`❌ ${path.basename(scriptPath)} failed with code ${code}\n`);
        reject(new Error(`Script failed: ${scriptPath}`));
      }
    });

    child.on('error', (err) => {
      console.error(`❌ Error running ${path.basename(scriptPath)}:`, err);
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log('\n🚀 SkillVerse Database Seeding');
    console.log('═'.repeat(60));

    // Step 1: Run seedAll.js
    console.log('\n[Step 1/2] Creating courses with Web Development videos...');
    await runScript(path.join(__dirname, 'seeds', 'seedAll.js'));

    // Step 2: Run seedReels.js with --force
    console.log('\n[Step 2/2] Creating reels from Web Development course...');
    await runScript(path.join(__dirname, 'seeds', 'seedReels.js'), ['--force']);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ All seeding completed successfully!');
    console.log('═'.repeat(60));
    console.log('\n📝 Next steps:');
    console.log('   1. Start the backend: npm run dev');
    console.log('   2. Navigate to Vibe section in your app');
    console.log('   3. You should see 10 Web Development reels');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

main();
