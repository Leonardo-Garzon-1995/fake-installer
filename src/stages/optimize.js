// Simulates an asset optimization / build pipeline sequence

const { randomPackageName, randomVersion, randomSourceFile, randomAssetName, randomHex } = require('../utils/random')
const { randomInt, randomFloat, randomDelay, randomPick, buildMiniBar, } = require('../utils/helpers')
const { spinner, stepList, progressBar, progressBarSequence, percentTicker, byteCounter } = require('../utils/progress')
const {
    println,
    spacer,
    divider,
    header,
    pkg,
    success,
    muted,
    error,
    tagOk,
    tagWarn,
    tagRetry,
    Clrs,
    Styles,
    Combos
} = require('../utils/colors')

// Entry Point

async function run() {
    await printHeader();
    await runTreeShaking();
    await runMinification();
    await runBundling();
    await runImageOptimization();
    await runCachebusting();
    await runGzipCompression();
    await printSummary();
}

// Data

const BUNDLERS = ['webpack 5.91.0', 'esbuild 0.20.2', 'Vite 5.2.0', 'Rollup 4.14.0', 'Parcel 2.12.0'];
const TREE_SHAKE_MODULES = [
    'lodash', 'moment', 'rxjs', 'ramda', 'underscore',
    'date-fns', 'axios', 'uuid', 'chalk', 'yargs',
    'commander', 'inquirer', 'ora', 'boxen', 'figures',
    'got', 'node-fetch', 'cross-fetch', 'isomorphic-fetch'
]
const MINIFIERS = ['terser', 'esbuild', 'swc', 'uglify-js', 'babel-minify']
const IMAGE_FORMATS = ['.png', '.jpg', '.svg', '.webp', '.gif'];
const IMAGE_NAMES = [
    'hero', 'banner', 'logo', 'icon', 'avatar', 'thumbnail',
    'background', 'placeholder', 'spinner', 'loading',
    'error-404', 'success-check', 'warning-triangle'
]
const CHUNK_TYPES = ['entry', 'vendor', 'async', 'shared', 'dynamic'];
const COMPRESSION_ALGOS = ['gzip', 'brotli', 'zstd', 'deflate'];

// HEADER

async function printHeader() {
    const bundler = randomPick(BUNDLERS)
    
    spacer()
    divider()
    println(header(`  OPTIMIZE  ·  ${bundler}  ·  production build`))
    spacer()
    divider()

    await randomDelay(200, 400)
}

// TREE SHAKING

async function runTreeShaking() {
    println(Clrs.cyan('Analysing module graph...'))
    spacer()

    await spinner('Resolving entry points', randomInt(400, 900))
    await spinner('Building dependency graph', randomInt(600, 1400))
    spacer()

    const moduleCount = randomInt(8, 18)
    const modules = Array.from({length: moduleCount}, () => randomPick(TREE_SHAKE_MODULES))
    const unique = [...new Set(modules)]

    println(Styles.bold('Tree-shaking modules:'))
    spacer()

    let totalRemoved =0

    for (const mod of unique) {
        const totalExports = randomInt(20, 200)
        const usedExports = randomInt(1, Math.min(totalExports, 30))
        const removedExports = totalExports - usedExports
        const saving = randomFloat(1.0, 80.0)
        totalRemoved += removedExports

        await randomDelay(60, 180)

        println(
            `   ${Clrs.cyan(mod.padEnd(28))}` +
            Clrs.gray(`${String(usedExports).padStart(3)}/${totalExports} exports used`) +
            `   ${Clrs.yellow(`-${saving} KB`)}`
        )
    }

    spacer()
    println(
        `${tagOk()} Removed ${Styles.bold(String(totalRemoved))} unused exports ` +
        Clrs.yellow(`(-${randomFloat(20.0, 180.0)} KB total)`)
    )
    spacer()
    await randomDelay(300, 500)
}

// MINIFICATION

