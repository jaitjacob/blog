async function loadGoogleFont(
  font: string,
  text: string,
  weight: number,
  italic: boolean = false
): Promise<ArrayBuffer> {
  const family = italic
    ? `${font}:ital,wght@1,${weight}`
    : `${font}:wght@${weight}`;
  const API = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;

  const response = await fetch(API, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch font CSS from Google Fonts. Status: ${response.status} ${response.statusText}. URL: ${API}`
    );
  }

  const css = await response.text();

  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );

  if (!resource) {
    throw new Error(`Failed to extract font URL from CSS for font: ${font}`);
  }

  const res = await fetch(resource[1]);

  if (!res.ok) {
    throw new Error(
      `Failed to download font file from ${resource[1]}. Status: ${res.status}`
    );
  }

  return res.arrayBuffer();
}

async function loadGoogleFonts(
  text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "Cormorant Garamond",
      font: "Cormorant+Garamond",
      weight: 700,
      style: "italic",
      italic: true,
    },
    {
      name: "Inter",
      font: "Inter",
      weight: 400,
      style: "normal",
      italic: false,
    },
  ];

  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, font, weight, style, italic }) => {
      const data = await loadGoogleFont(font, text, weight, italic);
      return { name, data, weight, style };
    })
  );

  return fonts;
}

export default loadGoogleFonts;
