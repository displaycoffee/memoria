# Memoria - version 1.0.0

Framework to create WordPress projects. Primarily built with JavaScript, Sass, and Vite. It is configured to build both themes and plugins, both of which can be used as a boilerplate to create something better.

This is named after the final dungeon in the game Final Fantasy IX -- the "Place of Memories".

### ddev

- Go to `/mnt/c/Users/xxx/xxx/memoria`
- Run `ddev start`
- Go to `https://memoria.ddev.site`

### dist

- JavaScript and styles are bundled from `src` using `npm run build` and compiled here

### public

- Static assets are stored here and copied into `dist` after running `npm run build`

### src

- Dev environment is started with `npm run dev`
- `_config` directory configures "global" settings
- Organized other directories into folders as: `components` (shared elements), `context` (context providers), `layout` (layout elements), `pages` ("major" content), and `targets`
- `targets` directory contains code that targets elements in index.html (`#index` and `#portal`)
