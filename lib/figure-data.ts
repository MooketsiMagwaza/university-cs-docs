/**
 * Hand-drawn SVG figures live in JSON files under content/figure-data, mirroring the path of the page that shows them:
 *
 *   content/docs/sem3/csi247/01-java-fundamentals/notes/how-a-java-program-runs.mdx
 *   content/figure-data/sem3/csi247/01-java-fundamentals/notes/how-a-java-program-runs.json
 *
 * A page shows one with <SvgFigure src="<path without .json>" id="<figure id>">caption</SvgFigure>. The SVG is stored as a
 * string so the MDX stays small and the drawing can be regenerated without touching the lesson; it is repository content,
 * never user input. Colours come from the `.jf-figure` classes in app/styles/java-lessons.css, so a figure follows the
 * theme in light and dark.
 */

export type FigureEntry = {
  /** What the figure shows, for people who cannot see it. Also set as aria-label on the svg. */
  alt: string;
  /** The `<svg>...</svg>` markup. */
  svg: string;
};

export type FigureFile = Record<string, FigureEntry>;

const SAFE_PATH = /^[A-Za-z0-9][A-Za-z0-9/_.-]*$/;

export async function loadFigure(src: string, id: string): Promise<FigureEntry> {
  if (!SAFE_PATH.test(src) || src.includes('..')) {
    throw new Error(`SvgFigure: invalid src "${src}".`);
  }

  let file: FigureFile;
  try {
    const module_ = await import(`@/content/figure-data/${src}.json`);
    file = (module_.default ?? module_) as FigureFile;
  } catch {
    throw new Error(`SvgFigure: no figure file at content/figure-data/${src}.json.`);
  }

  const found = file[id];
  if (!found) {
    const known = Object.keys(file).join(', ') || 'none';
    throw new Error(`SvgFigure: figure "${id}" is not in content/figure-data/${src}.json (known figures: ${known}).`);
  }
  return found;
}
