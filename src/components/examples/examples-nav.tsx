'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const exampleLinks = [
  { href: '/examples/analytics', label: 'Analytics' },
  { href: '/examples/images', label: 'Images' },
];

export function ExamplesNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mb-8">
      <Link
        href="/examples"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === '/examples' ? "text-primary" : "text-muted-foreground"
        )}
      >
        Overview
      </Link>
      {exampleLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
