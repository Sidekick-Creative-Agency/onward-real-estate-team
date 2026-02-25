'use client'

import { TeamMember } from '@/payload-types'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Media } from '@/components/Media'

interface TestimonialCarouselProps {
  testimonials: TeamMember['details']['testimonials']
}
export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 10000,
        }),
      ]}
      className="relative"
    >
      <CarouselContent>
        {testimonials &&
          testimonials.length > 0 &&
          testimonials.map((testimonial) => {
            return (
              <CarouselItem key={testimonial.id} className="w-full py-28 sm:py-32 relative">
                <Media
                  resource={testimonial.image}
                  className="absolute top-0 left-0 w-full h-full z-0"
                  imgClassName="relative w-full h-full object-cover -z-10"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
                <div className="container max-w-[76rem] flex flex-col gap-10 items-center relative z-20">
                  <span className="text-center uppercase leading-none font-bold text-brand-offWhite tracking-wider z-10">
                    Testimonials
                  </span>
                  <div className="flex gap-2 justify-center relative">
                    {Array.from(Array(testimonial.rating || 0).keys()).map((_, index) => {
                      return (
                        <StarIcon
                          className="w-8 h-auto text-brand-offWhite fill-brand-offWhite"
                          key={index}
                        />
                      )
                    })}
                  </div>
                  <p className="text-brand-offWhite text-2xl sm:text-[2rem] font-bold max-w-none p-0 leading-tight text-center">
                    {testimonial.testimonial}
                  </p>
                  <span className="font-light leading-normal text-lg text-brand-offWhite text-center">
                    {testimonial.name}
                  </span>
                </div>
              </CarouselItem>
            )
          })}
      </CarouselContent>
    </Carousel>
  )
}

const StarIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" {...props}>
    <path d="M288.1 0l63.5 195.6H557.2L390.9 316.4 454.4 512 288.1 391.1 121.7 512l63.5-195.6L18.9 195.6H224.5L288.1 0z" />
  </svg>
)
