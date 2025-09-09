'use client';

import { memo } from 'react';
import { StructuredData } from './StructuredData';

interface SEOHeadProps {
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  canonicalUrl?: string;
  hreflang?: Record<string, string>;
  additionalMeta?: Array<{ name?: string; property?: string; content: string }>;
}

function SEOHeadComponent({
  structuredData,
  canonicalUrl,
  hreflang,
  additionalMeta = []
}: SEOHeadProps) {
  return (
    <>
      {/* Canonical URL */}
      {canonicalUrl && (
        <link rel="canonical" href={canonicalUrl} />
      )}

      {/* Hreflang для мультиязычности */}
      {hreflang && Object.entries(hreflang).map(([lang, url]) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={url}
        />
      ))}

      {/* Дополнительные мета-теги */}
      {additionalMeta.map((meta, index) => (
        <meta
          key={index}
          {...(meta.name ? { name: meta.name } : { property: meta.property })}
          content={meta.content}
        />
      ))}

      {/* Структурированные данные */}
      {structuredData && (
        <StructuredData data={structuredData} />
      )}
    </>
  );
}

export const SEOHead = memo(SEOHeadComponent);
SEOHead.displayName = 'SEOHead';
