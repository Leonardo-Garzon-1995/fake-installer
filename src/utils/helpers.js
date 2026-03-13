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

module.exports = {
    randomInt,
    randomFloat,
    randomPick,
    randomDelay
}