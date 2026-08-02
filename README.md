# Dental School Atlas

An interactive, static learning atlas for dental anatomy, head and neck anatomy,
whole-body anatomy, osteology, histology, and foundational oral pathology.

## Learning models

- Detailed third-party 3D specimens are embedded for teeth, complete arches,
  the skull, head and neck, skeleton, spine, body systems, and selected tissues.
- The earlier procedurally generated anatomy model has been removed because it
  was not realistic enough for serious anatomical study.
- The skeleton section includes a searchable 206-bone adult catalog, all 33
  vertebral levels, articulations, landmarks, functions, and dental relevance.

This is an educational study aid, not a diagnostic product or surgical-planning
tool. Verify anatomy with faculty-approved specimens, imaging, and textbooks.

## Run locally

```bash
npm install
npm run dev
```

The production build is a static export suitable for Vercel or GitHub Pages:

```bash
npm run lint
npm run build
```

Interactive dental anatomy, skeletal anatomy, histology, and pathology study atlas.

## Free public deployment

### Vercel

Import this repository into Vercel. The default Next.js settings work without
extra environment variables, and each push to `main` triggers a deployment.

### GitHub Pages

This repository is configured for GitHub Pages. After the repository is pushed:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Run the **Deploy Dental School Atlas** workflow if it does not start automatically.

For the cleanest address, use a neutral GitHub account and name the repository
`<neutral-account>.github.io`. The public address will then be
`https://<neutral-account>.github.io`.

The site is static. Visitors do not need a GitHub or ChatGPT account.
