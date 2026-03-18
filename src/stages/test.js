// Simulates a test runner sequence

const { randomInt, randomPick, randomDelay, randomFloat } = require('../utils/helpers')
const { randomPackageName, randomTestName} = require('../utils/random')
const { spinner, stepList} = require('../utils/progress')
const {
    println,
    spacer,
    divider,
    header,
    success,
    muted,
    tagOk,
    tagRetry,
    Combos,
    Clrs,
    Styles
} = require('../utils/colors')

// Entry point

async function run() {
    await printHeader();
    await runUnitTests();
    await runIntegrationTests();
    await runE2ETests();
    await printCoverage();
    await printSummary();
}

// Data

const TEST_FRAMEWORKS = ['Jest', 'Mocha', 'Vitest', 'PyTest', 'Go Test', 'Cargo Test', 'RSpec'];
const UNIT_SUITES = [
    'AuthService', 'UserRepository', 'CacheLayer', 'TokenValidator',
    'ConfigParser', 'EventEmitter', 'RequestHandler', 'ResponseFormatter',
    'DataSerializer', 'SchemaValidator', 'RateLimiter', 'SessionManager',
];
const INTEGRATION_SUITES = [
    'Database connection pool',
    'Redis cache integration',
    'OAuth2 flow',
    'S3 bucket access',
    'Kafka consumer group',
    'gRPC service endpoints',
    'REST API contracts',
    'WebSocket handshake',
];
const E2E_SUITES = [
    'User registration flow',
    'Login and session persistence',
    'Password reset flow',
    'File upload pipeline',
    'Payment processing flow',
    'Search and filter results',
    'Notification delivery',
];
const SKIP_REASONS = [
    'not implemented yet',
    'skipped in CI environment',
    'requires live database',
    'flaky — under investigation',
    'pending external service mock',
];
const FAILURE_MESSAGES = [
    'Expected 200 but received 503',
    'Timeout after 5000ms',
    'AssertionError: null !== undefined',
    'Connection refused: localhost:5432',
    'Token expired before assertion',
    'Race condition detected in async flow',
];

// HEADER 

async function printHeader() {
    const framework = randomPick(TEST_FRAMEWORKS)

    spacer()
    divider()
    println(header(`  TESTS  ·  ${framework}  ·  Node ${randomInt(18, 22)}.${randomInt(0, 9)}.${randomInt(0, 9)}`))
    spacer()
    divider()

    await randomDelay(200, 400)
}

// UNIT TEST

async function runUnitTests() {
    println(Combos.boldGreen('● Unit Tests'))

    const suiteCount = randomInt(4, 8) 
    const suites = Array.from({length: suiteCount}, () => randomPick(UNIT_SUITES))
    const uniqueSuites = [...new Set(suites)].slice(0, suiteCount)

    let totalPassed = 0
    let totalFailed = 0
    let totalSkipped = 0

    for (const suite of uniqueSuites) {
        const testCount   = randomInt(4, 14);
        const failCount   = Math.random() < 0.15 ? randomInt(1, 2) : 0;
        const skipCount   = Math.random() < 0.2  ? randomInt(1, 2) : 0;
        const passCount   = testCount - failCount - skipCount;

        totalPassed += passCount
        totalFailed += failCount
        totalSkipped += skipCount

        println(Clrs.cyan(` ${suite}`))
        await randomDelay(100, 250)

        const allTests = randomInt(testCount - 1, testCount + 2)
        for (let i = 0; i < allTests; i++) {
            const testName = randomTestName()
            const duration = randomInt(1, 120)

            if ( i < failCount) {
                println(`    ${Combos.boldRed('✗')} ${Clrs.red(testName)} ${Clrs.gray(`(${duration}ms)`)}`);
                await randomDelay(40, 100);
                println(`      ${Clrs.gray('→')} ${Combos.boldRed(randomPick(FAILURE_MESSAGES))}`);
            } else if (i < failCount + skipCount) {
                println(`    ${Combos.boldYellow('○')} ${Clrs.yellow(testName)} ${Clrs.gray(`— ${randomPick(SKIP_REASONS)}`)}`);
            } else {
                println(`    ${Combos.boldGreen('✓')} ${muted(testName)} ${Clrs.gray(`(${duration}ms)`)}`);
            }
        
            await randomDelay(30, 100);
        }

        const suiteTime = randomFloat(0.1, 3.5, 2)
        println(
            Clrs.gray(" ") +
            Clrs.green(`${passCount} passed`) +
            (failCount > 0 ? Clrs.gray(', ') + Clrs.red(`${failCount} failed`) : "") +
            (skipCount  > 0 ? Clrs.gray(', ') + Clrs.yellow(`${skipCount} skipped`) : '') +
            Clrs.gray(`  (${suiteTime}s)`)
        )
        spacer()

        if (failCount > 0) {
            println(`  ${tagRetry()} Re-running failed tests...`);
            await spinner(`Retrying ${suite}`, randomInt(600, 1400));
            println(`  ${tagOk()} ${failCount} previously failing test(s) now pass.`);
            totalFailed  -= failCount;
            totalPassed  += failCount;
            spacer();
        }
    }

    printSectionSummary('Unit', totalPassed, totalFailed, totalSkipped)
    spacer()
    await randomDelay(400, 800)

}

