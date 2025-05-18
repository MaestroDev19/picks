'use client'
import{useSetAtom, useAtomValue, useAtom, useStore} from 'jotai'
import {Carousel, CarouselContent, CarouselItem} from './ui/carousel'
import { Button } from './ui/button'
import { watchlistAtom } from '@/data/store'
import { convertToDecimal } from '@/lib/func'
import { Trending } from '@/data/types'
import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'

export default function Slider({contents}:{contents:Trending[]}){
    const[watchlist,setWatchlist] = useAtom(watchlistAtom,{
        store:useStore()
    })
    const trimmedcontents: Trending[] = useMemo(() => 
        contents
            .filter((trending) => {
                return Boolean(
                    trending.overview && 
                    trending.poster_path && 
                    trending.backdrop_path
                );
            })
            .sort((a, b) => {
                const scoreA = a.vote_average || 0;
                const scoreB = b.vote_average || 0;
                return scoreB - scoreA;
            }),
        [contents]
    );
    return(
        <Carousel 
        opts ={{
            align:'start',
            loop:true,
        }}
        plugins={[Autoplay({delay:3000})]}
        className="w-full"
        >
           <CarouselContent className='-ml-2 md:-ml-4'>
            {trimmedcontents.map((content,index)=>{
               return <CarouselItem key={content.id} className='-pl-2 md:-pl-4'>
                  <div className='relative w-full aspect-[7/9] md:aspect-[14/9] lg:aspect-[21/9] overflow-hidden rounded-lg'>
                    <Image 
                      src ={`${process.env.NEXT_PUBLIC_TMDB_IMAGE}${content.backdrop_path}`}
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                      alt={(content.title || content.name) ?? 'Movie poster'}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className='absolute inset-0 bg-zinc-900/70'></div>
                    <div className='absolute inset-0 p-8 md:p-10 lg:p-12'>
                      <div className='flex flex-col h-full justify-center '>
                        <h2 className='text-white/90 text-2xl md:text-3xl lg:text-4xl font-bold mb-2'>
                          {content.title || content.name}
                        </h2>
                        <p className='text-white/80 text-sm md:text-base line-clamp-2 md:line-clamp-3 md:w-1/3 '>
                          {content.overview}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>   
            })}
           </CarouselContent>
        </Carousel>
    )
}