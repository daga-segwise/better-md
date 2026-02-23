# Better MD

A native macOS Markdown reader built with Tauri, React, and TypeScript.

## Features

- Open and render `.md`, `.markdown`, and `.mdx` files
- Tabbed interface for multiple files
- Table of contents sidebar
- Syntax-highlighted code blocks
- Light, Dark, and Nord themes
- Live file watching — auto-refreshes on external changes

## Install

Download the latest `.dmg` from [Releases](../../releases/latest).

- **Apple Silicon** (M1/M2/M3/M4): `Better MD_*_aarch64.dmg`
- **Intel**: `Better MD_*_x64.dmg`

> **macOS Gatekeeper notice:** The app is not code-signed, so macOS will block it on first launch. After installing, run:
>
> ```sh
> xattr -cr "/Applications/Better MD.app"
> ```
>
> Then open the app normally.

## Keyboard Shortcuts

| Shortcut | Action |
|-|-|
| `Cmd+O` | Open file |
| `Cmd+W` | Close tab |
| `Cmd+Shift+T` | Toggle table of contents |
| `Cmd+1` | Light theme |
| `Cmd+2` | Dark theme |
| `Cmd+3` | Nord theme |

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Rust](https://www.rust-lang.org/tools/install)
- Xcode Command Line Tools (`xcode-select --install`)

### Setup

```sh
npm install
npm run tauri dev
```

### Build

```sh
npm run tauri build
```

## Releases

A GitHub Action automatically bumps the patch version and creates a release with macOS binaries on every merge to `main`.
