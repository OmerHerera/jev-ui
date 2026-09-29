# Jev UI

A small generative UI demo. Jev classifies a prompt into a registered component; React renders that component from local code. Model output never becomes executable UI code.

## Run locally

```sh
npm install
npm run dev
```

Open the Vite URL printed in the terminal. Without an API key, the page uses a clearly labeled local demo route for time-related prompts.

To enable Jev, set `TYPESAFE_API_KEY` in the environment before starting the app:

```sh
TYPESAFE_API_KEY=your-key npm run dev
```

The key is read only by the Node API server and is not sent to the browser. The server calls the TypeSafe System One API through `@typesafe-ai/sdk`.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
```

## Generative UI library

`src/generative-ui/registry.tsx` maps the server's constrained component decision to a React renderer. Add new widgets in `widgets.tsx`, register their stable identifiers in the registry, and add matching decision options to `server/index.ts`.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
