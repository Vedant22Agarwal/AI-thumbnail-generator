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
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
};

const PreviewPanel = ({
  thumbnail,
  isLoading,
  aspectRatio,
  isEditing,
  onEdit,
  onCancel,
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

  return (
    <div className={`mx-auto w-full max-w-2xl rounded-2xl border bg-white/5 p-4 shadow-2xl backdrop-blur-xl transition-colors duration-300 ${isEditing ? 'border-pink-500/50' : 'border-white/10'}`}>
      <div
        className={`relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900 ${aspectClasses[aspectRatio]}`}
      >
        {/* Loading State */}
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
              className={`h-full w-full object-cover transition duration-300 ${isEditing ? 'scale-105 blur-[2px]' : 'group-hover:scale-105'}`}
            />

            {/* Editing Badge (Shows only when editing) */}
            {isEditing && (
               <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-pink-600/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
                 <PencilIcon className="size-3" />
                 Editing Mode
               </div>
            )}

            {/* Action Buttons Overlay */}
            {/* NOTE: Changes to opacity-100 automatically if isEditing is true */}
            <div className={`absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="mb-6 flex gap-3">
                <button
                  onClick={onDownload}
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg transition hover:scale-105 active:scale-95"
                >
                  <DownloadIcon className="size-4" />
                  Download
                </button>

                {!isEditing ? (
                  <button
                    onClick={onEdit}
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-700 hover:scale-105 active:scale-95"
                  >
                    Edit Thumbnail
                  </button>
                ) : (
                  <button
                    onClick={onCancel}
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-zinc-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-600 hover:scale-105 active:scale-95"
                  >
                    Cancel Updates
                  </button>
                )}
              </div>
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
                <span className="font-medium text-pink-400"> Generate Thumbnail</span> to see your AI-generated preview here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;