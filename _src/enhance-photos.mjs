// Enhances the client's on-site iPhone photos for the web.
// Run: node _src/enhance-photos.mjs   (needs `npm i sharp` once)
// Auto-orients, recovers backlit shadows with local contrast (CLAHE),
// lifts colour, sharpens, resizes to 2000px and strips EXIF/GPS data.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'assets/German Rosort images/Pictures');
const OUT = join(root, 'assets/images/site');
mkdirSync(OUT, { recursive: true });

// style: day = mild polish, backlit = shadow recovery, interior = brighten + neutralise
const photos = [
	['IMG_4931', 'site-lawn-turfing', 'day'],
	['IMG_4937', 'site-lawn-arches', 'day'],
	['IMG_4938', 'site-lawn-wide', 'day'],
	['IMG_4939', 'site-works', 'day'],
	['IMG_4940', 'site-entrance-works', 'day'],
	['IMG_4959', 'site-block-wide', 'backlit'],
	['IMG_4967', 'site-block-close', 'backlit'],
	['IMG_4970', 'site-block-sunset', 'backlit'],
	['IMG_4986', 'site-corridor', 'interior'],
	['IMG_4988', 'site-corridor-services', 'interior'],
	['IMG_4990', 'site-facade', 'day']
];

// shadowLift: tone curve y = x + k·x·(1−x)², brightens shadows while leaving highlights (sky) intact
const styles = {
	day: { shadowLift: 0.25, slope: 2, saturation: 1.12, brightness: 1.0 },
	backlit: { shadowLift: 1.1, slope: 3, saturation: 1.2, brightness: 1.03 },
	interior: { shadowLift: 0.35, slope: 2, saturation: 1.04, brightness: 1.05 }
};

async function enhance(path, s) {
	const { data, info } = await sharp(path).rotate().resize({ width: 1800, withoutEnlargement: true }).raw().toBuffer({ resolveWithObject: true });
	const lut = new Uint8Array(256);
	for (let i = 0; i < 256; i++) { const x = i / 255; lut[i] = Math.round(Math.min(1, x + s.shadowLift * x * (1 - x) ** 2) * 255); }
	for (let i = 0; i < data.length; i++) data[i] = lut[data[i]];
	return sharp(data, { raw: info })
		.clahe({ width: 160, height: 160, maxSlope: s.slope })
		.modulate({ saturation: s.saturation, brightness: s.brightness });
}

for (const [file, name, style] of photos) {
	const img = await enhance(join(SRC, `${file}.JPG`), styles[style]);
	await img
		.sharpen({ sigma: 0.6, m1: 0.4, m2: 1.5 })
		.jpeg({ quality: 74, mozjpeg: true, progressive: true })
		.toFile(join(OUT, `${name}.jpg`)); // metadata (incl. GPS) is dropped by default
	console.log(`${file} -> site/${name}.jpg (${style})`);
}
