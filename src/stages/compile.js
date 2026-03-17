//  Compile simulation stage
// Simulates a realistic C/C++/Rust/Go compilation sequence

const { randomPackageName, randomVersion, randomSourceFile } = require('../utils/random')
const { randomInt, randomFloat, randomDelay, randomPick} = require('../utils/helpers')
const { spinner, stepList } = require('../utils/progress')
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
    tagRetry,
    Clrs,
    Styles,
    Combos
} = require('../utils/colors')

// Entry point -----------------------------------------------------

async function run() {
    await printHeader()
    await runConfigure()
    await runMake()
    await compileSourceFiles()
    await linkBinaries()
    await runMakeInstall()
    await printSummary()
}

// Data

const COMPILERS = ['gcc', 'g++', 'clang', 'clang++', 'rustc', 'go build'];
const OPTIMIZATIONS = ['-O2', '-O3', '-Os', '-Og', '-O1'];
const FLAGS = [
    '-Wall', '-Wextra', '-Wpedantic', '-Werror', '-fPIC',
    '-march=native', '-mtune=generic', '-fstack-protector',
    '-D_FORTIFY_SOURCE=2', '-fno-strict-aliasing',
    '-DNDEBUG', '-DRELEASE', '-D_GNU_SOURCE'
    ];
const MAKE_TARGETS = [
    'all', 'libs', 'shared', 'static', 'install', 'modules',
    'plugins', 'tools', 'utils', 'docs', 'tests',
];
const LINKERS = ['ld', 'lld', 'gold', 'mold'];
const LIBRARIES = [
    '-lssl', '-lcrypto', '-lz', '-lm', '-lpthread', '-ldl',
    '-lrt', '-lutil', '-lcurl', '-lxml2', '-lsqlite3',
    '-lpcre2-8', '-lglib-2.0', '-lgio-2.0'
];
const CONFIGURE_FEATURES = [
    '--enable-shared', '--disable-static', '--enable-optimizations',
    '--with-ssl=openssl', '--with-zlib', '--without-debug',
    '--enable-ipv6', '--with-threads=posix', '--enable-unicode',
    '--prefix=/usr/local', '--sysconfdir=/etc', '--localstatedir=/var',
];
const ARCH = ['x86_64-linux-gnu', 'aarch64-linux-gnu', 'x86_64-pc-linux-musl'];
const WARNING_MESSAGES = [
    'implicit declaration of function',
    'unused variable',
    'comparison between signed and unsigned',
    'deprecated function call',
    'missing initializer for field',
    'suggest parentheses around assignment',
    'format string is not a string literal',
    'cast from pointer to integer of different size',
];

// Header

async function printHeader() {
    spacer()
    divider()
    println(header('  COMPILE  ·  GNU Make 4.3  ·  GCC 12.3.0'))
    spacer()
    divider()

    await randomDelay(200, 400)
}

// CONFIGURE

async function runConfigure() {
    const projectName = randomPackageName().replace(/^(lib|node-|python3-)/, '')
    const version = randomVersion()
    const arch = randomPick(ARCH)
    const features = Array.from({length: randomInt(4, 8)}, () => randomPick(CONFIGURE_FEATURES))
    const uniqueFeatures = [...new Set(features)]

    println(Clrs.cyan(`checking build system type... ${arch}`))
    await randomDelay(100, 250)
    println(Clrs.cyan(`checking host system type... ${arch}`));
    await randomDelay(80, 200);
    println(Clrs.cyan(`checking target system type... ${arch}`));
    await randomDelay(80, 200);
    spacer();

    println(Clrs.cyan('checking for gcc... ') + Clrs.green('gcc'));
    await randomDelay(60, 150);
    println(Clrs.cyan('checking whether the C compiler works... ') + Clrs.green('yes'));
    await randomDelay(60, 150);
    println(Clrs.cyan('checking for C compiler default output file name... ') + Clrs.green('a.out'));
    await randomDelay(60, 150);
    println(Clrs.cyan('checking for suffix of executables... ') + Clrs.green('(none)'));
    await randomDelay(60, 150);
    println(Clrs.cyan('checking whether we are cross compiling... ') + Clrs.green('no'));
    await randomDelay(60, 150);
    spacer();

    // Feature checks
    const checks = [
        ['stdlib.h', true],
        ['string.h', true],
        ['unistd.h', true],
        ['sys/socket.h', true],
        ['openssl/ssl.h', Math.random() > 0.2],
        ['zlib.h', Math.random() > 0.1],
        ['pthread.h', true],
        ['dlfcn.h', true],
    ];

    for (const [header_name, found] of  checks) {
        println(
            Clrs.cyan(`Checking for ${header_name}...`) +
            (found ? Clrs.green('yes') : Combos.boldYellow('no'))
        )

        await randomDelay(50, 150)
    }

    spacer();
    println(Styles.bold(`configure: creating ./config.status`));
    await randomDelay(100, 300);
    println(Styles.bold(`config.status: creating Makefile`));
    await randomDelay(100, 200);
    println(Styles.bold(`config.status: creating src/config.h`));
    await randomDelay(100, 200);
    spacer();
    
    println(muted(`  Project : ${projectName} v${version}`));
    println(muted(`  Features: ${uniqueFeatures.join(' ')}`));
    spacer();
    await randomDelay(300, 600);
}

// MAKE

async function runMake() {
    const target = randomPick(MAKE_TARGETS)
    const jobs = randomPick([2, 4, 8, 16])

    println(Clrs.cyan(`make -j${jobs} ${target}`))
    spacer()
    await randomDelay(200, 500)
}

