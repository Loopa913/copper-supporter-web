import { BlockNoteSchema } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { WikiPageButtonBlock } from "@/components/wiki/WikiPageButtonBlock";

export const WikiPageButton = createReactBlockSpec(
  {
    type: "wikiButton",
    propSchema: {
      label: { default: "문서 보기" },
      targetSlug: { default: "" },
      targetTitle: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => <WikiPageButtonBlock {...props} />,
  }
);

export const wikiBlockNoteSchema = BlockNoteSchema.create().extend({
  blockSpecs: {
    wikiButton: WikiPageButton(),
  },
});