async function runMinification() {
    const minifier = randomPick(MINIFIERS)

    println(Clrs.cyan(`Minifying with ${minifier}...`))
    spacer()

    const fileCount = randomInt(8, 12)
    const files = Array.from({length: fileCount}, () => randomAssetName()).filter(f => f.endsWith('.js') || f.endsWith('.css'))

    while (files.length < 4) files.push(randomAssetName() + '.js')

    for (const file of files) {
        const originalKB = randomFloat(10.0, 800.0)
        const ratio      = randomFloat(0.25, 0.65, 2);
        const minifiedKB = parseFloat((originalKB * ratio).toFixed(1));
        const savingPct  = Math.round((1 - ratio) * 100);

        await progressBar(
            `  Minifying ${file}`,
            `${originalKB} kB → ${minifiedKB} kB`,
            { steps: randomInt(20, 40), minDelay: 15, maxDelay: 60 }
        )

        println(
            `  ${tagOk()} ${Clrs.cyan(file.padEnd(36))}` +
            Clrs.gray(`${originalKB} kB`) + Clrs.gray(' → ') +
            Clrs.green(`${minifiedKB} kB`) +
            Clrs.yellow(`  (${savingPct}% smaller)`)
        );
        await randomDelay(60, 150);
    }

    spacer();
    const totalSaving = randomFloat(200.0, 1200.0);
    println(
        `${tagOk()} Minification complete  ` +
        Clrs.yellow(`-${totalSaving} kB across ${files.length} files`)
    );
    spacer();
    await randomDelay(300, 500);
}

// Bundling

async function runBundling() {
    println(Clrs.cyan('Bundling chunks...'));
    spacer();
    
    await spinner('Resolving code splitting boundaries', randomInt(400, 900));
    await spinner('Applying scope hoisting',             randomInt(300, 700));
    spacer();
    
    const chunkCount = randomInt(4, 10);
    const chunks     = Array.from({ length: chunkCount }, () => {
        const type   = randomPick(CHUNK_TYPES);
        const hash   = randomHex(8);
        const sizeKB = randomFloat(5.0, 600.0, 1);
        const mods   = randomInt(2, 80);
        return { name: `${type}.${hash}.js`, sizeKB, modules: mods };
    });
    
    println(Styles.bold('Output chunks:'));
    spacer();
    
    let totalKB = 0;
    for (const chunk of chunks) {
        totalKB += chunk.sizeKB;
        const bar = buildMiniBar(chunk.sizeKB, 600);
        println(
        `  ${Clrs.cyan(chunk.name.padEnd(36))}` +
        Clrs.yellow(`${String(chunk.sizeKB).padStart(7)} kB`) +
        Clrs.gray(`  ${bar}`) +
        muted(`  ${chunk.modules} modules`)
        );
        await randomDelay(80, 200);
    }
    
    spacer();
    println(
        `  ${Styles.bold('Total:'.padEnd(36))}` +
        Combos.boldGreen(`${String(totalKB.toFixed(1)).padStart(7)} kB`) +
        Clrs.gray(`  across ${chunkCount} chunks`)
    );
    spacer();
    
    const largeChunks = chunks.filter(c => c.sizeKB > 400);
    if (largeChunks.length > 0) {
        for (const c of largeChunks) {
        println(
            `${tagWarn()} Chunk ${Clrs.cyan(c.name)} is ${Clrs.yellow(c.sizeKB + ' kB')} — consider code splitting`
        );
        }
        spacer();
    }
    
    await randomDelay(300, 500);
}

// IMAGE OPTIMIZATION

async function runImageOptimization() {
    println(Clrs.cyan('Optimizing images...'))
    spacer()

    const count = randomInt(7, 14)
    const images = Array.from({length: count}, () => {
        const name = randomPick(IMAGE_NAMES)
        const ext = randomPick(IMAGE_FORMATS)
        const hash = randomHex(6)
        return `${name}-${hash}${ext}`
    })

    for (const img of images) {
        const originalKB = randomFloat(20.0, 2000.0)
        const ratio = img.endsWith('.svg')
            ? randomFloat(0.5, 0.85, 2)
            : randomFloat(0.2, 0.7, 2)
        const optimizedKB = parseFloat((originalKB * ratio).toFixed(1))
        const savingPct = Math.round((1 - ratio) * 100)

        await randomDelay(80, 250)

        println(
            `   ${tagOk()} ${Clrs.cyan(img.padEnd(36))}` +
            Clrs.gray(`${originalKB} KB`) + Clrs.gray(' → ') +
            Clrs.green(`${optimizedKB} KB`) +
            Clrs.yellow(` (${savingPct}% smaller)`)
        )
    }

    spacer()
    const totalSaving = randomFloat(1.0, 15.0)

    println(`${tagOk()} Optimized ${count} images ${Clrs.yellow(`-${totalSaving} MB total`)}`)
    spacer()

    await randomDelay(300, 500)
}

