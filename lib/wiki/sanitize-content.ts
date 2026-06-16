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
]);

const REMOVED_BLOCK_TYPES = new Set(["wikiButton"]);

type RawBlock = {
  id?: string;
  type?: string;
  props?: Record<string, unknown>;
  content?: unknown;
  children?: RawBlock[];
};

function wikiButtonToParagraph(block: RawBlock): RawBlock | null {
  const props = block.props as { label?: string; targetTitle?: string } | undefined;
  const label = props?.label?.trim() || props?.targetTitle?.trim();
  if (!label) return null;

  return {
    type: "paragraph",
    content: [{ type: "text", text: `[이동 버튼: ${label}]`, styles: {} }],
  };
}

function sanitizeBlockList(blocks: RawBlock[]): { blocks: RawBlock[]; wasSanitized: boolean } {
  let wasSanitized = false;
  const sanitized: RawBlock[] = [];

  for (const block of blocks) {
    if (!block || typeof block !== "object") {
      wasSanitized = true;
      continue;
    }

    const type = block.type || "";

    if (REMOVED_BLOCK_TYPES.has(type) || !SUPPORTED_BLOCK_TYPES.has(type)) {
      wasSanitized = true;

      if (type === "wikiButton") {
        const fallback = wikiButtonToParagraph(block);
        if (fallback) sanitized.push(fallback);
      }
      continue;
    }

    const next: RawBlock = { ...block };

    if (Array.isArray(block.children) && block.children.length > 0) {
      const childResult = sanitizeBlockList(block.children);
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
