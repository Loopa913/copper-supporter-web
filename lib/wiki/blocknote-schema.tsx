import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { withMultiColumn } from "@blocknote/xl-multi-column";
import { createReactBlockSpec } from "@blocknote/react";
import { WikiPageButtonBlock } from "@/components/wiki/WikiPageButtonBlock";
import { YoutubeBlock } from "@/components/wiki/YoutubeBlock";

export const WikiPageButton = createReactBlockSpec(
  {
    type: "wikiButton",
    propSchema: {
      label: { default: "" as const },
      targetSlug: { default: "" as const },
      targetTitle: { default: "" as const },
    },
    content: "none",
  },
  {
    render: (props) => <WikiPageButtonBlock {...props} />,
  }
);

export const wikiBlockNoteSchema = withMultiColumn(
  BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      wikiButton: WikiPageButton(),
      youtube: YoutubeBlock(),
    },
  })
);