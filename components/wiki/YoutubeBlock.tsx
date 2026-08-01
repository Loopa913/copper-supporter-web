import { createReactBlockSpec } from "@blocknote/react";
import { ResizableFileBlockWrapper } from "@blocknote/react";
import { RiYoutubeFill } from "react-icons/ri";

const getYoutubeVideoId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export const YoutubeBlock = createReactBlockSpec(
  {
    type: "youtube",
    propSchema: {
      textAlignment: { default: "left", values: ["left", "center", "right"] },
      backgroundColor: { default: "default" },
      name: { default: "" },
      url: { default: "" },
      caption: { default: "" },
      showPreview: { default: true },
      previewWidth: { default: 512 },
    },
    content: "none",
  },
  {
    render: (props) => {
      const url = props.block.props.url;
      const youtubeId = getYoutubeVideoId(url);

      if (!youtubeId) {
        return (
          <div className="p-4 bg-surface-warm text-text-muted rounded-md text-sm text-center">
            유효한 유튜브 링크가 아닙니다.
          </div>
        );
      }

      return (
        <ResizableFileBlockWrapper {...(props as any)} buttonIcon={<RiYoutubeFill size={24} />}>
          <div className="relative w-full aspect-video">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-md"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </ResizableFileBlockWrapper>
      );
    },
  }
);
