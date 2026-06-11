import fs from "node:fs";
import path from "node:path";

async function loadLocalFont(fontPath: string): Promise<ArrayBuffer> {
  const filePath = path.resolve(process.cwd(), fontPath);
  const buffer = fs.readFileSync(filePath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
}

async function loadGoogleFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fonts = [
    {
      name: "Anthropic Serif",
      data: await loadLocalFont(
        "src/assets/fonts/WOFF2/Anthropic_Serif_Italics.woff2"
      ),
      weight: 700,
      style: "italic",
    },
    {
      name: "Anthropic Sans",
      data: await loadLocalFont(
        "src/assets/fonts/WOFF2/Anthropic_Sans_Serif_Normal.woff2"
      ),
      weight: 400,
      style: "normal",
    },
  ];

  return fonts;
}

export default loadGoogleFonts;
