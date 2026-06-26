import type { Home } from "@/lib/api-types";

/**
 * Lightweight scroll-snap carousel — avoids pulling in a carousel dependency
 * while still giving the swipe/scroll behaviour momo's hero rail has. Banner
 * links carry query strings, so we use a plain anchor instead of a typed Link.
 */
export function BannerCarousel({ banners }: { banners: Home["banners"] }) {
  return (
    <div className="flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
      {banners.map((banner) => (
        <a
          key={banner.id}
          href={banner.link}
          className="relative aspect-[1200/420] w-[85%] shrink-0 snap-center overflow-hidden rounded-lg md:w-full">
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
      ))}
    </div>
  );
}
