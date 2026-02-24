export default function AwardBanner() {
  return (
    <section className="bg-primary py-12 lg:py-16 text-center text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-0 size-64 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 size-96 border-4 border-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="content-container relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center gap-2 lg:gap-4 mb-6 lg:mb-8" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-amber-accent text-3xl lg:text-5xl">
                ★
              </span>
            ))}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            5x Gold Medal Winner at Blas na hÉireann
          </h2>
          <p className="text-sm lg:text-base text-white/90 inline-block px-4 py-1 rounded-full bg-white/20 mb-4 lg:mb-6 font-medium tracking-wide">
            THE IRISH FOOD AWARDS
          </p>
          <p className="text-base lg:text-xl text-white/80 max-w-2xl mx-auto italic">
            Recognizing the highest quality Irish producers who honor
            traditional methods and exceptional taste.
          </p>
        </div>
      </div>
    </section>
  )
}
