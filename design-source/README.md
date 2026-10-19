# Design source images

Original, unoptimised artwork. **Nothing in here is served to the site.**

`public/` is the live web root — everything in it is deployed and, if it is
600px or wider, automatically turned into responsive variants by
`npm run images`. That is why these masters live here instead.

## How to use one on the site

1. Convert to WebP (pick a quality that matches the folder's other images):

   ```sh
   node -e "require('sharp')('design-source/my-image.png').webp({quality:92,effort:6,chromaSubsampling:'4:4:4'}).toFile('public/images/backgrounds/my-image.webp')"
   ```

2. Point the component at `public/images/...` and set `width`/`height` to the
   real pixel size, so the browser reserves the right space before load.
3. Run `npm run images` to build the responsive variants.
4. Bump `VARIANT_VERSION` in `src/data/imageVariantVersion.js`, otherwise
   returning visitors keep seeing the old image from their browser cache.
