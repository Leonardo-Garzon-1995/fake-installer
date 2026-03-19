const {Clrs, Combos, spacer, println, muted } = require('./colors')
// RANDOM SELECTION

// Returns a random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Returns a random float between min and max rounded to decimals places
function randomFloat(min, max, decimals=1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

// Picks a random item from an array
function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

// Returns a Promise that resolves after a random delay between min and max ms
function randomDelay(min=50, max=200) {
    return new Promise((resolve) => setTimeout(resolve, randomInt(min, max)))
}

// FORMATTING HELPERS

/**
 * Formats a number of bytes into a human-readable string.
 * Returns a string with units of MB, kB, or B.
 * @param {number} bytes - The number of bytes to format.
 * @returns {string} A human-readable string representing the number of bytes.
 */
function formatBytes(bytes) {
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000)     return `${(bytes / 1_000).toFixed(1)} kB`;
    return `${bytes} B`;
}

/** Builds a small inline proportional bar for the bundle size visualisation 
 * 
 * @param {number} value - Current value
 * @param {number} max  - Max value
 * @param {number} width - Width of the bar
*/
function buildMiniBar(value, max, width = 16) {
    const filled = Math.round((value / max) * width);
    const empty  = width - filled;
    return Clrs.green('▪'.repeat(Math.max(filled, 1))) + Clrs.gray('·'.repeat(Math.max(empty, 0)));
}


// Welcome Banner

function printWelcome(stages) {

    stages = stages.length > 3 ? 'All stages' : stages.map(s => s.label).join(', ')
    spacer();
    println(Combos.boldCyan('╔══════════════════════════════════════════════════════════╗'));
    println(Combos.boldCyan('║') + '                                                          ' + Combos.boldCyan('║'));
    println(Combos.boldCyan('║') + '    ' + Combos.boldGreen('Fake Installer') + Clrs.gray('  ·  fake install simulator').padEnd(49) + Combos.boldCyan('║'));
    println(Combos.boldCyan('║') + '                                                          ' + Combos.boldCyan('║'));
    println(Combos.boldCyan('║') + '    ' + muted('Stages: ') + Clrs.cyan(stages).padEnd(55) + Combos.boldCyan('║'));
    println(Combos.boldCyan('║') + '                                                          ' + Combos.boldCyan('║'));
    println(Combos.boldCyan('║') + '    ' + Clrs.gray('Press Ctrl+C at any time to abort.').padEnd(63) + Combos.boldCyan('║'));
    println(Combos.boldCyan('║') + '                                                          ' + Combos.boldCyan('║'));
    println(Combos.boldCyan('╚══════════════════════════════════════════════════════════╝'));
    spacer();
}

// HELP SCREEN

function displayHelpScreen() {
    spacer();
    println(Combos.boldGreen('fake-installer') + Clrs.gray('  ·  fake install simulator'));
    spacer();
    println(Clrs.cyan('Usage:'));
    println('  ' + Clrs.gray('fake-installer') + '                     Run all stages in a loop');
    println('  ' + Clrs.gray('fake-installer compile tests') + '       Run only the compile and tests stages');
    println('  ' + Clrs.gray('fake-installer --only apt compile') + '  Same as above, explicit flag');
    println('  ' + Clrs.gray('fake-installer --exclude optimize') + '  Skip the optimize stage');
    println('  ' + Clrs.gray('fake-installer --random') + '            Randomise stage order each cycle');
    spacer();
    println(Clrs.cyan('Stages:'));
    println('  ' + Clrs.cyan('apt') + '       APT package manager simulation');
    println('  ' + Clrs.cyan('compile') + '   C/C++ compilation simulation');
    println('  ' + Clrs.cyan('tests') + '     Unit / integration / e2e test runner simulation');
    println('  ' + Clrs.cyan('optimize') + '  Asset bundling & optimisation simulation');
    spacer();
    println(Clrs.cyan('Flags:'));
    println('  ' + Clrs.cyan('--only    -o') + '   Run only the listed stages');
    println('  ' + Clrs.cyan('--exclude -e') + '   Skip the listed stages');
    println('  ' + Clrs.cyan('--random  -r') + '   Randomise stage order each loop cycle');
    println('  ' + Clrs.cyan('--help    -h') + '   Show this help screen');
    spacer();
    println(Clrs.gray('Press Ctrl+C at any time to stop. Nothing will be installed.'));
    spacer();
    process.exit(0);
}

module.exports = {
    randomInt,
    randomFloat,
    randomPick,
    randomDelay,
    formatBytes,
    buildMiniBar,
    printWelcome,
    displayHelpScreen
}