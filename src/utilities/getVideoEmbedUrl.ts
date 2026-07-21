export const getVideoEmbedUrl = (url: string) => {
    if (!url) return "";
    // YouTube
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(
        /vimeo\.com\/(?:video\/)?([a-zA-Z0-9]+)(?:\/([a-zA-Z0-9]+))?/,
    );
    if (vimeoMatch) {
        // If hash exists, append it
        return vimeoMatch[2]
            ? `https://player.vimeo.com/video/${vimeoMatch[1]}?h=${vimeoMatch[2]}`
            : `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    // Default: use the URL as-is
    return url;
};