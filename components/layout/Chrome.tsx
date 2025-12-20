'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Chrome() {
  const pathname = usePathname();
  const hideFooter = pathname === '/login';

  return (
    <>
      <Navbar />
      {!hideFooter && <Footer />}
    </>
  );
}
