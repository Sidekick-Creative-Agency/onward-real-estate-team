'use client'

import { Media as MediaType } from "@/payload-types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Media } from "../Media"
import AutoHeight from "embla-carousel-auto-height"
import Image from "next/image"

export const ImageGallery: React.FC<{ imageGallery: (MediaType | number | string)[] }> = ({ imageGallery }) => {
    return <Carousel className="[&>div]:rounded-md sm:[&>div]:rounded-lg [&>div]:w-full" plugins={[AutoHeight()]}>
        <CarouselContent className="ml-0 max-h-[calc(100vh-2.5rem)] transition-[height] items-start">
            {imageGallery && imageGallery.length > 0 && imageGallery.map((image, index) => {
                return (
                    <CarouselItem key={index} className=" pl-0 basis-full rounded-lg">
                        {typeof image !== 'string' ? <Media
                            resource={image as MediaType | number | undefined}
                            className="w-full overflow-hidden relative"
                            imgClassName="w-full object-contain h-auto"
                        /> : image ? <div className="w-full overflow-hidden h-auto relative">
                            <Image src={image || ''} alt="" width={1280} height={1280 * (2 / 3)} className='object-contain w-full h-auto' />
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