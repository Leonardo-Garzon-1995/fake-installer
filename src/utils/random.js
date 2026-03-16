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

function randomSpeed() {
    const type = randomPick(['kB/s', 'MB/s'])

    if (type === 'KB/s') return `${randomInt(100, 900)} KB/s`
    return `${randomFloat(0.5, 12.0)} MB/s`
}

// ---------------------------------------------------------------

// ______Checksums______

function randomHex(len=32) {
    return Array.from({ length: len }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join('')
}

function randomMd5() {
    return randomHex(32)
}

function randomSha256() {
    return randomHex(64)
}

// ------------------------------------------------------------------

// ______Mirror URLs______

const mirrors = [
    'archive.ubuntu.com',
    'us.archive.ubuntu.com',
    'eu.archive.ubuntu.com',
    'mirror.digitalocean.com',
    'mirrors.kernel.org',
    'ftp.debian.org',
    'cdn-aws.deb.debian.org',
    'mirrors.linode.com',
    'mirror.csclub.uwaterloo.ca'
]

const repos = ['ubuntu', 'debian', 'apt', 'packages', 'pool']
const dists = ['jammy', 'focal', 'bullseye', 'bookworm', 'noble']
const components = ['main', 'restricted', 'universe', 'multiverse']

function randomMirrorUrl(packageName) {
    const mirror = randomPick(mirrors)
    const repo = randomPick(repos)
    const dist = randomPick(dists)
    const component = randomPick(components)

    return `http://${mirror}/${repo}/dists/${component}/binary-amd64/${packageName}`
}

// ------------------------------------------------------------------------------

// ______Source Files(for compile stage)______

const srcPrefixes = ['src', 'lib', 'util', 'sys', 'net', 'io', 'db', 'auth']
const srcNames = [
    'main', 'init', 'config', 'parser', 'lexer', 'router', 'handler',
    'middleware', 'scheduler', 'worker', 'queue', 'cache', 'store',
    'client', 'server', 'socket', 'stream', 'buffer', 'pool',
    'crypto', 'hash', 'encode', 'decode', 'compress', 'decompress',
    'logger', 'monitor', 'metrics', 'tracer', 'profiler'
]
const srcExts = ['.c', '.cpp', '.h', '.hpp', '.py', '.js', '.go', '.rs', '.java']

function randomSourceFile() {
    const prefix = randomPick(srcPrefixes)
    const name = randomPick(srcNames)
    const ext = randomPick(srcExts)
    const separator = prefix ? '_' : ''

    return `${prefix}${separator}${name}${ext}`
}
// --------------------------------------------------------------------------------------

// ______Test Names (for test stage)______

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

// --------------------------------------------------------------------------------------

// Asset Names (for optimization stage)

const assetNames = [
    'main', 'vendor', 'runtime', 'chunk', 'polyfills',
    'app', 'styles', 'icons', 'fonts', 'images'
]

const assetExts = ['.js', '.css', '.png', '.jpg', '.svg', '.woff2', '.wasm', '.map']

function randomAssetName() {
    const name = randomPick(assetNames)
    const hex = randomHex(8)
    const ext = randomPick(assetExts)
    return `${name}.${hex}${ext}`
}

// --------------------------------------------------------------------------------------
module.exports = {
    randomPackageName,
    randomVersion,
    randomFileSize,
    randomSpeed,
    randomMd5,
    randomSha256,
    randomMirrorUrl,
    randomSourceFile,
    randomTestName
}
