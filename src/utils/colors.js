const readline = require('readline')
// ANSI colors helpers

// Reset
const reset = '\x1b[0m'

// TEXT COLORS

class Clrs {
    static red = (str) => `\x1b[31m${str}${reset}`
    static green = (str) => `\x1b[32m${str}${reset}`
    static yellow = (str) => `\x1b[33m${str}${reset}`
    static blue = (str) => `\x1b[34m${str}${reset}`
    static magenta = (str) => `\x1b[35m${str}${reset}`
    static cyan = (str) => `\x1b[36m${str}${reset}`
    static white = (str) => `\x1b[37m${str}${reset}`
    static gray = (str) => `\x1b[90m${str}${reset}`
}

// TEXT STYLES

class Styles {
    static bold = (str) => `\x1b[1m${str}${reset}`
    static dim = (str) => `\x1b[2m${str}${reset}`
    static italic = (str) => `\x1b[3m${str}${reset}`
    static underline = (str) => `\x1b[4m${str}${reset}`
}

// Combinations 

class Combos {
    static boldGreen = (str) => `\x1b[1m\x1b[32m${str}${reset}`
    static boldRed = (str) => `\x1b[1m\x1b[31m${str}${reset}`
    static boldYellow = (str) => `\x1b[1m\x1b[33m${str}${reset}`
    static boldBlue = (str) => `\x1b[1m\x1b[34m${str}${reset}`
    static boldMagenta = (str) => `\x1b[1m\x1b[35m${str}${reset}`
    static boldCyan = (str) => `\x1b[1m\x1b[36m${str}${reset}`
    static boldWhite = (str) => `\x1b[1m\x1b[37m${str}${reset}`
    static boldGray = (str) => `\x1b[1m\x1b[90m${str}${reset}`
}

// Semanctic Aliases

// Package name and file names
const pkg = Clrs.cyan

// success messages ok status
const success = Clrs.green

// Major success messages - Done completed
const done = Combos.boldGreen

// Progrress messages - Warnings in progress status
const progress = Clrs.yellow

// Errors (fake errors that will self-resolve)
const error = Clrs.red

// Critical fake errors
const critical = Combos.boldRed

// Secondary info messages
const muted = Clrs.gray

// Stage headers
const header = Combos.boldCyan

// Verbose detail lines
const detail = Styles.dim

// -----------------------------------------------------------------------------

// CURSOR CONTROL

const CR = '\r' // Carriage Return - move cursor to start of line

// Clear line
const clearLine = '\x1b[K'

// Move cursor up 'n' lines
const cursorUp = (n=1) => `\x1b[${n}A`

// Hide the cursor (call on start)
const hideCursor = () => process.stdout.write('\x1b[?25l')

// Show the cursor (call on exit)
const showCursor = () => process.stdout.write('\x1b[?25h')

// PRINT HELPERS

const println = (str) => process.stdout.write(str + '\n')

// Overwrites ccurrent line (for progress updates)
const overwriteLine = (str) => {
    readline.cursorTo(process.stdout, 0)
    readline.clearLine(process.stdout, 0)
    process.stdout.write(str)
}

// Spacer (print a blank line)
const spacer = () => println('')

// Print a dimmed divider line 
const divider = () => println(muted('─'.repeat(60)))

// ----------------------------------------------------------------------------

// Status Tags

const tagOk = () => Combos.boldGreen('[ OK ]')
const tagDone = () => Combos.boldGreen('[ DONE ]')
const tagWarn = () => Combos.boldYellow('[ WARN ]')
const tagFail = () => Combos.boldRed('[ FAIL ]')
const tagInfo = () => Combos.boldCyan('[ INFO ]')
const tagRetry = () => Combos.boldYellow('[ RETRY ]')

module.exports = {
    reset,
    Clrs,
    Styles,
    Combos,
    pkg,
    success,
    done,
    progress,
    error,
    critical,
    muted,
    header,
    detail,
    CR,
    clearLine,
    cursorUp,
    hideCursor,
    showCursor,
    println,
    overwriteLine,
    spacer,
    divider,
    tagOk,
    tagDone,
    tagWarn,
    tagFail,
    tagInfo,
    tagRetry
}