// Cache Busting

async function runCachebusting() {
    println(Clrs.cyan('Injecting content hashes...'));
    spacer();
    
    await spinner('Computing content hashes', randomInt(300, 700));
    
    const fileCount = randomInt(4, 10);

    for (let i = 0; i < fileCount; i++) {
        const base    = randomAssetName().replace(/\.[^.]+$/, '');
        const ext     = randomPick(['.js', '.css', '.woff2', '.png']);
        const oldName = `${base}${ext}`;
        const hash    = randomHex(8);
        const newName = `${base}.${hash}${ext}`;
    
        await randomDelay(50, 150);
        println(
        `  ${muted(oldName.padEnd(32))} ${Clrs.gray('→')}  ${Clrs.cyan(newName)}`
        );
    }
    
    spacer();
    println(`${tagOk()} Content hashes injected — cache invalidation ready`);
    spacer();
    await randomDelay(200, 400);
}

// Gzip COMPRESSION

async function runGzipCompression() {
    const algo = randomPick(COMPRESSION_ALGOS);
    println(Clrs.cyan(`Compressing assets with ${algo}...`));
    spacer();
    
    await progressBarSequence([
        {
        label:   `Compressing JS bundles   (${algo})`,
        suffix:  () => `${randomFloat(50, 300, 0)} MB/s`,
        options: { steps: randomInt(25, 45), minDelay: 15, maxDelay: 70 },
        },
        {
        label:   `Compressing CSS bundles  (${algo})`,
        suffix:  () => `${randomFloat(50, 300, 0)} MB/s`,
        options: { steps: randomInt(25, 45), minDelay: 15, maxDelay: 70 },
        },
        {
        label:   `Compressing HTML files   (${algo})`,
        suffix:  () => `${randomFloat(50, 300, 0)} MB/s`,
        options: { steps: randomInt(25, 45), minDelay: 15, maxDelay: 70 },
        },
        {
        label:   `Compressing font files   (${algo})`,
        suffix:  () => `${randomFloat(50, 300, 0)} MB/s`,
        options: { steps: randomInt(25, 45), minDelay: 15, maxDelay: 70 },
        },
    ]);
    
    spacer();
    
    const originalMB   = randomFloat(5.0, 40.0, 1);
    const compressedMB = parseFloat((originalMB * randomFloat(0.15, 0.40, 2)).toFixed(1));
    const savingPct    = Math.round((1 - compressedMB / originalMB) * 100);
    
    println(
        `${tagOk()} Compression complete  ` +
        Clrs.gray(`${originalMB} MB`) + Clrs.gray(' → ') +
        Clrs.green(`${compressedMB} MB`) +
        Clrs.yellow(`  (${savingPct}% smaller)`)
    );
    spacer();
    await randomDelay(300, 500);
}

// FINAL SUMMARY

async function printSummary() {
    const buildTime   = randomFloat(8.0, 120.0, 2);
    const totalInput  = randomFloat(20.0, 80.0, 1);
    const totalOutput = parseFloat((totalInput * randomFloat(0.15, 0.45, 2)).toFixed(1));
    const saving      = parseFloat((totalInput - totalOutput).toFixed(1));
    const savingPct   = Math.round((saving / totalInput) * 100);
    
    divider();
    println(success('  ✔  Optimisation complete.'));
    println(
        muted('     ') +
        Clrs.gray(`${totalInput} MB input`) +
        Clrs.gray('  →  ') +
        Combos.boldGreen(`${totalOutput} MB output`) +
        Clrs.yellow(`  (${savingPct}% reduction)`) +
        Clrs.gray(`  ·  ${buildTime}s`)
    );
    divider();
    spacer();
    await randomDelay(500, 1000);
}

module.exports = run