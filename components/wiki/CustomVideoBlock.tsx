import { createReactBlockSpec } from "@blocknote/react";
import { ResizableFileBlockWrapper } from "@blocknote/react";
import { RiVideoFill } from "react-icons/ri";

const getYoutubeVideoId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export const CustomVideoBlock = createReactBlockSpec(
  {
    type: "video",
    propSchema: {
      textAlignment: { default: "left" as const, values: ["left", "center", "right"] as const },
      backgroundColor: { default: "default" as const },
      name: { default: "" as const },
      url: { default: "" as const },
      caption: { default: "" as const },
      showPreview: { default: true as const },
      previewWidth: { default: undefined as number | undefined, type: "number" as const },
    },
    content: "none",
  },
  {
    render: (props) => {
      const url = props.block.props.url;
      const youtubeId = getYoutubeVideoId(url);

      return (
        <ResizableFileBlockWrapper {...(props as any)} buttonIcon={<RiVideoFill size={24} />}>
          {youtubeId ? (
            <div className="relative w-full aspect-video">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-md"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              className="bn-visual-media"
              src={url}
              controls
              width={props.block.props.previewWidth || undefined}
              contentEditable={false}
              draggable={false}
            />
          )}
        </ResizableFileBlockWrapper>
      );
    },
    parse: (element) => {
      if (element.tagName === "VIDEO") {
        return { url: (element as HTMLVideoElement).src };
      }
      if (element.tagName === "IFRAME") {
        return { url: (element as HTMLIFrameElement).src };
      }
      return undefined;
    },
    toExternalHTML: (props) => {
      const url = props.block.props.url;
      const youtubeId = getYoutubeVideoId(url);
      if (youtubeId) {
        return <iframe src={`https://www.youtube.com/embed/${youtubeId}`} />;
      }
      return <video src={url} />;
    },
  }
);
