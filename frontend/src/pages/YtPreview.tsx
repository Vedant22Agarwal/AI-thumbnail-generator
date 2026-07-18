import { useSearchParams } from "react-router-dom";
import { yt_html } from "../../public/assets/assets.ts";

const YtPreview = () => {
  const [searchParams] = useSearchParams();

  const thumbnailUrl = searchParams.get("thumbnail_url") ?? "";
  const title = searchParams.get("title") ?? "";

  const html = yt_html
    .replace(/%%THUMBNAIL_URL%%/g, thumbnailUrl)
    .replace(/%%TITLE%%/g, title);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <iframe
        title="YouTube Preview"
        srcDoc={html}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default YtPreview;