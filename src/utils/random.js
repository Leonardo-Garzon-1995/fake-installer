// Random data generator

const { randomPick, randomDelay, randomFloat, randomInt } = require('./helpers')

// ______Packages Names______

const prefixes = [
    'lib', 'python3-', 'node-', 'ruby-', 'perl-', 'php-',
    'linux-', 'gcc-', 'g++-', 'golang-', 'rust-'
]

const words = [
    'ssl', 'curl', 'crypto', 'xml', 'json', 'uuid', 'zlib', 'pcre',
    'sqlite', 'postgres', 'redis', 'kafka', 'grpc', 'protobuf',
    'openssl', 'boost', 'arrow', 'avro', 'thrift', 'flatbuffers',
    'yaml', 'toml', 'ini', 'dotenv', 'config', 'argparse',
    'http', 'https', 'tcp', 'udp', 'websocket', 'oauth2',
    'auth', 'jwt', 'bcrypt', 'scrypt', 'argon2',
    'image', 'png', 'jpeg', 'webp', 'svg', 'canvas',
    'video', 'audio', 'codec', 'ffmpeg', 'gstreamer',
    'numpy', 'pandas', 'scipy', 'sklearn', 'torch',
    'react', 'vue', 'svelte', 'angular', 'ember',
    'webpack', 'rollup', 'esbuild', 'vite', 'parcel',
    'readline', 'ncurses', 'termios', 'pty',
    'systemd', 'dbus', 'udev', 'fuse'
]

const suffixes = ['', '-dev', '-core', '-utils', '-cli', '-lib', '-tools', '-extra']

// Generate a fake package name
function randomPackageName() {
    const prefix = randomPick(prefixes)
    const word = randomPick(words)
    const suffix = randomPick(suffixes)

    return `${prefix}${word}${suffix}`
}
// --------------------------------------------------------------------------------------

// ______Version Numbers______

const ubuntuRevisions = ['ubuntu1', 'ubuntu2', 'ubuntu3', 'build1', 'build2']

// Generate a fake version
function randomVersion() {
    const major = randomInt(1, 14)
    const minor = randomInt(0, 99)
    const patch = randomInt(0, 20)
    const rev = randomInt(1, 5)
    const ubuntuRev = randomPick(ubuntuRevisions)

    return `${major}.${minor}.${patch}-${rev}${ubuntuRev}`
}

// -----------------------------------------------------------------------

// ______File sizes and Speeds

// Generate a random file size
function randomFileSize() {
    const type = randomPick(['KB', 'MB'])
    if (type === 'KB') return `${randomInt(10, 999)} kB`
    return `${randomFloat(0.1, 99.9)} MB`
}


const testSuits = ['unit', 'integration', 'e2e', 'smoke', 'sanity', 'load']

const testNames = [
    'should parse config correctly',
    'handles null input gracefully',
    'returns 200 on valid request',
    'throws on invalid token',
    'encrypts payload with AES-256',
    'resolves promises in order',
    'respects rate limits',
    'retries on network timeout',
    'validates schema on write',
    'emits events on state change',
    'cleans up resources on exit',
    'handles concurrent writes safely',
    'falls back to cache on error',
    'normalizes unicode input',
    'sanitizes SQL injection attempts'
]

// Generate a fake test name
function randomTestName() {
    return `${randomPick(testSuits)}: ${randomPick(testNames)}`
}

console.log(randomVersion())