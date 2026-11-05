import { getImage } from "astro:assets";
import ceiling from "@/assets/paintings/ceiling.jpg";
import ceilingIr from "@/assets/paintings/ceiling-ir.jpg";
import stillLife from "@/assets/paintings/still-life.jpg";
import stillLifeIr from "@/assets/paintings/still-life-ir.jpg";

const webp = async (src: ImageMetadata, width: number) =>
  (await getImage({ src, width, format: "webp", quality: 68 })).src;

// css backgrounds and not <img>, an <img> downloads even when its theme is hidden
export async function heroImages() {
  return {
    day: { wide: await webp(ceiling, 1500), narrow: await webp(ceiling, 820), ir: await webp(ceilingIr, 1500) },
    night: { wide: await webp(stillLife, 1500), narrow: await webp(stillLife, 820), ir: await webp(stillLifeIr, 1500) },
  };
}