// INTEGRATION TEST

async function runIntegrationTests() {
    println(Combos.boldGreen('● Integration Tests'));
    spacer();

    await stepList([
        { label: 'Spinning up test containers',  duration: [800, 2000] },
        { label: 'Seeding test database',        duration: [400, 1000] },
        { label: 'Warming up connection pools',  duration: [200,  600] },
    ]);
    spacer();

    const suiteCount = randomInt(3, 6)
    const suites = INTEGRATION_SUITES.sort(() => Math.random() - 0.5).slice(0, suiteCount)

    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (const suite of suites) {
        const testCount  = randomInt(3, 8);
        const failCount  = Math.random() < 0.1 ? 1 : 0;
        const skipCount  = Math.random() < 0.15 ? 1 : 0;
        const passCount  = testCount - failCount - skipCount;
    
        totalPassed  += passCount;
        totalFailed  += failCount;
        totalSkipped += skipCount;
    
        println(Clrs.cyan(`  ${suite}`));
        await randomDelay(150, 350);
    
        for (let i = 0; i < testCount; i++) {
        const testName = randomTestName();
        const duration = randomInt(20, 800);
    
        if (i < failCount) {
            println(`    ${Combos.boldRed('✗')} ${Clrs.red(testName)} ${Clrs.gray(`(${duration}ms)`)}`);
            await randomDelay(60, 150);
            println(`      ${Clrs.gray('→')} ${Combos.boldRed(randomPick(FAILURE_MESSAGES))}`);
        } else if (i < failCount + skipCount) {
            println(`    ${Combos.boldYellow('○')} ${Clrs.yellow(testName)} ${Clrs.gray(`— ${randomPick(SKIP_REASONS)}`)}`);
        } else {
            println(`    ${Combos.boldGreen('✓')} ${muted(testName)} ${Clrs.gray(`(${duration}ms)`)}`);
        }
    
        await randomDelay(60, 200);
        }
    
        const suiteTime = randomFloat(0.5, 8.0, 2);
        println(
        Clrs.gray(`    `) +
        Clrs.green(`${passCount} passed`) +
        (failCount  > 0 ? Clrs.gray(', ') + Clrs.red(`${failCount} failed`)     : '') +
        (skipCount  > 0 ? Clrs.gray(', ') + Clrs.yellow(`${skipCount} skipped`) : '') +
        Clrs.gray(`  (${suiteTime}s)`)
        );
        spacer();
    }
 
    await stepList([
        { label: 'Tearing down test containers', duration: [300, 800] },
        { label: 'Flushing test database',       duration: [200, 500] },
    ]);
    spacer();
 
    printSectionSummary('Integration', totalPassed, totalFailed, totalSkipped);
    spacer();
    await randomDelay(300, 600);
}

// E2E TESTs

