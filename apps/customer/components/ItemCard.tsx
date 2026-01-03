'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    discountPercent?: number;
    images: string[];
    tags?: string[];
  };
}

export default function ItemCard({ item }: ItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const displayPrice = item.discountPrice || item.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      discountPrice: item.discountPrice,
      quantity: 1,
      image: item.images[0] || '/placeholder.png',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/items/${item.slug}`}>
      <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
        <div className="relative aspect-square">
          <Image
            src={item.images[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={item.name}
            fill
            className="object-cover"
          />
          {item.discountPercent && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              {item.discountPercent}% OFF
            </div>
          )}
          {item.tags?.includes('NEW') && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
              NEW
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 flex-1">
            {item.name}
          </h3>

          <div className="flex items-center justify-between mt-auto">
            <div>
              {item.discountPrice ? (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(displayPrice)}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(item.price)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-full transition-all ${
                added
                  ? 'bg-green-100 text-primary'
                  : 'bg-primary text-white hover:bg-green-700'
              }`}
            >
              {added ? (
                <ShoppingCart className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
