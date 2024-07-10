import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { TopStory } from '@/lib/tools/search-internet';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export function TopStoryCarousel({ topStories }: { topStories: TopStory[] }) {
    return (
        <Carousel opts={{
            loop: true
        }} className="w-full max-w-5xl mx-auto mt-12">
            <CarouselContent>
                {topStories && topStories.map((tp, i) => (
                    <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card className="w-full h-full">
                                <CardHeader>
                                    <CardTitle className="text-xl line-clamp-2">{tp.title}</CardTitle>
                                    <CardDescription>{tp.source} • {tp.date}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative w-full h-48 mb-4">
                                        <Image
                                            src={tp.imageUrl}
                                            alt={tp.title}
                                            fill
                                            className="rounded-md"
                                            sizes={"(max-width: 768px) 50vw, 33vw"}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <a href={tp.link} target="_blank" rel="noopener noreferrer">Read More</a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};
