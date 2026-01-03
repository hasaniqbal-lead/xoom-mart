'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ItemCard from '@/components/ItemCard';
import { getHomeData } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading home data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 md:p-12 mb-12 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Welcome to Xoom Mart
        </h1>
        <p className="text-lg md:text-xl mb-6 opacity-90">
          Order from nearby shops and get delivery fast with Cash on Delivery
        </p>
        <Link
          href="/categories/grocery"
          className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Start Shopping
        </Link>
      </div>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data?.categories?.map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-2">📦</div>
              <h3 className="font-semibold text-sm">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals */}
      {data?.deals?.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Deals & Offers</h2>
            <Link href="/deals" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.deals.slice(0, 5).map((item: any) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Items */}
      {data?.popular?.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Items</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.popular.slice(0, 5).map((item: any) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Shops */}
      {data?.shops?.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Nearby Shops</h2>
            <Link href="/shops" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.shops.slice(0, 4).map((shop: any) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.slug}`}
                className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{shop.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{shop.category}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Delivery: PKR {shop.deliveryFee}
                  </span>
                  <span
                    className={shop.isOpen ? 'text-green-600' : 'text-red-600'}
                  >
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
