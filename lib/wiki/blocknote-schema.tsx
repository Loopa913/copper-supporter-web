import { BlockNoteSchema } from "@blocknote/core";
import { withMultiColumn } from "@blocknote/xl-multi-column";
import { createReactBlockSpec } from "@blocknote/react";
import { WikiPageButtonBlock } from "@/components/wiki/WikiPageButtonBlock";

export const WikiPageButton = createReactBlockSpec(
  {
    type: "wikiButton",
    propSchema: {
      label: { default: "" },
      targetSlug: { default: "" },
      targetTitle: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => <WikiPageButtonBlock {...props} />,
  }
);

export const wikiBlockNoteSchema = withMultiColumn(
  BlockNoteSchema.create().extend({
    blockSpecs: {
      wikiButton: WikiPageButton(),
    },
  })
);
