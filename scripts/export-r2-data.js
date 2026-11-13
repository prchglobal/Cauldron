/**
 * Export and package Cauldron house data for Cloudflare R2 hosting.
 *
 * Generates:
 * - public/data/<house>/<dataset>.json
 * - public/data/manifest.json
 *
 * When `npm run build:web` runs, Vite copies `public/` into `dist/`, making both
 * the Web SPA and the remote content API ready to sync directly to Cloudflare R2!
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DATA_DIR = path.resolve(ROOT_DIR, 'public', 'data');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function computeHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
}

async function run() {
  console.log('[R2 Export] Preparing data directory:', PUBLIC_DATA_DIR);
  ensureDir(PUBLIC_DATA_DIR);

  const manifest = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    datasets: {},
  };

  // Helper to save dataset and record in manifest
  function saveDataset(house, name, data) {
    const houseDir = path.join(PUBLIC_DATA_DIR, house);
    ensureDir(houseDir);

    const filePath = path.join(houseDir, `${name}.json`);
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonStr, 'utf8');

    const relPath = `data/${house}/${name}.json`;
    const hash = computeHash(jsonStr);
    manifest.datasets[`${house}_${name}`] = {
      path: relPath,
      hash,
      updatedAt: new Date().toISOString(),
      sizeBytes: Buffer.byteLength(jsonStr),
    };
    console.log(`[R2 Export] Wrote ${relPath} (${hash})`);
  }

  // 1. Gnosis Traditions Metadata
  const gnosisData = {
    houses: ['mandaeism', 'manichaean', 'zoroastrianism'],
    description: 'Dualist Light vs Darkness traditions and practices',
    lastSync: new Date().toISOString(),
  };
  saveDataset('gnosis', 'metadata', gnosisData);

  // 2. Sample Tools Catalog
  const toolsData = {
    tools: [
      { id: 'tarot', name: 'Tarot', route: 'Tarot' },
      { id: 'numerology', name: 'Numerology', route: 'Numerology' },
      { id: 'gematria', name: 'Gematria', route: 'Gematria' },
      { id: 'moon', name: 'Moon Phase', route: 'MoonPhase' },
      { id: 'horoscopes', name: 'Daily Horoscopes', route: 'Horoscopes' },
      { id: 'astrology', name: 'Astrology', route: 'Astrology' },
      { id: 'chakras', name: 'Chakras', route: 'Chakras' },
      { id: 'crystals', name: 'Crystals', route: 'Crystals' },
    ],
  };
  saveDataset('tools', 'catalog', toolsData);

  // 3. Write manifest.json
  const manifestPath = path.join(PUBLIC_DATA_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`[R2 Export] Manifest successfully written to ${manifestPath}`);
}

run().catch((err) => {
  console.error('[R2 Export] Failed:', err);
  process.exit(1);
});
