import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function BrandStory() {
  return (
    <section className="bg-background-light py-16 lg:py-20">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="size-px w-20 bg-primary/30" />
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-primary">
              From the Hedgerows of Ireland
            </h2>
            <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
              Nature&apos;s Elixir began in a small cottage in West Cork, born
              from a passion for traditional Irish herbalism. Every product we
              create is a tribute to the wisdom of generations past, blended with
              modern botanical science.
            </p>
            <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
              We believe health shouldn&apos;t be complicated. It should be as
              simple as a cup of tea, as natural as the rain on the heather, and
              as honest as the soil beneath our feet.
            </p>
            <LocalizedClientLink
              href="/our-story"
              className="inline-flex items-center text-primary font-bold text-base lg:text-lg hover:gap-4 gap-2 transition-all"
            >
              Read Our Story
              <span aria-hidden>→</span>
            </LocalizedClientLink>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="relative w-full h-[320px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80"
                alt="Misty green Irish countryside landscape"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-background-light p-4 lg:p-6 rounded-lg shadow-xl border border-primary/10 hidden md:block">
              <span className="font-serif text-2xl lg:text-3xl font-bold text-primary italic">
                Est. 1994
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
