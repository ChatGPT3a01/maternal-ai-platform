'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Baby,
  MessageCircle,
  ClipboardList,
  BookOpen,
  FileText,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/', label: '首頁', icon: Baby },
  { href: '/labor-care/', label: '待產注意事項', icon: ClipboardList },
  { href: '/labor-knowledge/', label: '待產知識', icon: BookOpen },
  { href: '/quiz/', label: '測驗', icon: FileText },
  { href: '/chat/', label: 'AI 問答', icon: MessageCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-pink-100/80 bg-background/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 rounded-full pr-3 transition-opacity hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 ring-4 ring-pink-50">
            <Baby className="h-5 w-5 text-pink-500" />
          </span>
          <span className="font-bold text-xl hidden sm:inline">產婦知識平台</span>
          <span className="font-bold text-xl sm:hidden">產婦知識</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 rounded-full bg-muted/60 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-2',
                    isActive && 'bg-pink-500 text-white shadow-sm hover:bg-pink-600'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container space-y-2 border-t border-pink-100/80 bg-background/95 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-2',
                      isActive && 'bg-pink-500 hover:bg-pink-600'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
