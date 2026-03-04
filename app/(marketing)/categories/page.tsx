import React from 'react';
import Link from 'next/link';

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-white pt-16 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#050544] to-[#445DFE] text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight tracking-tight">
              Product Categories
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Explore our main product areas: verandas &amp; canopies, aluminium fencing, profile systems
              and accessories.
            </p>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Verandas & Canopies */}
            <article className="border-2 border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#445DFE]/40 transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-[#050544] mb-2">
                Verandas &amp; Canopies
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                Made‑to‑measure aluminium verandas and canopies for British homes. Available with
                polycarbonate or laminated safety glass (VSG) roofing, powder‑coated structure and
                integrated guttering.
              </p>
              <ul className="text-sm text-gray-700 mb-5 list-disc list-inside space-y-1">
                <li>Typical sizes from approx. 4×3 m up to 7×4.5 m</li>
                <li>Standard depths and widths, bespoke options on request</li>
                <li>From price shown on the UK site, excl. VAT</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/catalog/verandas"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold border border-[#050544] text-[#050544] hover:bg-[#050544] hover:text-white rounded-none transition-colors"
                >
                  View verandas catalog
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none transition-colors"
                >
                  Get veranda quote
                </Link>
              </div>
            </article>

            {/* Aluminium Fencing */}
            <article className="border-2 border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#445DFE]/40 transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-[#050544] mb-2">
                Aluminium Fencing
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                Modern aluminium privacy fencing as a long‑life alternative to timber panels and concrete
                posts. Boards, posts and capping are powder‑coated and low‑maintenance.
              </p>
              <ul className="text-sm text-gray-700 mb-5 list-disc list-inside space-y-1">
                <li>Guide pricing from around £100 per metre (from price, excl. VAT)</li>
                <li>Typical fence height around 1 m, higher options available</li>
                <li>Standard RAL 7016 anthracite grey, other colours to order</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/catalog/fencing"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold border border-[#050544] text-[#050544] hover:bg-[#050544] hover:text-white rounded-none transition-colors"
                >
                  View fencing catalog
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none transition-colors"
                >
                  Get fencing quote
                </Link>
              </div>
            </article>

            {/* Profile Systems */}
            <article className="border-2 border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#445DFE]/40 transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-[#050544] mb-2">
                Profile Systems
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                Aluminium profile systems for verandas, canopies and fencing: support posts, rafters and
                beams, fence posts and infill profiles for trade and project customers.
              </p>
              <ul className="text-sm text-gray-700 mb-5 list-disc list-inside space-y-1">
                <li>Support posts (e.g. around 110×110 mm with base plates)</li>
                <li>Load‑bearing roof beams and rafters for glass and polycarbonate roofs</li>
                <li>Fence posts, boards, capping and rails for aluminium fencing</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/catalog/profiles"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold border border-[#050544] text-[#050544] hover:bg-[#050544] hover:text-white rounded-none transition-colors"
                >
                  View profiles catalog
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none transition-colors"
                >
                  Enquire about profiles
                </Link>
              </div>
            </article>

            {/* Accessories & Guttering */}
            <article className="border-2 border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#445DFE]/40 transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-[#050544] mb-2">
                Accessories &amp; Guttering
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                Finishing components for watertight, long‑life installations: seals, gaskets, guttering,
                fixings and trims matched to our veranda and fencing systems.
              </p>
              <ul className="text-sm text-gray-700 mb-5 list-disc list-inside space-y-1">
                <li>EPDM rubber seals and gaskets for glass and polycarbonate</li>
                <li>Wall connection profiles and cover cap seals</li>
                <li>Aluminium gutters, downpipes, end caps and fixings</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/catalog/accessories"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold border border-[#050544] text-[#050544] hover:bg-[#050544] hover:text-white rounded-none transition-colors"
                >
                  View accessories catalog
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none transition-colors"
                >
                  Ask about accessories
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

