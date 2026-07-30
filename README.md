# Dental School Atlas

An interactive, static learning atlas for dental anatomy, head and neck anatomy,
whole-body anatomy, osteology, histology, and foundational oral pathology.

## Two model modes

- **Original 3D** is a native WebGL educational reconstruction built for this
  project. It supports selectable structures, layer visibility, explode mode,
  transparency, motion, labels, definitions, and functions.
- **Classic model** preserves the previously embedded third-party model in each
  section for comparison and additional study.

The original geometry is intentionally identified in the interface as an
invented educational reconstruction. It is not a patient scan, validated
anatomical specimen, diagnostic product, or surgical planning tool.

## Run locally

```bash
npm install
npm run dev
```

The production build is a static export suitable for GitHub Pages:

```bash
npm run lint
npm run build
```

Interactive dental anatomy, skeletal anatomy, histology, and pathology study atlas.

## Free public deployment

This repository is configured for GitHub Pages. After the repository is pushed:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Run the **Deploy Dental School Atlas** workflow if it does not start automatically.

For the cleanest address, use a neutral GitHub account and name the repository
`<neutral-account>.github.io`. The public address will then be
`https://<neutral-account>.github.io`.

The site is static. Visitors do not need a GitHub or ChatGPT account.
