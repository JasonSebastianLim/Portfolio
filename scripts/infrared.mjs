// makes the "infrared" layer for the hero lens.
// museums shoot paintings in IR to see the drawing underneath, this fakes that:
// drop the colour, pull the edges out, keep a bit of the tone so it isnt just lines.
// only needs a rerun if the paintings change. npm run infrared

import sharp from "sharp";

const jobs = [
  { from: "src/assets/paintings/ceiling.jpg", to: "src/assets/paintings/ceiling-ir.jpg" },
  { from: "src/assets/paintings/still-life.jpg", to: "src/assets/paintings/still-life-ir.jpg" },
  { from: "src/assets/paintings/barberini.jpg", to: "src/assets/paintings/barberini-ir.jpg" },
];

const WIDTH = 1600;
const EDGE = { width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] };

for (const { from, to } of jobs) {
  const grey = sharp(from).resize({ width: WIDTH }).greyscale();

  const edges = await grey.clone().blur(0.8).convolve(EDGE).linear(3.2, 0).negate().toBuffer();
  const tone = await grey.clone().normalise().linear(0.45, 140).toBuffer();

  await sharp(tone)
    .composite([{ input: edges, blend: "multiply" }])
    .tint({ r: 214, g: 200, b: 176 })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(to);

  console.log(to);
}
