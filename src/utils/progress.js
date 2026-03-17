// Progress bars and spinners renderer 

const {randomInt, randomFloat, randomDelay, formatBytes} = require('./helpers')
const { overwriteLine, println, Clrs, Combos} = require('./colors')

// PROGRESS BAR

const BAR_WIDTH = 28

/**
 * Renders a single animated progress bar from 0% to 100%
 * 
 * @param {string} label - Text shown before the bar e.g. "Downloading libssl3"
 * @param {string} suffix - Text shown after the bar e.g. "3.2 MB/s"
 * @param {object} options - Customization options:
 * @param {number} options.steps     - How many increments to animate (default 40)
 * @param {number} options.minDelay  - Min ms per step (default 30)
 * @param {number} options.maxDelay  - Max ms per step (default 120)
 * @param {string} options.fillChar  - Character used for filled portion (default '█')
 * @param {string} options.emptyChar - Character used for empty portion (default '░')
 * 
 */

async function progressBar(label, suffix='', options={}) {
    const {
        steps=40,
        minDelay=30,
        maxDelay=120,
        fillChar='█',
        emptychar='░'
    } = options

    for (let i = 0; i <= steps; i++) {
        const percent = Math.round((i / steps) * 100)
        const filled = Math.round((i / steps) * BAR_WIDTH)
        const empty = BAR_WIDTH - filled

        const bar = Clrs.green(fillChar.repeat(filled)) + Clrs.gray(emptychar.repeat(empty))
        const pct = String(percent).padStart(3, ' ')
        const labelPad = label.padEnd(26, ' ')

        // Sufix can change per step
        const liveSuffix = typeof suffix === 'function' ? suffix(percent) : suffix

        overwriteLine(`${Clrs.cyan(labelPad)} [${bar}] ${Clrs.yellow(pct + '%')} ${Clrs.gray(liveSuffix)}`)

        await randomDelay(minDelay, maxDelay)
    }

    // Final state
    const bar = Combos.boldGreen(fillChar.repeat(BAR_WIDTH))
    const labelPad = label.padEnd(36, ' ')
    const doneSuffix = typeof suffix === 'function' ? suffix(100) : suffix

    overwriteLine(`${Clrs.cyan(labelPad)} [${bar}] ${Combos.boldGreen('100%')} ${Clrs.gray(doneSuffix)}`)
    println('') // Move to next line
}

// MULTIPLE-STEP PROGRESS BAR

/**
 * Runs multiple progress bars sequentially, each printing on its own line.
 *
 * @param {Array<{ label: string, suffix: string|function, options?: object }>} items
 */

async function progressBarSequence(items) {
    for (let item of items) {
        await progressBar(item.label, item.suffix ?? '', item.options ?? {})
    }
}

// SPINNERS

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

/**
 * Shows an animated spinner for a given duration, then prints a done message.
 *
 * @param {string} message    - Text shown next to the spinner
 * @param {number} durationMs - How long to spin in ms (default 1500)
 * @param {string} doneMsg    - Message printed when done (default '✔  Done')
 */

async function spinner(message, durationMs=1500, doneMsg='✔  Done') { 
    const interval = 80 //ms per frame
    const totalFrames = Math.floor(durationMs / interval)

    for (let i = 0; i < totalFrames; i++) {
        const frame = SPINNER_FRAMES[i % SPINNER_FRAMES.length]
        overwriteLine(`${Clrs.yellow(frame)} ${Clrs.cyan(message)}`)
        await randomDelay(interval - 10, interval + 10) // add some jitter to make it feel more natural
    }

    // Final state
    overwriteLine(`${Combos.boldGreen('✔')} ${Combos.boldGreen(message)} ${Combos.boldGreen(doneMsg)}`)
    println('')
}

// Step List 

/**
 * Prints a list of steps with a spinner per step, simulating a checklist.
 *
 * @param {Array<{ label: string, duration?: [number, number] }>} steps
 *   duration is [minMs, maxMs] for how long each step takes (default [400, 1200])
 */
async function stepList(steps) {
    for (const step of steps) {
        const [minMs, maxMs] = step.duration ?? [400, 1200];
        const durationMs = randomInt(minMs, maxMs);
        await spinner(step.label, durationMs, step.doneLabel ?? step.donelabel);
    }
}

// Byte Counter

/**
 * Simulates a streaming byte counter, like watching a file download byte by byte.
 * Prints a single animating line showing bytes received / total.
 *
 * @param {string} label     - e.g. "Fetching index"
 * @param {number} totalKB   - Total size in KB (default random 100–5000)
 */

async function byteCounter(label, totalKB = randomInt(100, 5000)) {
    const totalBytes = totalKB * 1024
    let received = 0
    const chunkCount = randomInt(20, 50)
    const labelPad = label.padEnd(36, ' ')

    for (let i = 0; i < chunkCount; i++) {
        const chunk = Math.floor(totalBytes / chunkCount) + randomInt(-500, 500)
        received = Math.min(received + chunk, totalBytes)
        const speed = `${randomFloat(0.5, 12.0)} MB/s`
        const pct = Math.round((received / totalBytes) * 100)
        const receivedStr = formatBytes(received)
        const totalStr = formatBytes(totalBytes)

        overwriteLine(`${Clrs.cyan(labelPad)} ${Clrs.gray(receivedStr)} / ${Clrs.gray(totalStr)} ${Clrs.yellow(speed)} ${Clrs.gray(pct + '%')}`)
        await randomDelay(40, 150)
    }

    overwriteLine(`${Clrs.cyan(labelPad)} ${Combos.boldGreen(formatBytes(totalBytes))} / ${Combos.boldGreen(formatBytes(totalBytes))} ${Combos.boldGreen('complete')}`)
    println('')
}

// Percent Ticker

/**
 * Counts a percentage from `start` to `end` on a single animated line.
 * Useful for "Optimizing... 73%" style output.
 *
 * @param {string} label
 * @param {number} start     - Starting percentage (default 0)
 * @param {number} end       - Ending percentage (default 100)
 * @param {number} minDelay
 * @param {number} maxDelay
 */
async function percentTicker(label, start=0, end=100, minDelay=20, maxDelay=80) {
    const labelPad = label.padEnd(36, ' ');

    for (let pct = start; pct <= end; pct++) {
        overwriteLine(`${Clrs.cyan(labelPad)} ${Clrs.yellow(String(pct).padStart(3) + '%')}`);
        await randomDelay(minDelay, maxDelay);
    }
    
    overwriteLine(`${Clrs.cyan(label.padEnd(36, ' '))} ${Combos.boldGreen('100%')}`);
    println('');
}

module.exports = {
    progressBar,
    progressBarSequence,
    spinner,
    stepList,
    byteCounter,
    percentTicker
}