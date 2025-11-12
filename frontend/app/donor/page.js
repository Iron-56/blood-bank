'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DonorIndex() {
  useEffect(() => {
    redirect('/donor/search');
  }, []);

  return null;
}
