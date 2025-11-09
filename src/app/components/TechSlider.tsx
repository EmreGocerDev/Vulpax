'use client';

import Image from 'next/image';

export default function TechSlider() {
  const technologies = [
    { 
      name: 'Angular', 
      icon: '/sliderbot/angular.svg',
      description: 'Google tarafından geliştirilen güçlü frontend framework. Kurumsal ölçekli web uygulamaları geliştirmek için kullanıyoruz.'
    },
    { 
      name: 'Auth.js', 
      icon: '/sliderbot/authjs.svg',
      description: 'Modern kimlik doğrulama çözümü. Güvenli kullanıcı girişi ve oturum yönetimi için tercih ediyoruz.'
    },
    { 
      name: 'Bootstrap', 
      icon: '/sliderbot/bootstrap.svg',
      description: 'Popüler CSS framework. Hızlı ve responsive web arayüzleri oluşturmak için kullanıyoruz.'
    },
    { 
      name: 'C++', 
      icon: '/sliderbot/c-plusplus.svg',
      description: 'Yüksek performanslı programlama dili. Sistem programlama ve performans kritik uygulamalar için kullanıyoruz.'
    },
    { 
      name: '.NET', 
      icon: '/sliderbot/dotnet.svg',
      description: 'Microsoft\'un güçlü geliştirme platformu. Enterprise uygulamalar ve backend servisleri için tercih ediyoruz.'
    },
    { 
      name: 'Electron', 
      icon: '/sliderbot/electron.svg',
      description: 'Cross-platform masaüstü uygulama framework. Web teknolojileriyle masaüstü uygulamaları geliştiriyoruz.'
    },
    { 
      name: 'Firebase', 
      icon: '/sliderbot/firebase-studio.svg',
      description: 'Google\'ın backend-as-a-service platformu. Gerçek zamanlı veritabanı ve hosting çözümleri için kullanıyoruz.'
    },
    { 
      name: 'Illustrator', 
      icon: '/sliderbot/illustrator.svg',
      description: 'Vektör grafik tasarım yazılımı. Logo, ikon ve profesyonel grafik tasarımları oluşturmak için kullanıyoruz.'
    },
    { 
      name: 'JavaScript', 
      icon: '/sliderbot/javascript.svg',
      description: 'Web\'in temel programlama dili. Dinamik ve etkileşimli web uygulamaları geliştirmek için vazgeçilmez teknolojimiz.'
    },
    { 
      name: 'Netlify', 
      icon: '/sliderbot/netlify.svg',
      description: 'Modern web hosting ve deployment platformu. JAMstack uygulamalarını hızlı ve kolay deploy ediyoruz.'
    },
    { 
      name: 'Next.js', 
      icon: '/sliderbot/nextjs_icon_dark.svg',
      description: 'React tabanlı full-stack framework. SEO dostu, hızlı yüklenen ve performans odaklı web siteleri geliştiriyoruz.'
    },
    { 
      name: 'Node.js', 
      icon: '/sliderbot/nodejs.svg',
      description: 'Sunucu tarafında JavaScript çalıştıran runtime ortamı. Backend API\'leri ve sunucu uygulamaları geliştiriyoruz.'
    },
    { 
      name: 'PostgreSQL', 
      icon: '/sliderbot/postgresql.svg',
      description: 'Güçlü ve güvenilir açık kaynak veritabanı. Kompleks veri ilişkileri gerektiren uygulamalar için tercih ediyoruz.'
    },
    { 
      name: 'Python', 
      icon: '/sliderbot/python.svg',
      description: 'Çok yönlü programlama dili. Veri analizi, otomasyon, backend ve yapay zeka projeleri için kullanıyoruz.'
    },
    { 
      name: 'SQL Server', 
      icon: '/sliderbot/sql-server.svg',
      description: 'Microsoft\'un kurumsal veritabanı yönetim sistemi. Büyük ölçekli enterprise uygulamalar için kullanıyoruz.'
    },
    { 
      name: 'Supabase', 
      icon: '/sliderbot/supabase.svg',
      description: 'Açık kaynak Firebase alternatifi. PostgreSQL tabanlı backend ve authentication servisleri için tercih ediyoruz.'
    },
    { 
      name: 'Tailwind CSS', 
      icon: '/sliderbot/tailwindcss.svg',
      description: 'Utility-first CSS framework. Hızlı, tutarlı ve özelleştirilebilir tasarımlar oluşturmak için kullanıyoruz.'
    },
    { 
      name: 'TypeScript', 
      icon: '/sliderbot/typescript.svg',
      description: 'JavaScript\'e tip güvenliği kazandıran dil. Kodlarımızı daha güvenli, okunabilir ve hatasız yazıyoruz.'
    },
    { 
      name: 'Vercel', 
      icon: '/sliderbot/vercel_dark.svg',
      description: 'Next.js\'in geliştiricisi tarafından sunulan hosting platformu. Otomatik deployment ve global CDN ile hızlı web siteleri yayınlıyoruz.'
    },
  ];

  return (
    <section className="tech-slider-section">
      <div className="tech-slider-container">
        <div className="tech-slider-track">
          {/* İlk set */}
          {technologies.map((tech, index) => (
            <div key={`tech-1-${index}`} className="tech-slider-item">
              <Image
                src={tech.icon}
                alt={tech.name}
                width={50}
                height={50}
                className="tech-icon"
              />
              <span className="tech-name">{tech.name}</span>
              <div className="tech-tooltip">
                <h4 className="tech-tooltip-title">{tech.name}</h4>
                <p className="tech-tooltip-description">{tech.description}</p>
              </div>
            </div>
          ))}
          {/* Tekrar eden set (seamless loop için) */}
          {technologies.map((tech, index) => (
            <div key={`tech-2-${index}`} className="tech-slider-item">
              <Image
                src={tech.icon}
                alt={tech.name}
                width={50}
                height={50}
                className="tech-icon"
              />
              <span className="tech-name">{tech.name}</span>
              <div className="tech-tooltip">
                <h4 className="tech-tooltip-title">{tech.name}</h4>
                <p className="tech-tooltip-description">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
