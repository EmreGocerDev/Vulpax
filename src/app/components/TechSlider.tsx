'use client';

import Image from 'next/image';

export default function TechSlider() {
  const technologies = [
    { name: 'Angular', icon: '/sliderbot/angular.svg' },
    { name: 'Auth.js', icon: '/sliderbot/authjs.svg' },
    { name: 'Bootstrap', icon: '/sliderbot/bootstrap.svg' },
    { name: 'C++', icon: '/sliderbot/c-plusplus.svg' },
    { name: '.NET', icon: '/sliderbot/dotnet.svg' },
    { name: 'Electron', icon: '/sliderbot/electron.svg' },
    { name: 'Firebase', icon: '/sliderbot/firebase-studio.svg' },
    { name: 'Illustrator', icon: '/sliderbot/illustrator.svg' },
    { name: 'JavaScript', icon: '/sliderbot/javascript.svg' },
    { name: 'Netlify', icon: '/sliderbot/netlify.svg' },
    { name: 'Next.js', icon: '/sliderbot/nextjs_icon_dark.svg' },
    { name: 'Node.js', icon: '/sliderbot/nodejs.svg' },
    { name: 'PostgreSQL', icon: '/sliderbot/postgresql.svg' },
    { name: 'Python', icon: '/sliderbot/python.svg' },
    { name: 'SQL Server', icon: '/sliderbot/sql-server.svg' },
    { name: 'Supabase', icon: '/sliderbot/supabase.svg' },
    { name: 'Tailwind CSS', icon: '/sliderbot/tailwindcss.svg' },
    { name: 'TypeScript', icon: '/sliderbot/typescript.svg' },
    { name: 'Vercel', icon: '/sliderbot/vercel_dark.svg' },
  ];

  return (
    <section className="py-20 overflow-hidden relative">
      {/* Left Fade - Wider */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-96 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
      
      {/* Right Fade - Wider */}
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-96 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Teknolojiler
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Modern ve güvenilir teknolojilerle projelerinizi hayata geçiriyoruz
        </p>
      </div>

      {/* Single Row - Left to Right */}
      <div className="relative">
        <div className="flex animate-scroll-left">
          {[...technologies, ...technologies, ...technologies].map((tech, index) => (
            <div
              key={`tech-${index}`}
              className="flex-shrink-0 mx-4 w-14 h-14 flex items-center justify-center group"
            >
              <div className="relative w-full h-full opacity-70 group-hover:opacity-100 brightness-90 group-hover:brightness-125 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
