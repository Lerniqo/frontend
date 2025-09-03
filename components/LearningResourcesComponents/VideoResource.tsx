export default function VideoResource({ url }: { url: string }) {
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;

    // Extract video ID from YouTube URL
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  const embedUrl = getYouTubeEmbedUrl(url);
  if (embedUrl) {
    return (
      <div className="bg-white rounded-2xl p-8">
        <div className="aspect-w-16 aspect-h-12 mb-6">
          <iframe
            src={embedUrl}
            className="w-full h-96 rounded-xl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Learning Video"
          ></iframe>
        </div>
        <div className="text-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>🎥</span>
            <span>Watch on YouTube</span>
          </a>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="text-6xl mb-4">🎥</div>
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Video Content
        </h3>
        <p className="text-slate-600 mb-6">
          This video resource is available at the link below:
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-2"
        >
          <span>🎥</span>
          <span>Open Video</span>
        </a>
      </div>
    );
  }
}
