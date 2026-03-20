# fake-installer

> A fake terminal installation simulator that looks extremely real. Installs absolutely nothing.

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║    fake-installer  ·  fake install simulator             ║
║                                                          ║
║    Stages: APT Package Manager, Compilation, Tests...    ║
║                                                          ║
║    Press Ctrl+C at any time to abort.                    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

The perfect "look busy while on a coffee break" tool. Simulates APT package downloads, C/C++ compilation, test suites with coverage reports, and asset optimisation pipelines — endlessly, convincingly, and completely harmlessly.

---

## Features

- **APT stage** — fake package index fetching, dependency resolution, progress bar downloads, checksum verification with occasional self-resolving hash mismatches, and post-install triggers
- **Compile stage** — `./configure` checks, `make -j8`, per-file gcc/clang/rustc compilation with warnings, fake errors that recover mid-build, linker output, and `make install`
- **Tests stage** — unit, integration, and e2e suites with `✓`/`✗`/`○` per test, retry on failure, and a full file-by-file coverage report table
- **Optimize stage** — tree shaking, minification with progress bars, chunk bundle table, image optimisation, cache busting, and gzip/brotli compression
- **Zero dependencies** — only Node.js built-ins
- **Endless loop** — cycles through stages forever until `Ctrl+C`
- **Funny exit messages** — because polish matters

---

## Install 

```bash
npm install -g fake-installer
```

Or run instantly without installing:

```bash
npx fake-installer 
```

---

## Usage

```bash
# Run all stages in a loop (default)
fake-installer

# Run only specific stages
fake-installer compile tests

# Explicit --only flag
fake-installer --only apt compile

# Exclude stages
fake-installer --exclude optimize

# Randomise stage order each cycle
fake-installer --random

# Combine flags
fake-installer --exclude apt --random

# Help
fake-installer --help
```

---

## Stages

| Name       | Description                                      |
|------------|--------------------------------------------------|
| `apt`      | APT package manager — downloads, checksums, installs |
| `compile`  | gcc/clang/rustc compilation pipeline             |
| `tests`    | Jest-style unit, integration, and e2e test runner |
| `optimize` | Webpack/esbuild asset bundling and optimisation  |

---

## Exit

Press `Ctrl+C` at any time. You'll get a message like:

```
──────────────────────────────────────────────────────────────
  ✘  Abort. Nothing was installed.
──────────────────────────────────────────────────────────────
```

Your system will be exactly as you left it. Nothing was written. Nothing was installed. Everything is fine.

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/Leonardo-Garzon-1995/fake-installer.git
cd fake-installer

# No npm install needed — zero dependencies!

# Make the entry point executable
chmod +x bin/fake-installer.js

# Run directly
node bin/fake-installer.js

# Link and use globally 
npm link
fake-installer
```

---

## Project Structure

```
fake-installer/
├── bin/
│   └── fake-install.js   ← CLI entry point (shebang file)
├── src/
│   ├── stages/
│   │   ├── apt.js           ← APT package manager simulation
│   │   ├── compile.js       ← C/C++ compilation simulation
│   │   ├── tests.js         ← Test runner simulation
│   │   └── optimize.js      ← Asset optimisation simulation
│   ├── utils/
│   │   ├── progress.js      ← Progress bars, spinners, counters
│   │   ├── colors.js        ← ANSI color helpers & cursor control
│   │   ├── helpers.js       ← Helper functions
│   │   └── random.js        ← Fake data generators
│   └── runner.js            ← Orchestrates the simulation loop
├── package.json
└── README.md
```

---
## Contributing

Pull requests are welcome. If you find a bug, please submit an issue. If you have a suggestion to improve the project, please submit a pull request.

## License

MIT — do whatever you want with it. Install nothing responsibly.