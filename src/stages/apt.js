// APT Package Manager installation sequence

const { randomInt, randomFloat, randomPick, randomDelay } = require('../utils/helpers');
const { randomPackageName, randomVersion, randomFileSize, randomMd5, randomSha256 } = require('../utils/random')
const { reset, Clrs, Styles, pkg, success, muted, error, tagOk, tagWarn, tagRetry, println, spacer, divider } = require('../utils/colors')
const { progressBar, spinner, stepList } = require('../utils/progress')

// ENTRY POINT 

async function run() {
    await printHeader();
    await fetchPackageIndex();
    await readPackageLists();
    await resolveDependencies();
    await downloadPackages();
    await verifyChecksums();
    await unpackAndInstall();
    await runPostInstallScripts();
    await printSummary();
}

// header

async function printHeader() {
    spacer()
    divider()
    println('  APT  ·  Advanced Package Tool  ·  v2.4.11')
    spacer()
    divider()
    await randomDelay(200, 400)
}

// Fetch package index

const MIRRORS = [
    'http://archive.ubuntu.com/ubuntu',
    'http://us.archive.ubuntu.com/ubuntu',
    'http://eu.archive.ubuntu.com/ubuntu',
    'http://mirrors.kernel.org/ubuntu',
    'http://mirror.digitalocean.com/ubuntu'
]

const DISTS = ['jammy', 'jammy-updates', 'jammy-backports', 'jammy-security']
const COMPONENTS = ['InRelease', 'Release', 'Packages.gz', 'Sources.gz']

async function fetchPackageIndex() {
    println(Clrs.cyan('Hit:1') + muted('http://archive.ubuntu.com/ubuntu jammy InRelease'))
    await randomDelay(80, 100)

    for (let i = 0; i < randomInt(6, 12); i++) {
        const mirror    = randomPick(MIRRORS);
        const dist      = randomPick(DISTS);
        const component = randomPick(COMPONENTS);
        const hitType   = randomPick(['Hit', 'Get', 'Ign']);
        const num       = i + 2;
        const size      = hitType === 'Get' ? `  ${randomFileSize()}` : '';
    
        if (hitType === 'Ign') {
            println(Clrs.gray(`Ign:${num} `) + muted(`${mirror} ${dist} ${component}`));
        } else if (hitType === 'Get') {
            println(Clrs.green(`Get:${num} `) + muted(`${mirror} ${dist} ${component}`) + Clrs.yellow(size));
        } else {
            println(Clrs.cyan(`Hit:${num} `) + muted(`${mirror} ${dist} ${component}`));
        }
    
        await randomDelay(60, 200);
    }

    spacer();
    println(`${tagOk()} ${randomInt(3, 8)} packages can be upgraded. Run 'apt list --upgradable' to see them.`);
    spacer();
    await randomDelay(200, 400);
}

// Read package lists

async function readPackageLists() {
    await spinner('Reading package lists...', randomInt(800, 1600))
    await spinner('Building dependency tree...', randomInt(600, 1200))
    await spinner('Reading state information...', randomInt(400, 800))
    spacer()
}

// Resolve dependencies

async function resolveDependencies() {
    const packageCount = randomInt(8, 20)
    const upgradeCount = randomInt(2, 6)
    const newCount = packageCount - upgradeCount
    const removeCount = randomInt(0, 3)
    const totalSize = `${randomFloat(10.0, 120.0)} MB`
    const afterSize = `${randomFloat(30.0, 300.0)} MB`

    println(Styles.bold('The following NEW packages will be installed:'));
    const newPkgs = Array.from({ length: newCount }, () => randomPackageName());
    println('  ' + newPkgs.map(p => pkg(p)).join('  '));
    spacer();

    await randomDelay(300, 800)
    
    println(Styles.bold('The following packages will be upgraded:'))
    const upgradePkgs = Array.from({length: upgradeCount}, () => randomPackageName())
    println('  ' + upgradePkgs.map(p => pkg(p)).join('  '))
    spacer()

    await randomDelay(300, 800)

    if (removeCount > 0) {
        println(Styles.bold('The following packages will be REMOVED:'))
        const removePkgs = Array.from({ length: removeCount }, () => randomPackageName());
        println('  ' + removePkgs.map(p => error(p)).join('  '));
        spacer();
    }

    await randomDelay(300, 800)

    println(
        `${packageCount} upgraded, ${newCount} newly installed, ` +
        `${removeCount} to remove and ${randomInt(0, 5)} not upgraded.`
    );
    println(
        `Need to get ${Clrs.yellow(totalSize)} of archives. ` +
        `After this operation, ${Clrs.yellow(afterSize)} of additional disk space will be used.`
    );
    spacer();
    await randomDelay(400, 800);
}

