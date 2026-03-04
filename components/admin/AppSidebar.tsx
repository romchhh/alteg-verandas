"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/lib/SidebarContext";
import { LayoutDashboard, ShoppingCart, Package } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  countKey: "products" | "orders" | null;
};

const navItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/admin", countKey: null },
  { icon: <Package className="w-5 h-5" />, name: "Products", path: "/admin/products", countKey: "products" },
  { icon: <ShoppingCart className="w-5 h-5" />, name: "Orders", path: "/admin/orders", countKey: "orders" },
];

export default function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [counts, setCounts] = useState<{ products: number; orders: number }>({
    products: 0,
    orders: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/admin/orders").then((r) => (r.ok ? r.json() : [])),
    ]).then(([products, orders]) => {
      setCounts({
        products: Array.isArray(products) ? products.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
      });
    });
  }, []);

  const isActive = (path: string) => path === pathname;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${
          isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          <Image
            src="/alteg-logo.png"
            alt="ALTEG Logo"
            width={isExpanded || isHovered || isMobileOpen ? 120 : 32}
            height={isExpanded || isHovered || isMobileOpen ? 40 : 32}
            className="object-contain"
          />
        </Link>
      </div>
      <nav className="flex flex-col gap-1 overflow-y-auto">
        {navItems.map((nav) => (
          <Link
            key={nav.path}
            href={nav.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive(nav.path)
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700 hover:bg-gray-100"
            } ${!isExpanded && !isHovered ? "lg:justify-center" : ""}`}
          >
            <span className="shrink-0">{nav.icon}</span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="text-sm font-medium flex items-center gap-1.5">
                {nav.name}
                {nav.countKey != null && (
                  <span className="text-xs text-gray-500 font-normal">({counts[nav.countKey]})</span>
                )}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
