const sponsors = [
 { name: 'Collaborator 1', src: '/logow1.jpeg' },
 { name: 'Collaborator 2', src: '/logow2.jpeg' },
 { name: 'Collaborator 3', src: '/logow3.jpeg' },
 { name: 'Collaborator 4', src: '/logow4.jpeg' },
];

function SponsorLogo({ name, src }) {
 return (
 <div className="flex h-12 min-w-32 items-center justify-center gap-2 px-5 sm:h-16 sm:min-w-48 sm:gap-3 sm:px-7">
 <img
 src={src}
 alt={name}
 draggable={false}
 className={`w-auto object-contain ${src === '/logow3.jpeg' || src === '/logow1.jpeg' ? 'h-36 sm:h-40' : 'h-24 sm:h-28'}`}
 />
 </div>
 );
}

export default function SponsorsMarquee() {
 const marqueeItems = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

 return (
 <section className="relative overflow-hidden bg-black pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-28 md:pb-24">
 <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
 <div className="mb-24 flex items-center justify-center gap-3">
 <div className="h-px w-16 sm:w-24 bg-white/40" />
 <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">
 Collaborators
 </span>
 <div className="h-px w-16 sm:w-24 bg-white/40" />
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
 src={sponsor.src}
 aria-hidden={index >= sponsors.length}
 />
 ))}
 </div>
 </div>
 </section>
 );
}