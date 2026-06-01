"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import type { WikiPage } from "@/lib/data/wiki";
import { FadeIn } from "@/components/ui/FadeIn";

type WikiEditorProps = {
  page: WikiPage;
  editable?: boolean;
};

export function WikiEditor({ page, editable = true }: WikiEditorProps) {
  // Creates a new editor instance. 
  // initialContent can be set here if the page has valid BlockNote JSON content.
  // For now, if there is no content, we just show an empty editor or a placeholder.
  const editor = useCreateBlockNote({
    initialContent: page.content ? JSON.parse(page.content) : undefined,
  });

  return (
    <FadeIn className="mx-auto w-full max-w-[800px] flex-1 px-4 py-12 sm:px-12">
      <div className="mb-8 px-[50px]">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="mt-4 text-sm font-light text-text-muted">
            {page.excerpt}
          </p>
        )}
      </div>
      
      {/* BlockNote Editor View */}
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="light"
        className="font-pretendard"
        onChange={() => {
          // Here you would typically save the document
          // const newContent = JSON.stringify(editor.document);
        }}
      />
    </FadeIn>
  );
}