// Download packages 

async function downloadPackages() {
    const count = randomInt(4, 10)

    for (let i = 0; i < count; i++) {
        const name  = randomPackageName()
        const version = randomVersion()
        const mirror = randomPick(MIRRORS)
        const label = `Get:${i + 1} ${name} ${version}`

        println(muted(`${mirror}/pool/main/${name}_${version}_amd64.deb`))

        await progressBar(
            label,
            (pct) => `${randomFloat(0.5, 12.0)} MB/s`,
            {steps: randomInt(25, 50), minDelay: 20, maxDelay: 100}
        )

        await randomDelay(100, 300)
    }

    spacer()
    println(`${tagOk()} Fetched ${randomFloat(10.0, 120.0, 1)} MB in ${randomInt(2, 15)}s (${randomFloat(1.0, 10.0, 1)} MB/s)`);
    spacer()
    await randomDelay(200, 500)
}

// Verify checksums
async function verifyChecksums() {
    println(Clrs.cyan('Verifying package integrity...'))
    spacer()

    const count =randomInt(4, 8)
    for (let i = 0; i < count; i++) {
        const name = randomPackageName()
        const md5 = randomMd5()
        const sha = randomSha256()

        await randomDelay(80, 200)
        println(`   ${muted('MD5: ')} ${Clrs.gray(md5)} ${pkg(name)}`)
        await randomDelay(40, 100)
        println(`   ${muted('SHA256: ')} ${Clrs.gray(sha)} ${tagOk()}`)
        spacer()
    }

    // Ocasionally throws a self-resolved fake warning

    if (Math.random() < 0.4) {
        println(`${tagWarn()} Hash mismatch detected for ${pkg(randomPackageName())}`);
        await randomDelay(200, 800);
        println(`${tagRetry()} Retrying from alternate mirror...`);
        await spinner('Re-fetching package...', randomInt(600, 1200));
        println(`${tagOk()} Checksum verified after retry.`);
        spacer();
    }
}


// Unpack and install

async function unpackAndInstall() {
    spacer();
    println(Clrs.cyan('Unpacking and installing packages...'));
    spacer();

    const count = randomInt(4, 10)
    const steps = [] 

    for (let i = 0; i < count; i++) {
        const name = randomPackageName()
        const version = randomVersion()
        steps.push({
            label: `Unpacking ${name} (${version})`,
            doneLabel: `${name} (${version}) unpacked`,
            duration: [200, 700]
        })
    }

    await stepList(steps)
    spacer()

    // Setting up
    for (let i = 0; i < count; i++) {
        const name    = steps[i].label.split(' ')[1]; // reuse name
        const version = randomVersion();
        await randomDelay(100, 300);
        println(`${tagOk()} Setting up ${pkg(name)} (${muted(version)}) ...`);
    }

    spacer()
}

// Psot install scripts

const POST_INSTALL_STEPS = [
    { label: 'Processing triggers for libc-bin',           duration: [300,  800] },
    { label: 'Processing triggers for man-db',             duration: [200,  600] },
    { label: 'Processing triggers for initramfs-tools',    duration: [800, 2000] },
    { label: 'Updating /boot/initrd.img',                  duration: [600, 1500] },
    { label: 'Updating dynamic linker cache',              duration: [200,  500] },
    { label: 'Running ldconfig',                           duration: [100,  400] },
    { label: 'Processing triggers for desktop-file-utils', duration: [100,  300] },
    { label: 'Processing triggers for mime-support',       duration: [100,  300] },
    { label: 'Regenerating locale files',                  duration: [400, 1000] },
    { label: 'Updating font cache',                        duration: [200,  600] }
];

async function runPostInstallScripts() {
    println(Clrs.cyan('Running post-installation scripts...'));
    spacer();
    
    // Pick a random subset of post-install steps
    const count    = randomInt(3, 7);
    const selected = POST_INSTALL_STEPS
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
    
    await stepList(selected);
    spacer();
}

// Summary

async function printSummary() {
    divider();
    println(success(`  ✔  Installation complete.`));
    println(muted(`     ${randomInt(4, 20)} packages installed · ${randomInt(0, 5)} warnings · 0 errors`));
    divider();
    spacer();
    await randomDelay(500, 1000);
}


module.exports = run