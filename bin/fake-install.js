#!/usr/bin/env node

const startRunner = require('../src/runner')
const { displayHelpScreen, randomPick} = require('../src/utils/helpers')
const { showCursor, hideCursor, println, spacer, Combos, Clrs, muted, divider} = require('../src/utils/colors')

const [,, ...args] = process.argv

const options = {
    only: [],
    exclude: [],
    random: false,
    help: false
}

const VALID_STAGES = ['apt', 'compile', 'tests', 'optimize']

let i = 0

while (i < args.length) {
    const arg = args[i]

    switch(arg) {
        case '--help':
        case '-h':
            options.help = true
            break
        case '--random':
        case '-r':
            options.random = true
            break;
        case '--exclude':
        case '-e': {
            i++
            while(i < args.length && !args[i].startsWith("-")) {
                options.exclude.push(args[i].toLocaleLowerCase())
                i++
            }

            continue
        }
        case '--only':
        case '-o': {
            i++
            while (i < args.length && !args[i].startsWith('-')) {
                options.only.push(args[i].toLocaleLowerCase())
                i++
            }

            continue
        }
        default:
            if (VALID_STAGES.includes(arg.toLowerCase())) {
                options.only.push(arg.toLowerCase());
            } else {
                println(yellow(`⚠  Unknown argument: "${arg}" — ignoring.`));
            }
    }

    i++
}

// Help Screen
if (options.help) {
    displayHelpScreen()
}

// Graceful exit 

const SIGN_OFFS = [
    'Abort. Nothing was installed.',
    'Cancelled. Your system is exactly as you left it.',
    'Interrupted. No packages were harmed.',
    'Exiting. Nothing happened. Everything is fine.',
    'Stopped. Your disk is still empty of anything useful.',
    'Terminated. Zero bytes written. Zero progress made.',
    'Ctrl+C detected. Pretending to roll back changes...',
    'Terminated. You have successfully installed nothing'
]

function onExit() {
    showCursor()
    spacer()
    divider()

    const message = randomPick(SIGN_OFFS)
    println(' ' + Combos.boldGreen('✘  ') + Clrs.gray(message))
    divider()
    spacer()
    process.exit(0)
}

process.on('SIGINT',  onExit);
process.on('SIGTERM', onExit);

// START

hideCursor()
startRunner(options)