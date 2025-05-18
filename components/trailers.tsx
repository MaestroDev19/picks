import { getTrending, getTrailers } from '@/data/data'
import { Carousel, CarouselContent, CarouselItem, CarouselNext,
    CarouselPrevious, } from './ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

export async function Trailers() {
  const [all, _, __] = await getTrending()
  
  // Get a limited number of trending items to fetch trailers for
  const trendingItems = all.slice(0, 10)
  
  // Array to store items with valid trailers
  const itemsWithTrailers = []
  
  // Process each trending item
  for (const item of trendingItems) {
    try {
      // Make sure we have a valid media type
      if (!item.media_type || (item.media_type !== 'movie' && item.media_type !== 'tv')) {
        continue
      }
      
      // Get trailers for this item
      const trailers = await getTrailers(Number(item.id), item.media_type)
      
      // Only keep YouTube trailers
      const youtubeTrailers = trailers.filter(
        trailer => trailer.site?.toLowerCase() === 'youtube' && 
        ['trailer', 'teaser'].includes(trailer.type?.toLowerCase() || '')
      )
      
      // If we have trailers, add this item to our list
      if (youtubeTrailers.length > 0) {
        itemsWithTrailers.push({
          id: item.id,
          title: item.title || item.name || 'Unknown',
          mediaType: item.media_type,
          trailers: youtubeTrailers.slice(0, 1) // Just get the first trailer
        })
      }
    } catch (error) {
      console.error(`Error processing trailers for item ${item.id}:`, error)
      // Continue with next item instead of failing the whole component
    }
  }
  
  return (
    <div className="space-y-6 relative">
      <h2 className="text-2xl font-bold py-5">Latest Trailers</h2>
      
      {itemsWithTrailers.length > 0 ? (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          orientation="horizontal"
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {itemsWithTrailers.map(item => (
              item.trailers.map(trailer => (
                <CarouselItem key={trailer.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="space-y-2">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title={trailer.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0"
                      ></iframe>
                    </div>
                    <h3 className="font-medium text-base line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </CarouselItem>
              ))
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 sm:hidden">
            <CarouselPrevious className="static mx-1 translate-y-0" />
            <CarouselNext className="static mx-1 translate-y-0" />
          </div>
          <div className="hidden sm:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No trailers available at the moment
        </div>
      )}
    </div>
  )
}