async function runE2ETests() {
    println(Combos.boldGreen('● End-to-End Tests'))
    spacer()

    await stepList([
        { label: 'Launching headless browser',     duration: [600, 1400] },
        { label: 'Navigating to test environment', duration: [300,  800] }
    ])
    spacer()

    const suiteCount = randomInt(2, 4)
    const suites = E2E_SUITES.sort(() => Math.random() - 0.5).slice(0, suiteCount)

    let totalPassed = 0
    let totalSkipped = 0

    for (const suite of suites) {
        const stepCount = randomInt(3, 7)
        println(Clrs.cyan(` ${suite}`))
        await randomDelay(150, 300)

        for (let i = 0; i < stepCount; i++) {
            const duration = randomInt(100, 2500)
            const testName = randomTestName()
            const skip = Math.random() < 0.08

            if (skip) {
                println(`    ${Combos.boldYellow('○')} ${Clrs.yellow(testName)} ${Clrs.gray(`— ${randomPick(SKIP_REASONS)}`)}`)
                totalSkipped++
            } else {
                println(`    ${Combos.boldGreen('✓')} ${muted(testName)} ${Clrs.gray(`(${duration}ms)`)}`);
                totalPassed++;
            }

            await randomDelay(80, 300)
        }

        const suiteTime = randomFloat(1.5, 15.0, 2)
        println(
            Clrs.gray(`    `) +
            Clrs.green(`${totalPassed} passed`) + 
            (totalSkipped > 0 ? Clrs.gray(', ') + Clrs.yellow(`${totalSkipped} skipped`) : '') +
            Clrs.gray(`  (${suiteTime}s)`)
        )
        spacer()
    }

    await stepList([{label: "Closing headless browser", duration: [200, 500]}])
    spacer()

    printSectionSummary('E2E', totalPassed, 0, totalSkipped)
    spacer()
    await randomDelay(300, 600)
}

// Coverage Report 

async function printCoverage() {
    println(Combos.boldGreen('● Coverage Report'))
    spacer()

    await spinner('Generating coverage report...', randomInt(800, 1800))
    spacer()

    const colWidths = [36, 8, 8, 8, 8]
    const headers = ['File', 'Stmts', 'Branch', 'Funcs', 'Lines']

    println(headers.map((h, index) =>  Styles.bold(h.padEnd(colWidths[index]))).join(''))
    println(Clrs.gray('─'.repeat(70)))

    const fileCount = randomInt(8, 16)

    for (let i = 0; i < fileCount; i++) {
        const file = ('src/' + randomPackageName().replace(/^(lib|node-)/, '') + '.js').padEnd(colWidths[0])
        const stmts = randomFloat(70, 100)
        const branch = randomFloat(60, 100)
        const funcs = randomFloat(75, 100)
        const lines = randomFloat(70, 100)

        const colorize = (v) => 
            v >= 90 ? Clrs.green(String(v).padEnd(8)) :
            v >= 75 ? Clrs.yellow(String(v).padEnd(8)) :
            Clrs.red(String(v).padEnd(8))

        println(Clrs.cyan(file) + colorize(stmts) + colorize(branch) + colorize(funcs) + colorize(lines))
        await randomDelay(40, 120)
    }

    println(Clrs.gray('─'.repeat(70)));

    const totalStmts = randomFloat(80, 97)
    const totalBranch = randomFloat(72, 95)
    const totalFuncs = randomFloat(82, 99)
    const totalLines = randomFloat(70, 100)

    println(
        Styles.bold('All files'.padEnd(colWidths[0])) +
        Combos.boldGreen(String(totalStmts).padEnd(colWidths[1]))  +
        Combos.boldGreen(String(totalBranch).padEnd(colWidths[2])) +
        Combos.boldGreen(String(totalFuncs).padEnd(colWidths[3]))  +
        Combos.boldGreen(String(totalLines).padEnd(colWidths[4]))
    );
    spacer();
    await randomDelay(200, 400);
}

// Final Summary

async function printSummary() {
    const passed  = randomInt(30, 80);
    const skipped = randomInt(2, 8);
    const time    = randomFloat(5.0, 30.0, 2);

    divider();
    println(success('  ✔  Test suite complete.'));
    println(
        muted(`     `) +
        Clrs.green(`${passed} passed`) +
        Clrs.gray('  ·  ') +
        Clrs.yellow(`${skipped} skipped`) +
        Clrs.gray('  ·  ') +
        Clrs.red('0 failed') +
        Clrs.gray(`  ·  ${time}s`)
    );
    divider();
    spacer();
    await randomDelay(500, 1000);
}

// ─── Section Summary Helper ───────────────────────────────────────────────────
function printSectionSummary(label, passed, failed, skipped) {
    const total = passed + failed + skipped;
    const time  = randomFloat(0.5, 20.0, 2);
    
    const parts = [Clrs.green(`${passed} passed`)];
    if (failed  > 0) parts.push(Clrs.red(`${failed} failed`));
    if (skipped > 0) parts.push(Clrs.yellow(`${skipped} skipped`));
    parts.push(Clrs.gray(`${total} total`));
    parts.push(Clrs.gray(`(${time}s)`));
    
    println(`  ${Styles.bold(label + ':')}  ` + parts.join(Clrs.gray('  ·  ')));
}

module.exports = run