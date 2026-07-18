import { useEffect, useState } from 'react'
import SoftBackDrop from '../components/SoftBackDrop.tsx'
import { type IThumbnail } from '../../public/assets/assets.ts'
import { ArrowUpRightIcon, DownloadIcon, ImageIcon, TrashIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import api from '../config/api.ts';
import useAuthContext from '../contexts/authContext.tsx';
import ConfirmModal from '../components/ConfirmModal.tsx';

interface ThumbnailResponse {
  message: string;
  thumbnails: IThumbnail[];
}
const MyGeneration = () => {
  const { isLoggedIn } = useAuthContext()
  const navigate = useNavigate();
  const aspectRationClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  }
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState(false);


  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchThumbnail = async () => {
    try {
      setLoading(true);

      const { data } = await api.get<ThumbnailResponse>(
        "/api/users/thumbnails"
      );

      setThumbnails(data.thumbnails || []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "thumbnail.png";

    a.click();

    window.URL.revokeObjectURL(url);
  }
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleteLoading(true);

      const { data } = await api.delete(
        `/api/thumbnails/delete/${selectedId}`
      );

      setThumbnails((prev) =>
        prev.filter((thumb) => thumb._id !== selectedId)
      );

      toast.success(data.message);

      setDeleteModalOpen(false);
      setSelectedId(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchThumbnail();
    }
  }, [isLoggedIn])
  return (
    <>
      <SoftBackDrop />

      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            My Generations
          </h1>

          <p className="mt-2 text-zinc-400">
            View and manage all your AI-generated thumbnails.
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[280px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {/* Empty */}

        {!loading && thumbnails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28">

            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <ImageIcon className="h-10 w-10 text-zinc-400" />
            </div>

            <h2 className="text-xl font-semibold text-white">
              No thumbnails yet
            </h2>

            <p className="mt-2 text-center text-sm text-zinc-400">
              Generate your first AI thumbnail to see it here.
            </p>
          </div>
        )}

        {/* Grid */}

        {!loading && thumbnails.length > 0 && (
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 2xl:columns-4">

            {thumbnails.map((thumb) => {

              const aspectClass =
                aspectRationClassMap[thumb.aspect_ratio || "16:9"];

              return (
                <div
                  key={thumb._id}
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className="group relative mb-8 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-pink-500/20 break-inside-avoid"
                >

                  {/* Image */}

                  <div
                    className={`relative overflow-hidden ${aspectClass} bg-zinc-900`}
                  >
                    {thumb.image_url ? (
                      <img
                        src={thumb.image_url}
                        alt={thumb.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                        No Image
                      </div>
                    )}

                    {thumb.isGenerating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="flex flex-col items-center gap-3">

                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />

                          <span className="text-sm font-medium text-white">
                            Generating...
                          </span>

                        </div>

                      </div>
                    )}

                    {/* Floating buttons */}

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-3 right-3 flex gap-2 opacity-100 sm:opacity-0 sm:translate-y-3 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300"
                    >
                      <button
                        // onClick={() => handleDelete(thumb._id)}
                        onClick={() => {
                          setSelectedId(thumb._id);
                          setDeleteModalOpen(true);
                        }}
                        className="rounded-full bg-black/60 p-2 backdrop-blur transition hover:bg-red-400"
                      >
                        <TrashIcon className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() =>
                          thumb.image_url &&
                          handleDownload(thumb.image_url)
                        }
                        className="rounded-full bg-black/60 p-2 backdrop-blur transition hover:bg-pink-400">
                        <DownloadIcon className="h-4 w-4 text-white" />
                      </button>

                      <Link
                        target="_blank"
                        to={`/preview?thumbnail_url=${thumb.image_url!}&title=${thumb.title}`}
                        className="rounded-full bg-black/60 p-2 backdrop-blur transition hover:bg-pink-400"
                      >
                        <ArrowUpRightIcon className="h-4 w-4 text-white" />
                      </Link>

                    </div>
                  </div>

                  {/* Content */}

                  <div className="space-y-3 p-4">
                    <h3 className="line-clamp-2 text-base font-semibold text-white">
                      {thumb.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                        {thumb.style}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                        {thumb.color_scheme}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {thumb.createdAt
                        ? new Date(thumb.createdAt).toDateString()
                        : ""}
                    </p>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Thumbnail?"
        description="This action cannot be undone. Are you sure you want to permanently delete this thumbnail?"
        loading={deleteLoading}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedId(null);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default MyGeneration