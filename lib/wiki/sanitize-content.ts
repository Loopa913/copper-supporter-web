const SUPPORTED_BLOCK_TYPES = new Set([
  "paragraph",
  "heading",
  "bulletListItem",
  "numberedListItem",
  "checkListItem",
  "toggleListItem",
  "quote",
  "codeBlock",
  "table",
  "image",
  "video",
  "audio",
  "file",
  "wikiButton",
  "columnList",
  "column",
]);

const REMOVED_BLOCK_TYPES = new Set<string>([]);

type RawBlock = {
  id?: string;
  type?: string;
  props?: Record<string, unknown>;
  content?: unknown;
  children?: RawBlock[];
};

type SanitizeContext = "root" | "columnList" | "column";

function sanitizeBlockList(
  blocks: RawBlock[],
  context: SanitizeContext = "root"
): { blocks: RawBlock[]; wasSanitized: boolean } {
  let wasSanitized = false;
  const sanitized: RawBlock[] = [];

  for (const block of blocks) {
    if (!block || typeof block !== "object") {
      wasSanitized = true;
      continue;
    }

    const type = block.type || "";

    if (context === "columnList" && type !== "column") {
      wasSanitized = true;
      continue;
    }

    if (REMOVED_BLOCK_TYPES.has(type) || !SUPPORTED_BLOCK_TYPES.has(type)) {
      wasSanitized = true;
      continue;
    }

    const next: RawBlock = { ...block };

    if (Array.isArray(block.children) && block.children.length > 0) {
      const childContext: SanitizeContext =
        type === "columnList" ? "columnList" : type === "column" ? "column" : context;

      const childResult = sanitizeBlockList(block.children, childContext);
      next.children = childResult.blocks;
      if (childResult.wasSanitized) wasSanitized = true;
    }

    sanitized.push(next);
  }

  return { blocks: sanitized, wasSanitized };
}

export function sanitizeWikiInitialContent(content?: string): {
  blocks: RawBlock[] | undefined;
  wasSanitized: boolean;
} {
  if (!content?.trim()) {
    return { blocks: undefined, wasSanitized: false };
  }

  try {
    const parsed = JSON.parse(content) as unknown;
    if (!Array.isArray(parsed)) {
      return { blocks: undefined, wasSanitized: true };
    }

    const { blocks, wasSanitized } = sanitizeBlockList(parsed as RawBlock[]);
    if (blocks.length === 0 && parsed.length > 0) {
      return { blocks: undefined, wasSanitized: true };
    }

    return { blocks, wasSanitized };
  } catch {
    return { blocks: undefined, wasSanitized: true };
  }
}
