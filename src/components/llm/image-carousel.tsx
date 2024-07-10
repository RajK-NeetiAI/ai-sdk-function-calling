"use client";

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { Images } from "@/lib/tools/search-internet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react" // Import icons for navigation

export function ImageCarousel({ images }: { images: Images[] }) {
    const [validImages, setValidImages] = React.useState<Images[]>(images)
    const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null)

    const handleImageError = (failedImageUrl: string) => {
        setValidImages(current => current.filter(img => img.imageUrl !== failedImageUrl))
    }

    const renderImage = (image: Images, size: 'small' | 'large') => {
        return (
            <Image
                src={image.imageUrl}
                alt={image.title || "Image"}
                onError={() => handleImageError(image.imageUrl)}
                fill
                sizes={size === 'small' ? '(max-width: 768px) 50vw, 33vw' : '80vw'}
                className="object-contain"
            />
        )
    }

    const handlePrevImage = () => {
        setSelectedImageIndex(prev =>
            prev !== null ? (prev - 1 + validImages.length) % validImages.length : null
        )
    }

    const handleNextImage = () => {
        setSelectedImageIndex(prev =>
            prev !== null ? (prev + 1) % validImages.length : null
        )
    }

    if (validImages.length === 0) {
        return null;
    }

    return (
        <>
            <Carousel
                opts={{
                    align: "start",
                    loop: true
                }}
                className="w-full"
            >
                <CarouselContent>
                    {validImages.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <Card
                                className="cursor-pointer"
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <CardContent className="relative aspect-square p-6">
                                    {renderImage(image, 'small')}
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                    <ScrollArea className="h-full w-full">
                        <div className="flex items-center justify-center p-6">
                            <button onClick={handlePrevImage} className="p-2">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <div className="relative w-full" style={{ height: 'calc(80vh - 4rem)' }}>
                                {selectedImageIndex !== null && renderImage(validImages[selectedImageIndex], 'large')}
                            </div>
                            <button onClick={handleNextImage} className="p-2">
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>
                    </ScrollArea>
                    {selectedImageIndex !== null && validImages[selectedImageIndex].title && (
                        <p className="mt-4 text-center">{validImages[selectedImageIndex].title}</p>
                    )}
                    <DialogDescription></DialogDescription>
                </DialogContent>
            </Dialog>
        </>
    )
};