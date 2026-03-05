'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/shared/Button';
import { siteConfig } from '@/config/site';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/utils/bodyScrollLock';
import { ProductSearchModal } from '@/components/catalog/ProductSearchModal';

const MenuIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Cart icon and cart entry points removed per request

const PhoneIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
  </svg>
);

export const Header: React.FC = () => {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
    return () => unlockBodyScroll();
  }, [mobileMenuOpen, searchOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - fits in header height on all breakpoints so nothing overlaps hero (no semicircle) */}
          <Link href="/" className="flex items-center ml-2 sm:-ml-5 md:-ml-6">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
              <Image
                src="/alteg-logo.png"
                alt="ALTEG Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation - links to catalog pages */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
            <Link href="/catalog/verandas" className="text-[#050544] hover:text-[#445DFE] font-bold transition-colors text-sm uppercase tracking-wide">
              Verandas
            </Link>
            <Link href="/catalog/fencing" className="text-[#050544] hover:text-[#445DFE] font-bold transition-colors text-sm uppercase tracking-wide">
              Fencing
            </Link>
            <Link href="/catalog/profiles" className="text-[#050544] hover:text-[#445DFE] font-bold transition-colors text-sm uppercase tracking-wide">
              Profile Systems
            </Link>
            <Link href="/catalog/accessories" className="text-[#050544] hover:text-[#445DFE] font-bold transition-colors text-sm uppercase tracking-wide">
              Accessories
            </Link>
            <Link href="/categories" className="text-[#050544] hover:text-[#445DFE] font-bold transition-colors text-sm uppercase tracking-wide">
              Categories
            </Link>
            <Link href="/contact" className="text-[#050544] hover:text-[#445DFE] font-bold transition-colors text-sm uppercase tracking-wide">
              Get a Quote
            </Link>
          </nav>

          {/* Right side - CTA & Burger Menu */}
          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden lg:block text-[#050544] hover:text-[#445DFE] transition-colors p-1.5"
              aria-label="Search products"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            {/* Desktop Phone */}
            <a href={`tel:${siteConfig.links.phone}`} className="hidden lg:block text-[#050544] hover:text-[#445DFE] transition-colors p-1.5">
              <PhoneIcon className="w-6 h-6" />
            </a>

            {/* Desktop CTA Button */}
            <Link href="/contact" className="hidden lg:block">
              <button className="px-4 py-2 bg-black hover:bg-[#050544] text-white font-bold transition-all duration-300 text-xs rounded-none uppercase tracking-wide">
                GET A FREE QUOTE
              </button>
            </Link>

            {/* Mobile Phone, Search, Cart & Burger Menu */}
            <div className="flex items-center gap-3 lg:hidden">
              <a href={`tel:${siteConfig.links.phone}`} className="text-[#050544] hover:text-[#445DFE] transition-colors p-2">
                <PhoneIcon className="w-7 h-7" />
              </a>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="text-[#050544] hover:text-[#445DFE] transition-colors p-2"
                aria-label="Search products"
              >
                <SearchIcon className="w-6 h-6" />
              </button>

              {/* Burger Menu Button - Changes to X when menu is open */}
              <button 
                className={`p-2 transition-colors relative z-50 ${mobileMenuOpen ? 'text-[#050544] bg-white rounded hover:bg-gray-100' : 'text-[#050544] hover:text-[#445DFE]'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Burger Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 md:top-20 bg-white z-50 overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] px-4 py-12 relative">
              {/* Menu Items */}
              <nav className="flex flex-col items-center gap-3 w-full max-w-md">
                <Link
                  href="/catalog/verandas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-[#050544] hover:text-[#445DFE] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Verandas &amp; Canopies
                </Link>
                <Link
                  href="/catalog/fencing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-[#050544] hover:text-[#445DFE] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Aluminium Fencing
                </Link>
                <Link
                  href="/catalog/profiles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-[#050544] hover:text-[#445DFE] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Profile Systems
                </Link>
                <Link
                  href="/catalog/accessories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-[#050544] hover:text-[#445DFE] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Accessories &amp; Guttering
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-[#050544] hover:text-[#445DFE] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Categories
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-[#050544] hover:text-[#445DFE] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Get a Quote
                </Link>
                <a 
                  href={`tel:${siteConfig.links.phone}`} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-[#050544] hover:text-[#445DFE] font-semibold transition-colors text-sm md:text-base py-2 flex items-center justify-center gap-2"
                >
                  <PhoneIcon className="w-6 h-6 md:w-7 md:h-7" />
                  <span>{siteConfig.links.phoneDisplay || siteConfig.links.phone}</span>
                </a>
              </nav>

              {/* CTA Button */}
              <div className="w-full max-w-xs mt-12 space-y-4 pt-8 border-t border-gray-200">
                <Button 
                  href="/contact" 
                  variant="primary" 
                  fullWidth 
                  className="bg-black text-white hover:bg-[#050544] border-none rounded-none py-4 text-base font-bold uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  GET A FREE QUOTE
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProductSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};
