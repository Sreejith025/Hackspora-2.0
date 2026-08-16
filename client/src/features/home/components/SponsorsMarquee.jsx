// Replace `src` on each SponsorLogo with the real image path (e.g. '/logos/google.svg')
// once available. All tiles use a black/white monochrome palette so they read as a
// unified set; swap the entire <SponsorLogo> body for an <img> when adding real assets.
const sponsors = [
 { name: 'TECHNO VERSATILE', short: 'TV' },
 { name: 'SYNVOLVE INTELLIS', short: 'SI' },
 { name: 'NEXTSTEP LEARNING', short: 'NL' },
 { name: 'LITZ TECH', short: 'LT' },
];

function SponsorLogo({ name, short }) {
 return (
 <div className="flex h-12 min-w-32 items-center justify-center gap-2 px-5 sm:h-16 sm:min-w-48 sm:gap-3 sm:px-7">
 <div
 className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl border border-white/30 bg-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
 aria-hidden="true"
 >
 <span className="text-[10px] sm:text-xs font-black tracking-tight text-white">
 {short}
 </span>
 </div>
 <span className="text-xs font-black uppercase tracking-[0.14em] text-white sm:text-base sm:tracking-[0.18em]">
 {name}
 </span>
 </div>
 );
}

export default function SponsorsMarquee() {
 const marqueeItems = [...sponsors, ...sponsors];

 return (
 <section className="relative overflow-hidden bg-black py-10 sm:py-14 md:py-16">
 <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
 <div className="mb-4 flex items-center justify-center gap-3">
 <span className="text-sm font-extrabold uppercase tracking-[0.32em] text-white/80 sm:text-base md:text-lg lg:text-xl">
 Sponsors
 </span>
 </div>
 </div>

 <div className="relative pt-6 sm:pt-8 md:pt-10">
 <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black to-transparent" />
 <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black to-transparent" />

 <div className="flex w-max animate-sponsor-marquee items-center gap-4">
 {marqueeItems.map((sponsor, index) => (
 <SponsorLogo
 key={`${sponsor.name}-${index}`}
 name={sponsor.name}
 short={sponsor.short}
 aria-hidden={index >= sponsors.length}
 />
 ))}
 </div>
 </div>
 </section>
 );
}