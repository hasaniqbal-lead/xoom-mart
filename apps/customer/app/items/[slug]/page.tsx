'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getItemBySlug } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { Loader2, Minus, Plus, ShoppingCart } from 'lucide-react';

export default function ItemDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    getItemBySlug(params.slug as string)
      .then((res) => {
        setItem(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading item:', error);
        setLoading(false);
      });
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!item) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      discountPrice: item.discountPrice,
      quantity,
      image: item.images[0] || '/placeholder.png',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Item not found</h2>
      </div>
    );
  }

  const displayPrice = item.discountPrice || item.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-white border">
          <Image
            src={item.images[0] || 'https://via.placeholder.com/600x600?text=No+Image'}
            alt={item.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{item.name}</h1>

          {item.description && (
            <p className="text-gray-600 mb-6">{item.description}</p>
          )}

          <div className="mb-6">
            {item.discountPrice ? (
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(displayPrice)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(item.price)}
                  </span>
                  {item.discountPercent && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {item.discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-3xl font-bold text-gray-900">
                {formatPrice(item.price)}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                item.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {item.isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity */}
          {item.isAvailable && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border rounded-lg hover:bg-gray-100"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border rounded-lg hover:bg-gray-100"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  added
                    ? 'bg-green-100 text-primary border-2 border-primary'
                    : 'bg-primary text-white hover:bg-green-700'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
