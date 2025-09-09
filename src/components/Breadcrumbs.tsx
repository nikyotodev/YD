'use client';

import { memo } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { StructuredData } from './StructuredData';
import { generateBreadcrumbStructuredData } from '@/lib/seo-utils';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

function BreadcrumbsComponent({ items, className = '' }: BreadcrumbsProps) {
  const allItems = [
    { name: 'Главная', url: '/' },
    ...items
  ];

  const structuredData = generateBreadcrumbStructuredData(allItems);

  return (
    <>
      <StructuredData data={structuredData} id="breadcrumbs-structured-data" />
      <nav
        aria-label="Навигационные крошки"
        className={`text-sm text-muted-foreground ${className}`}
      >
        <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
          {allItems.map((item, index) => (
            <li key={item.url} className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {index > 0 && <ChevronRight className="h-3 w-3 mx-2" />}
              {index === 0 ? (
                <Link
                  href={item.url}
                  className="flex items-center hover:text-foreground transition-colors"
                  itemProp="item"
                >
                  <Home className="h-3 w-3 mr-1" />
                  <span itemProp="name">{item.name}</span>
                </Link>
              ) : index === allItems.length - 1 ? (
                <span
                  className="text-foreground font-medium"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-foreground transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export const Breadcrumbs = memo(BreadcrumbsComponent);
Breadcrumbs.displayName = 'Breadcrumbs';
