"use client";

import Link from "next/link";
import { useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";

import { CABINET_ENABLED } from "@/lib/features";
import { publicPath } from "@/lib/publicPath";

const NAV_LINKS = [
  { href: "/#top", label: "Главная" },
  { href: "/#support", label: "VeraNeuro" },
  { href: "/#contacts", label: "Контакты" },
  // { href: '/prices', label: 'Цены' },
  { href: "/docs/", label: "Документы" },
  { href: "/reviews/", label: "Отзывы" },
];

function getAccountLink(role?: "admin" | "parent") {
  if (!CABINET_ENABLED) {
    return null;
  }

  if (role === "admin") {
    return { href: "/admin", label: "Админка" };
  }

  if (role === "parent") {
    return { href: "/cabinet", label: "Личный кабинет" };
  }

  return { href: "/login", label: "Вход" };
}

function NavbarContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const accountLink = getAccountLink(session?.user?.role);
  const navLinks = accountLink ? [...NAV_LINKS, accountLink] : NAV_LINKS;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="navwrap">
      <nav className="navwrap__bar">
        <div className="container navwrap__inner">
          <Link className="navwrap__brand" href="/#top">
            <picture className="navwrap__logoWrap">
              <source
                media="(max-width: 767.98px)"
                srcSet={encodeURI(
                  publicPath(
                    "/about/ChatGPT Image 9 мая 2026 г., 09_05_08.png",
                  ),
                )}
              />
              <img
                className="navwrap__logo"
                src={publicPath("/about/logo-desktop-cropped.png")}
                alt=""
              />
            </picture>
            <div className="navwrap__brandText">
              <div className="navwrap__name">Мелкова Вера Александровна</div>
              <div className="navwrap__role">Специалист по нейрокоррекции</div>
            </div>
          </Link>

          <div className="navwrap__links">
            {navLinks.map((link) => (
              <Link className="navwrap__link" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navwrap__actions">
            <a
              className="btn btn-primary navwrap__cta"
              href="/#contacts"
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

          <div
            className={`collapse navwrap__mobileMenu${isMenuOpen ? " show" : ""}`}
            id="mainNavMenu"
          >
            {navLinks.map((link) => (
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
              href="/#contacts"
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

export function Navbar() {
  return (
    <SessionProvider>
      <NavbarContent />
    </SessionProvider>
  );
}
