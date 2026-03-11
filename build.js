const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const minify = args.includes('--minify');
const filteredArgs = args.filter(a => a !== '--minify');

async function buildProvider(name) {
  const srcDir = path.join(__dirname, 'src', name);
  const outFile = path.join(__dirname, 'providers', `${name}.js`);

  if (!fs.existsSync(srcDir)) {
    console.error(`[build] No se encontró src/${name}/`);
    process.exit(1);
  }

  fs.mkdirSync(path.join(__dirname, 'providers'), { recursive: true });

  console.log(`[build] Building ${name}...`);

  await esbuild.build({
    entryPoints: [path.join(srcDir, 'index.js')],
    bundle: true,
    outfile: outFile,
    platform: 'neutral',
    format: 'cjs',
    target: ['es2016'],
    minify,
    external: ['axios', 'crypto-js'],
    define: {},
  });

  // Transpilar async/await para Hermes
  const code = fs.readFileSync(outFile, 'utf8');
  const transpiled = await esbuild.transform(code, {
    target: 'es2016',
    loader: 'js',
  });

  fs.writeFileSync(outFile, transpiled.code);
  console.log(`[build] ✓ ${outFile} (${(transpiled.code.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  const providerNames = filteredArgs.length > 0 ? filteredArgs : ['lamovie', 'cinecalidad','embed69'];

  for (const name of providerNames) {
    await buildProvider(name);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
