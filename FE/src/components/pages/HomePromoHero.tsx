import Image from "next/image";
import Link from "next/link";

const promoImages = [
  {
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
    alt: "Athlete training in pink gym wear",
  },
  {
    src: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=85",
    alt: "Athlete training strength in a gym",
  },
  {
    src: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?auto=format&fit=crop&w=1200&q=85",
    alt: "Athlete training with battle ropes",
  },
];

export function HomePromoHero() {
  return (
    <section className="relative grid min-h-[520px] overflow-hidden bg-store-ink text-white md:grid-cols-3">
      {promoImages.map((image) => (
        <div key={image.src} className="relative min-h-[260px] md:min-h-[520px]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-10 sm:px-8 lg:px-12 lg:pb-12">
        <div className="max-w-xl text-left">
          <h2 className="text-3xl font-black uppercase leading-none tracking-normal text-white sm:text-4xl">
            New In: Flex
          </h2>
          <p className="mt-4 max-w-lg text-base font-medium leading-7 text-white sm:text-lg">
            Flex is back with statement branded straps, stretchy breathable
            fabric and seriously flattering designs.
          </p>
          <div className="mt-6 flex flex-row flex-wrap gap-5">
            <Link
              href="/products"
              className="inline-flex h-16 min-w-40 items-center justify-center bg-store-paper px-7 text-base font-medium text-store-ink-strong transition-colors hover:bg-store-surface"
            >
              Shop Now
            </Link>
            <Link
              href="/products/women"
              className="inline-flex h-16 min-w-40 items-center justify-center border border-white bg-transparent px-7 text-base font-medium text-white transition-colors hover:bg-white hover:text-store-ink-strong"
            >
              Shop Pink
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
