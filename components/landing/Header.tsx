'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/shared/Button';
import { siteConfig } from '@/config/site';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/utils/bodyScrollLock';

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

const CartIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export const Header: React.FC = () => {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
    return () => unlockBodyScroll();
  }, [mobileMenuOpen]);

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
            {/* Desktop Phone */}
            <a href={`tel:${siteConfig.links.phone}`} className="hidden lg:block text-[#050544] hover:text-[#445DFE] transition-colors p-1.5">
              <PhoneIcon className="w-6 h-6" />
            </a>

            {/* Desktop Cart */}
            <Link href="/checkout" className="hidden lg:block relative text-[#050544] hover:text-[#445DFE] transition-colors p-1.5">
              <CartIcon className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#445DFE] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Desktop CTA Button */}
            <Link href="/contact" className="hidden lg:block">
              <button className="px-4 py-2 bg-black hover:bg-[#050544] text-white font-bold transition-all duration-300 text-xs rounded-none uppercase tracking-wide">
                GET A FREE QUOTE
              </button>
            </Link>

            {/* Mobile Phone, Cart & Burger Menu */}
            <div className="flex items-center gap-3 lg:hidden">
              <a href={`tel:${siteConfig.links.phone}`} className="text-[#050544] hover:text-[#445DFE] transition-colors p-2">
                <PhoneIcon className="w-7 h-7" />
              </a>

              <Link href="/checkout" className="relative text-[#050544] hover:text-[#445DFE] transition-colors p-2">
                <CartIcon className="w-7 h-7" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#445DFE] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

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

        {/* Mobile Burger Menu - Full Screen Dark */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 md:top-20 bg-[#050544] z-50 overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] px-4 py-12 relative">
              {/* Menu Items */}
              <nav className="flex flex-col items-center gap-3 w-full max-w-md">
                <Link
                  href="/catalog/verandas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-white hover:text-[#B7D2FF] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Verandas &amp; Canopies
                </Link>
                <Link
                  href="/catalog/fencing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-white hover:text-[#B7D2FF] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Aluminium Fencing
                </Link>
                <Link
                  href="/catalog/profiles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-white hover:text-[#B7D2FF] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Profile Systems
                </Link>
                <Link
                  href="/catalog/accessories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-white hover:text-[#B7D2FF] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Accessories &amp; Guttering
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-white hover:text-[#B7D2FF] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Categories
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-white hover:text-[#B7D2FF] font-semibold transition-colors text-base md:text-lg uppercase tracking-wide py-2"
                >
                  Get a Quote
                </Link>
                <a 
                  href={`tel:${siteConfig.links.phone}`} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-white hover:text-[#B7D2FF] font-semibold transition-colors text-sm md:text-base py-2 flex items-center justify-center gap-2"
                >
                  <PhoneIcon className="w-6 h-6 md:w-7 md:h-7" />
                  <span>{siteConfig.links.phoneDisplay || siteConfig.links.phone}</span>
                </a>
              </nav>

              {/* CTA Buttons */}
              <div className="w-full max-w-xs mt-12 space-y-4 pt-8 border-t border-white/20">
                <Button 
                  href="/contact" 
                  variant="primary" 
                  fullWidth 
                  className="bg-white !text-black hover:bg-gray-100 border-none rounded-none py-4 text-base font-bold uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  GET A FREE QUOTE
                </Button>
                <Button 
                  href="/checkout" 
                  variant="outline" 
                  fullWidth 
                  className="border-2 border-white text-white hover:bg-white hover:text-[#050544] rounded-none py-4 text-base font-bold uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart ({itemCount})
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
