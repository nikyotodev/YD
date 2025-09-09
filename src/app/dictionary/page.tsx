import type { Metadata } from 'next';
import { dictionaryMetadata } from './metadata';
import DictionaryPageClient from '@/components/DictionaryPageClient';

export const metadata: Metadata = dictionaryMetadata;

export default function DictionaryPage() {
  return <DictionaryPageClient />;
}
