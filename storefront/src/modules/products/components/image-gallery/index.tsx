"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-square w-full rounded-large bg-ui-bg-subtle border border-primary/10" />
    )
  }

  const activeImage = images[activeIndex]
  const thumbnails = images.slice(0, 3)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full rounded-large overflow-hidden bg-ui-bg-subtle border border-primary/10 shadow-sm">
        <Image
          src={activeImage.url!}
          alt={`Product image ${activeIndex + 1}`}
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {thumbnails.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {thumbnails.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative aspect-square rounded-large overflow-hidden bg-ui-bg-subtle border-2 transition-colors ${
                activeIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-primary/30"
              }`}
            >
              <Image
                src={image.url!}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 33vw, 16vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
