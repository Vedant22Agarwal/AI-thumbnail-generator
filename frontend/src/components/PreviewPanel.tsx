import type { AspectRatio, IThumbnail } from "../../public/assets/assets";
import {
  DownloadIcon,
  ImageIcon,
  Loader2Icon,
  PencilIcon,
} from "lucide-react";

type PreviewPanelProps = {
  thumbnail: IThumbnail | null;
  isLoading: boolean;
  aspectRatio: AspectRatio;

  showEdit?: boolean;
  onEdit?: () => void;
};
const PreviewPanel = ({
  thumbnail,
  isLoading,
  aspectRatio,
}: PreviewPanelProps) => {
  const aspectClasses: Record<AspectRatio, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const onDownload = () => {
    if (!thumbnail?.image_url) return;

    const link = document.createElement("a");
    link.href = thumbnail?.image_url.replace('/upload', "/upload/fl_attachment");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const onEdit = () => {

  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
      <div
        className={`relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900 ${aspectClasses[aspectRatio]}`}
      >
        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-md">
            <Loader2Icon className="size-10 animate-spin text-pink-400" />

            <div className="text-center">
              <p className="text-base font-semibold text-white">
                AI is creating your thumbnail...
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                This usually takes a few seconds.
              </p>
            </div>
          </div>
        )}

        {/* Thumbnail Preview */}
        {!isLoading && thumbnail?.image_url && (
          <div className="group relative h-full w-full">
            <img
              src={thumbnail.image_url}
              alt={thumbnail.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 flex items-end justify-center gap-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                onClick={onDownload}
                type="button"
                className="mb-6 flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg transition hover:scale-105 active:scale-95"
              >
                <DownloadIcon className="size-4" />
                Download Thumbnail
              </button>
              <button
                onClick={onEdit}
                type="button"
                className="mb-6 flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 active:scale-95"
              >
                <PencilIcon className="size-4" />
                Edit Thumbnail
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !thumbnail?.image_url && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-400/10">
              <ImageIcon className="size-10 text-pink-200" />
            </div>

            <div className="px-6 text-center">
              <h3 className="text-lg font-semibold text-zinc-100">
                No Thumbnail Yet
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Fill out the form on the left and click
                <span className="font-medium text-pink-400">
                  {" "}
                  Generate Thumbnail
                </span>{" "}
                to see your AI-generated preview here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;