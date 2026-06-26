import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Home } from "@/lib/api-types";

/**
 * Hero banner rail built on the embla-based Carousel. Banner links carry query
 * strings, so we use a plain anchor instead of a typed Link.
 */
export function BannerCarousel({ banners }: { banners: Home["banners"] }) {
  return (
    <Carousel opts={{ loop: true, align: "start" }} className="w-full">
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <a
              href={banner.link}
              className="relative block aspect-[1200/420] w-full overflow-hidden rounded-lg">
              <img
                src={banner.image}
                alt={banner.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/55 to-transparent p-5">
                <span className="text-lg font-bold text-white md:text-2xl">
                  {banner.title}
                </span>
              </div>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
