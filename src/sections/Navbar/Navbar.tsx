'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/#services', label: 'Форматы' },
  { href: '/#process', label: 'Как проходит' },
  { href: '/#contacts', label: 'Контакты' },
  { href: '/docs', label: 'Документы' },
  { href: '/reviews', label: 'Отзывы' },
  { href: '/login', label: 'Вход' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="navwrap">
      <nav className="navwrap__bar">
        <div className="container navwrap__inner">
          <Link className="navwrap__brand" href="/#top">
            <div className="navwrap__name">Мелкова Вера Александровна</div>
            <div className="navwrap__role">Специалист по нейрокоррекции</div>
          </Link>

          <div className="navwrap__links">
            {NAV_LINKS.map((link) => (
              <Link className="navwrap__link" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navwrap__actions">
            <a
              className="btn btn-primary navwrap__cta"
              href="https://t.me/Vera37467"
              target="_blank"
              rel="noopener noreferrer"
            >
              Записаться
            </a>
          </div>

          <button
            className="navwrap__burger"
            type="button"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            aria-controls="mainNavMenu"
            aria-expanded={isMenuOpen}
            aria-label="Открыть меню"
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`collapse navwrap__mobileMenu${isMenuOpen ? ' show' : ''}`} id="mainNavMenu">
            {NAV_LINKS.map((link) => (
              <Link
                className="navwrap__mobileLink"
                href={link.href}
                key={`${link.href}-mobile`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <a
              className="btn btn-primary navwrap__mobileCta"
              href="https://t.me/Vera37467"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              Записаться
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
