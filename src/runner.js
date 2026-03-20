// Orchestrates the simulation loop — cycles through stages endlessly

const { randomDelay, printWelcome } = require('./utils/helpers')
const { println, Clrs} = require('./utils/colors')
const runApt = require('./stages/apt')
const runCompile = require('./stages/compile')
const runTests = require('./stages/test')
const runOptimize = require('./stages/optimize')


const ALL_STAGES = [
    {name: 'apt', label: 'APT Package Manager', run: runApt},
    {name: 'compile', label: 'Compilation', run: runCompile},
    {name: 'tests', label: 'Tests Runner', run: runTests},
    {name: 'optimize', label: 'Asset Optimizer', run: runOptimize}
]

/**
 * Starts the endless simulation loop of stages.
 *
 * @param {object} options
 * @param {string[]} options.only     - If set, only run stages with these names
 * @param {string[]} options.exclude  - Stage names to skip
 * @param {boolean}  options.random   - If true, randomize stage order each cycle
 */
async function startRunner(options={}) {
    const {only=[], exclude=[], random=false} = options

    let stages = ALL_STAGES.filter(s => {
        if (only.length > 0 && !only.includes(s.name)) return false
        if (exclude.length > 0 && exclude.includes(s.name)) return false
        return true
    })

    if (stages.length === 0) {
        println(Clrs.yellow('⚠  No stages match the given options. Running all stages.'))
        stages = ALL_STAGES
    }

    printWelcome(stages)
    await randomDelay(800, 1200)

    while(true) {
        const cycle = random ? [...stages].sort(() => Math.random() - 0.5) : stages

        for (const stage of cycle) {
            try {
                await stage.run()
                await randomDelay(400, 800)
            } catch (err) {
                if (err !== 'ERR_USE_AFTER_CLOSE') {
                    await randomDelay(200, 500)
                }
            }
        }
    }
}

module.exports = startRunner