// COMPILE SOURCE FILES
async function compileSourceFiles() {
    const compiler = randomPick(COMPILERS)
    const opt = randomPick(OPTIMIZATIONS)
    const fileCount = randomInt(12, 35)
    const flagSubset = Array.from(
        {length: randomInt(3, 6)},
        () => randomPick(FLAGS)
    )
    const flagStr = flagSubset.join(' ')

    let warnings = 0
    let errors = 0

    for (let i = 0; i < fileCount; i++) {
        const srcFile = randomSourceFile()
        const objFile = srcFile.replace(/\.(c|cpp|rs|go|cc|cxx)$/, '.o')
        const line = `  ${muted(compiler)} ${Clrs.yellow(opt)} ${Clrs.gray(flagStr)} ${Clrs.cyan('-c')} ${pkg(srcFile)} ${Clrs.gray('-o')} ${muted(objFile)}`
        
        println(line)
        await randomDelay(80, 350)

        // Randomly emmit warnings
        if (Math.random() < 0.2) {
            warnings++

            const warningMsg = randomPick(WARNING_MESSAGES)
            const lineNum = randomInt(10, 400)
            const colNum = randomInt(1, 80)

            println(
                Combos.boldYellow(`    ${srcFile}:${lineNum}:${colNum}: warning: `) +
                Clrs.yellow(warningMsg) +
                Clrs.gray(` [-W${randomPick(['unused', 'implicit', 'format', 'cast'])}]`)
            )

            await randomDelay(40, 120)
        }

        // Very rarely - emmit error that retries and recovers
        if (Math.random() < 0.04 && errors === 0) {
            errors++

            const lineNum = randomInt(10, 400)

            println(
                Combos.boldRed(`    ${srcFile}:${lineNum}:1: error: `) +
                error(`'${randomPick(['NULL', 'size_t', 'uint8_t', 'off_t'])}' undeclared`)
            )

            await randomDelay(300, 600);
            println(tagRetry() + Clrs.gray(' Regenerating headers and retrying...'));
            await spinner('Re-running preprocessor...', randomInt(800, 1500));
            println(tagOk() + Clrs.gray(` ${srcFile} recovered — continuing`));
            await randomDelay(200, 400);
        }
    }

    spacer()
    println(
        `${tagOk()} Compiled ${Styles.bold(String(fileCount))} source files  ` +
        (warnings > 0 ? Combos.boldYellow(`${warnings} warning(s)`) : Clrs.green('0 warnings')) +
        Clrs.gray('  ·  ') +
        (errors > 0 ? Combos.boldRed(`${errors} error(s) recovered`) : Clrs.green('0 errors'))
    );

    spacer();
    await randomDelay(300, 600);
}

// Link Binaries

async function linkBinaries() {
    const linker = randomPick(LINKERS)
    const libSubset = Array.from({length: randomInt(4, 8)}, ()  => randomPick(LIBRARIES))
    const uniqueLibs = [...new Set(libSubset)]
    const outName = randomPackageName().replace(/^(lib|node-|python3-)/, '')
    const outFile = `lib${outName}.so.${randomInt(1, 9)}.${randomInt(0, 20)}.${randomInt(0, 5)}`

    println(Clrs.cyan(`Linking with ${linker}...`));
    await randomDelay(100, 250);

    println(
        muted(`  ${linker} -shared -fPIC `) +
        Clrs.gray(uniqueLibs.join(' ')) +
        muted(` -o ${outFile}`)
    )
    await randomDelay(200, 500);

    await spinner(`Linking ${outFile}`, randomInt(800, 2000))

    println(`${tagOk()} Linked ${Clrs.cyan(outFile)}  ${muted(`(${randomFloat(0.5, 24.0, 1)} MB)`)}`)
    spacer()

    // Symlinks
    const soBase = outFile.split('.so.')[0] + '.so'

    println(muted(`  Creating symlink: ${soBase} → ${outFile}`));
    await randomDelay(100, 300);
    println(muted(`  Creating symlink: ${soBase}.${randomInt(1,9)} → ${outFile}`));
    await randomDelay(100, 300);
    println(`${tagOk()} Symlinks created`);
    spacer();
    await randomDelay(200, 400);
}

// MAKE INSTALL

const INSTALL_DIRS = [
    '/usr/local/lib',
    '/usr/local/include',
    '/usr/local/bin',
    '/usr/local/share/man/man1',
    '/usr/local/share/doc',
    '/etc/ld.so.conf.d',
];

async function runMakeInstall() {
    println(Clrs.cyan('make install'))
    spacer()

    const steps =[]
    const count = randomInt(5, 10)

    for (let i = 0; i < count; i++) {
        const dir = randomPick(INSTALL_DIRS)
        const file = randomSourceFile().replace(/\.(c|cpp|rs|go|cc|cxx)$/, randomPick(['.so', '.h', '', '.conf']))

        steps.push(
            {label: `Installing ${file} → ${dir}`, duration: [100, 400]}
        )
    }

    await stepList(steps)

    println(Clrs.cyan('Running ldconfig...'))
    await spinner('Updating shared library cache', randomInt(400, 900));
    println(`${tagOk()} ldconfig complete`);
    spacer();
    await randomDelay(200, 400);
}

// Summary
async function printSummary() {
    divider();
    println(success('  ✔  Build complete.'));
    println(muted(`     ${randomInt(12, 35)} files compiled · ${randomInt(1, 3)} libraries linked · 0 fatal errors`));
    divider();
    spacer();
    await randomDelay(500, 1000);
}

module.exports = run