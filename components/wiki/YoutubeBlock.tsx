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
      url: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => {
      const url = props.block.props.url;
      const youtubeId = getYoutubeVideoId(url);

      return (
        <div className="relative w-full aspect-video my-4">
          {youtubeId ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-md"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
              <span className="text-gray-500">유효하지 않은 유튜브 링크입니다.</span>
            </div>
          )}
        </div>
      );
    },
    toExternalHTML: (props) => {
      const url = props.block.props.url;
      const youtubeId = getYoutubeVideoId(url);
      if (youtubeId) {
        return <iframe src={`https://www.youtube.com/embed/${youtubeId}`} />;
      }
      return <a href={url}>{url}</a>;
    },
  }
);
