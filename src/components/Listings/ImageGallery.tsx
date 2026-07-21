'use client'

import { Media as MediaType } from "@/payload-types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Media } from "../Media"
import AutoHeight from "embla-carousel-auto-height"
import Image from "next/image"
import { getVideoEmbedUrl } from "@/utilities/getVideoEmbedUrl"

interface ImageGalleryProps {
    imageGallery: (MediaType | number | string)[]
    videos?: {
        url: string;
        title?: string | null | undefined;
        id?: string | null | undefined;
    }[] | null | undefined
    virtualTourUrl?: string | null | undefined
}
export const ImageGallery: React.FC<ImageGalleryProps> = ({ imageGallery, videos, virtualTourUrl }) => {
    if ((!imageGallery || imageGallery.length === 0) && (!videos || videos.length === 0) && !virtualTourUrl) {
        return null
    }

    return <Carousel className="w-full [&>div]:w-full max-w-[calc(100vw-2.5rem)]" plugins={[AutoHeight()]}>
        <CarouselContent className="transition-[height] max-h-screen items-start">
            {imageGallery.length && (
                <CarouselItem className="pl-4 basis-full rounded-lg max-h-full">
                    {typeof imageGallery[0] !== 'string' ? <Media
                        resource={imageGallery[0] as MediaType | number | undefined}
                        className="w-full overflow-hidden relative aspect-[3/2]"
                        imgClassName="w-full object-contain h-full rounded-lg absolute inset-0"
                    /> : imageGallery[0] ? <div className="w-full overflow-hidden h-auto relative aspect-[3/2]">
                        <Image src={imageGallery[0] || ''} alt="" width={1280} height={1280} className='object-contain w-full h-full absolute inset-0 rounded-lg' />
                    </div> : null
                    }

                </CarouselItem>
            )}
            {videos?.length &&
                videos?.map((video) => {
                    // Helper to format video URLs for embedding
                    // const getEmbedUrl = (url: string) => {
                    //     if (!url) return "";
                    //     // YouTube
                    //     const ytMatch = url.match(
                    //         /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                    //     );
                    //     if (ytMatch) {
                    //         return `https://www.youtube.com/embed/${ytMatch[1]}`;
                    //     }
                    //     // Vimeo
                    //     const vimeoMatch = url.match(
                    //         /vimeo\.com\/(?:video\/)?([a-zA-Z0-9]+)(?:\/([a-zA-Z0-9]+))?/,
                    //     );
                    //     if (vimeoMatch) {
                    //         // If hash exists, append it
                    //         return vimeoMatch[2]
                    //             ? `https://player.vimeo.com/video/${vimeoMatch[1]}?h=${vimeoMatch[2]}`
                    //             : `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                    //     }
                    //     // Default: use the URL as-is
                    //     return url;
                    // };
                    return (
                        <CarouselItem key={video.id} className="pl-4 basis-full rounded-lg max-h-full">
                            <iframe
                                width="100%"
                                height="100%"
                                src={getVideoEmbedUrl(video.url)}
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; fullscreen; web-share; xr-spatial-tracking;"
                                className="w-full h-auto aspect-video border-none rounded-lg"
                                title={video.title || ""}
                                key={video.id}
                            ></iframe>
                        </CarouselItem>
                    );
                })
            }
            {virtualTourUrl && (
                <CarouselItem className="pl-4 basis-full rounded-lg max-h-full">
                    <iframe
                        width="100%"
                        height="100%"
                        src={virtualTourUrl}
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; fullscreen; web-share; xr-spatial-tracking;"
                        className="w-full h-auto aspect-[3/2] md:aspect-video border-none rounded-lg"
                    ></iframe>
                </CarouselItem>
            )}
            {imageGallery.length && imageGallery.map((image, index) => {
                if (index === 0) return;
                return (
                    <CarouselItem key={index} className=" pl-4 basis-full h-full rounded-lg max-h-full">
                        {typeof image !== 'string' ? <Media
                            resource={image as MediaType | number | undefined}
                            className="w-full overflow-hidden relative aspect-[3/2]"
                            imgClassName="w-full object-contain h-full rounded-lg absolute inset-0"
                        /> : image ? <div className="w-full overflow-hidden h-auto relative aspect-[3/2]">
                            <Image src={image || ''} alt="" width={1280} height={1280} className='object-contain w-full h-full absolute inset-0 rounded-lg' />
                        </div> : null
                        }

                    </CarouselItem>
                )
            })}

        </CarouselContent>
        <CarouselPrevious className="top-[calc(100%+.5rem)] left-auto right-10 translate-y-0 sm:-translate-y-1/2 sm:top-1/2 sm:left-2 p-2 bg-brand-gray-06 text-white border-none hover:text-white hover:bg-brand-gray-06/75 focus-visible:bg-brand-gray-06/75 rounded-sm [&_svg]:w-3" />
        <CarouselNext className="top-[calc(100%+.5rem)] left-auto right-0 translate-y-0 sm:-translate-y-1/2 sm:top-1/2 sm:right-2 p-2 bg-brand-gray-06 text-white border-none hover:text-white hover:bg-brand-gray-06/75 focus-visible:bg-brand-gray-06/75 rounded-sm [&_svg]:w-3" />
    </Carousel>

}