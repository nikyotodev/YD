'use client';

import { memo } from 'react';

interface StructuredDataProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
}

function StructuredDataComponent({ data, id }: StructuredDataProps) {
  try {
    const jsonLd = JSON.stringify(data, null, 0);

    return (
      <script
        id={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // biome-ignore lint/suspicious/noConsoleLog: Development logging для отладки
      console.error('Ошибка при создании структурированных данных:', error);
    }
    return null;
  }
}

export const StructuredData = memo(StructuredDataComponent);
StructuredData.displayName = 'StructuredData';
