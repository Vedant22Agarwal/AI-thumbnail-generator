import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { type AspectRatio, colorSchemes, type ThumbnailStyle, type IThumbnail } from "../../public/assets/assets.ts"
import SoftBackDrop from '../components/SoftBackDrop';
import AspectRatioSelector from '../components/AspectRatioSelector.tsx';
import StyleSelector from '../components/StyleSelector.tsx';
import ColorSchemeSelector from '../components/ColorSchemeSelector.tsx';
import PreviewPanel from '../components/PreviewPanel.tsx';
import useAuthContext from '../contexts/authContext.tsx';
import toast from 'react-hot-toast';
import api from '../config/api.ts';


const Generate = () => {
  const { id } = useParams();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();


  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [colorSchema, setColorSchema] = useState<string>(colorSchemes[0].id);
  const [style, setstyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropDownOpen, setStyleDropDownOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      return toast.error("Please login to generate thumbnails.");
    }
    if (!title.trim()) {
      return toast.error("Please enter a title.");
    }
    setLoading(true);
    const payload = {
      title,
      prompt: additionalDetails,
      style,
      aspect_ratio: aspectRatio,
      color_scheme: colorSchema,
      text_overlay: true
    }
    const { data } = await api.post('/api/thumbnails/generate', payload)
    if (data.thumbnail) {

      navigate('/generate/' + data.thumbnail._id)

      toast.success(data.message)
    }
  };



  const fetchThumbnail = async () => {
    try {
      const { data } = await api.get(`/api/users/thumbnail/${id}`)

      if (data?.thumbnail) {
        setThumbnail(data?.thumbnail as IThumbnail)

        setLoading(!data?.thumbnail?.image_url)

        setTitle(data?.thumbnail?.title)
        setAdditionalDetails(data?.thumbnail?.user_prompt)
        setColorSchema(data?.thumbnail?.color_scheme)
        setAspectRatio(data?.thumbnail?.aspect_ratio)
        setstyle(data?.thumbnail?.style)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };
  const handleUpdate = async () => {
    if (!thumbnail) return;

    if (!title.trim()) {
      return toast.error("Please enter a title.");
    }

    try {
      setLoading(true);

      const payload = {
        title,
        prompt: additionalDetails,
        style,
        aspect_ratio: aspectRatio,
        color_scheme: colorSchema,
        text_overlay: true,
      };

      const { data } = await api.put(
        `/api/thumbnails/${thumbnail._id}`,
        payload
      );

      setThumbnail(data.thumbnail);
      setIsEditing(false);

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCancelEdit = () => {
    if (!thumbnail) return;

    setTitle(thumbnail.title);
    setAspectRatio(thumbnail.aspect_ratio);
    setAdditionalDetails(thumbnail.user_prompt ?? "");
    setColorSchema(thumbnail.color_scheme ?? colorSchemes[0].id);
    setstyle(thumbnail.style);

    setIsEditing(false);
  };
  useEffect(() => {
    if (isLoggedIn && id) {
      fetchThumbnail();
    }

    if (id && loading && isLoggedIn && !isEditing) {
      const interval = setInterval(() => {
        fetchThumbnail();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [id, isLoggedIn, loading, isEditing]);

  useEffect(() => {
    if ((!id) && thumbnail) {
      setThumbnail(null);
      setTitle("");
      setAdditionalDetails("");
      setAspectRatio("16:9");
      setColorSchema(colorSchemes[0].id);
      setstyle("Bold & Graphic");
      setLoading(false);

    }
  }, [pathname])
  return (
    <>
      <SoftBackDrop />
      <div className="pt-24 min-h-screen">
        <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8'>
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Left side */}
            <div className={`space-y-6 ${id && !isEditing && 'pointer-events-none'}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div className="">
                  <h2 className='text-xl font-bold text-zinc-100 mb-1'>Create Your Thumbnail</h2>
                  <p className='text-sm text-zinc-400'>Describe your vision and let AI bring it to life</p>
                </div>
                <div className="space-y-5 ">
                  {/* Title input */}
                  <div className="space-y-2">
                    <label className='block text-sm font-medium'>Title or Topic</label>
                    <input className='w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500' type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder='e.g, 10 Tips for Better Sleep' />
                    <div className="flex justify-end"><span className='text-xs text-zinc-400'>{title.length}/100</span></div>
                  </div>
                  {/* AspectRatioSelector */}
                  <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
                  {/* StyleSelector */}
                  <StyleSelector value={style} onChange={setstyle} isOpen={styleDropDownOpen} setIsOpen={setStyleDropDownOpen} />
                  {/* ColorSchemeSelector */}
                  <ColorSchemeSelector value={colorSchema} onChange={setColorSchema} />
                  {/* Additional Detail */}
                  <div className="space-y-2">
                    <label className='block text-sm font-medium'>Additional Prompts <span className='text-xs text-zinc-400'>(optional)</span></label>
                    <textarea className='w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none' value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} rows={3} placeholder='Add any specific elements, mood, or style prefrences...' />
                  </div>
                </div>
                {/* button */}
                {(!id || isEditing) && (
                  <button
                    onClick={isEditing ? handleUpdate : handleGenerate}
                    disabled={loading}
                    className="w-full rounded-xl bg-linear-to-b from-pink-500 to-pink-700 py-3.5 text-[15px] font-medium transition-all
      hover:from-pink-700 hover:to-pink-800
      disabled:cursor-not-allowed
      disabled:opacity-60
      disabled:hover:from-pink-500
      disabled:hover:to-pink-700"
                  >
                    {loading
                      ? isEditing
                        ? "Updating..."
                        : "Generating..."
                      : isEditing
                        ? "Update Thumbnail"
                        : "Generate Thumbnail"}
                  </button>
                )}
              </div>
            </div>
            {/* right side */}
            <div className="">
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                <h2 className='text-lg font-semibold text-zinc-100 mb-4'>Preview</h2>
                <PreviewPanel
                  thumbnail={thumbnail}
                  isLoading={loading}
                  aspectRatio={aspectRatio}
                  isEditing={isEditing}
                  onEdit={() => setIsEditing(true)}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Generate