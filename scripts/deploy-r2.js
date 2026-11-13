/**
 * Deploy Cauldron Web App to Cloudflare R2 bucket at prefix 'cauldron'
 * Custom domain: apps.prch.site/cauldron
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const nonFlagArgs = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const BUCKET_NAME = process.env.R2_BUCKET_NAME || nonFlagArgs[0] || 'airball';
const PREFIX = process.env.R2_PREFIX !== undefined ? process.env.R2_PREFIX : (nonFlagArgs[1] !== undefined ? nonFlagArgs[1] : 'cauldron');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.css': 'text/css; charset=utf-8',
  '.map': 'application/json',
};

function getAllFiles(dir, baseDir = dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, baseDir));
    } else {
      const relKey = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push({ fullPath, relKey });
    }
  }
  return results;
}

console.log('📦 Rebuilding web bundle with base /cauldron/...');
execSync('npm run export:data && npm run build:web', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log(`\n☁️  Using Cloudflare R2 bucket "${BUCKET_NAME}" (apps.prch.site)...`);

const files = getAllFiles(DIST_DIR);
console.log(`🚀 Uploading ${files.length} files from dist/ to R2 "${BUCKET_NAME}" prefix "${PREFIX}"...`);

const FAST_MODE = process.argv.includes('--fast') || process.argv.includes('--only-code');

let uploaded = 0;
for (const { fullPath, relKey } of files) {
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
  const targetKey = PREFIX ? `${PREFIX.replace(/\/+$/, '')}/${relKey}` : relKey;
  
  if (FAST_MODE && ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.ico', '.ttf'].includes(ext)) {
    continue;
  }

  uploaded++;
  process.stdout.write(`   [${uploaded}/${files.length}] Uploading ${targetKey}... `);
  try {
    execSync(
      `npx --yes wrangler r2 object put "${BUCKET_NAME}/${targetKey}" --file "${fullPath}" --content-type "${contentType}" --remote`,
      { cwd: ROOT_DIR, stdio: 'pipe' }
    );
    console.log('✅');
  } catch (err) {
    console.log('❌');
    console.error(err.message);
  }
}

if (PREFIX) {
  const cleanPrefix = PREFIX.replace(/\/+$/, '');
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    console.log(`   -> Uploading index routing aliases: "${cleanPrefix}" and "${cleanPrefix}/"...`);
    try {
      execSync(
        `npx --yes wrangler r2 object put "${BUCKET_NAME}/${cleanPrefix}" --file "${indexHtmlPath}" --content-type "text/html; charset=utf-8" --remote`,
        { cwd: ROOT_DIR, stdio: 'pipe' }
      );
      execSync(
        `npx --yes wrangler r2 object put "${BUCKET_NAME}/${cleanPrefix}/" --file "${indexHtmlPath}" --content-type "text/html; charset=utf-8" --remote`,
        { cwd: ROOT_DIR, stdio: 'pipe' }
      );
      console.log('✅ Index aliases set.');
    } catch (err) {
      console.error('Failed setting alias:', err.message);
    }
  }
}

console.log(`\n🎉 Cauldron is now live at https://apps.prch.site/${PREFIX}/ !`);
