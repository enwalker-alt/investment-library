# Update instructions

Replace the matching files in your project with the files in this folder.

## Files changed

- app/page.tsx
- app/letters/page.tsx
- app/philosophy/page.tsx
- app/about/page.tsx
- app/contact/page.tsx
- app/globals.css
- app/layout.tsx

## Images

Homepage image:
- Put your image at `public/images/home-image.jpg`.
- Open `app/page.tsx` and change `const homeImageSrc: string = "";` to `const homeImageSrc: string = "/images/home-image.jpg";`.

Contact headshot:
- Put your headshot at `public/images/headshot.jpg`.
- If you want another file name, update `headshotSrc` in `app/contact/page.tsx`.

## Deploy

npm run build
git add .
git commit -m "Refine website pages and philosophy"
git push
