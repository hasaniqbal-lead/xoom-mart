'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryBySlug(params.slug as string)
      .then((res) => {
        setCategory(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading category:', error);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {category.subcategories?.map((subcategory: any) => (
          <Link
            key={subcategory.id}
            href={`/subcategories/${subcategory.slug}`}
            className="bg-white border rounded-lg p-6 hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-3">📦</div>
            <h3 className="font-semibold">{subcategory.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
