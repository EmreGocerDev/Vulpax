'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';

export default function NeonContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [searchValue, setSearchValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { icon: 'calendar', label: 'Ürünler', href: '/products' },
    { icon: 'calculator', label: 'Kategoriler', href: '/categories' },
    { icon: 'messages', label: 'İletişim', href: '/contact' },
  ];

  const settings = [
    { icon: 'profile', label: 'Hesabım', href: '/account' },
    { icon: 'billing', label: 'Sepetim', href: '/cart' },
  ];

  const allItems = [...suggestions, ...settings];

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
    
    const menuWidth = 275;
    const menuHeight = 275;
    const padding = { x: 30, y: 20 };
    
    let x = event.clientX;
    let y = event.clientY;
    
    if (x + menuWidth >= window.innerWidth - padding.x) {
      x = window.innerWidth - menuWidth - padding.x;
    }
    
    if (y + menuHeight >= window.innerHeight - padding.y) {
      y = window.innerHeight - menuHeight - padding.y;
    }

    const target = event.target as HTMLElement;
    const isInsideMenu = menuRef.current?.contains(target);

    if (!isInsideMenu) {
      setPosition({ x, y });
      setIsOpen(true);
      setSelectedIndex(0);
    }
  }, []);

  const handleClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isInsideMenu = menuRef.current?.contains(target);
    const isSlider = target.matches('input[type="range"]');

    if (!isInsideMenu && !isSlider) {
      setIsOpen(false);
      setTimeout(() => {
        setSearchValue('');
        setSelectedIndex(0);
      }, 200);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('pointerdown', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('pointerdown', handleClick);
    };
  }, [handleContextMenu, handleClick]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        );
      case 'calculator':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
          </svg>
        );
      case 'messages':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        );
      case 'profile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        );
      case 'billing':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside
      ref={menuRef}
      id="neon-menu"
      className={`neon-context-menu ${isOpen ? 'open' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <span className="shine shine-top"></span>
      <span className="shine shine-bottom"></span>
      <span className="glow glow-top"></span>
      <span className="glow glow-bottom"></span>
      <span className="glow glow-bright glow-top"></span>
      <span className="glow glow-bright glow-bottom"></span>

      <div className="inner">
        <label className="search">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Arama yap veya komut gir..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </label>

        <section>
          <header>Sayfalar</header>
          <ul>
            {suggestions.map((item, index) => (
              <li
                key={item.label}
                className={selectedIndex === index ? 'selected' : ''}
                tabIndex={0}
                onClick={() => {
                  setIsOpen(false);
                  setSelectedIndex(index);
                }}
              >
                <Link href={item.href} className="flex items-center gap-2 w-full">
                  {getIcon(item.icon)}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <hr />

        <section className="settings-section">
          <header>Ayarlar</header>
          <ul>
            {settings.map((item, index) => (
              <li
                key={item.label}
                className={selectedIndex === suggestions.length + index ? 'selected' : ''}
                tabIndex={0}
                onClick={() => {
                  setIsOpen(false);
                  setSelectedIndex(suggestions.length + index);
                }}
              >
                <Link href={item.href} className="flex items-center gap-2 w-full">
                  {getIcon(item.icon)}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
