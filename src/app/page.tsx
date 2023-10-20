'use client';
import { PrismaneProvider } from '@prismane/core';
import Launches from './view/Launches';

export default function Page() {
  return (
    <PrismaneProvider>
      <Launches />
    </PrismaneProvider>
  );
}
