# Manual Install

Use this if you want to install the Obsidian plugin by hand.

## Steps

1. Open the Obsidian vault you want to use.
2. Create this folder in the vault:
   `.obsidian/plugins/openagent`
3. Copy these files from `apps/obsidian-plugin/` into that folder:
   `main.js`, `manifest.json`, `styles.css`, `package.json`, `logo.png`
4. In Obsidian, go to `Settings -> Community plugins` and enable `OpenAgent`.

`data.json` is not required up front. OpenAgent creates and manages it in the vault.

## Windows Notes

- **Symlinks**: `pnpm link:obsidian-plugin` creates symlinks so changes to the plugin source are reflected immediately in Obsidian. On Windows, symlink creation requires either [Developer Mode](https://learn.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development) to be enabled or an elevated (Administrator) shell. If neither is available the script automatically falls back to copying the files instead. When using the copy fallback, re-run `pnpm link:obsidian-plugin` after making changes to the plugin source.
- **Obsidian config path**: OpenAgent reads `%APPDATA%\obsidian\obsidian.json` on Windows to detect the currently open vault.
- **Codex Desktop path**: If Codex Desktop is installed in a non-default location, set the `OPENAGENT_CODEX_PATH` environment variable to its executable path before running setup.
- **Daemon launch**: The daemon is started directly via `pnpm dev:daemon` (no shell wrapper), so `pnpm` must be on your `PATH`. Run `where pnpm` in a terminal to verify.
