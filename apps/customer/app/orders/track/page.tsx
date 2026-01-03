'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackOrder, submitFeedback } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Loader2, Package, Truck, CheckCircle, Star } from 'lucide-react';

const statusSteps = [
  { key: 'PLACED', label: 'Order Placed', icon: Package },
  { key: 'ASSIGNED', label: 'Rider Assigned', icon: Truck },
  { key: 'PICKED_UP', label: 'Picked Up', icon: Truck },
  { key: 'ON_THE_WAY', label: 'On The Way', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const phone = searchParams.get('phone');
    const orderNumber = searchParams.get('orderNumber');

    if (phone && orderNumber) {
      trackOrder(phone, orderNumber)
        .then((res) => {
          setOrder(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Order not found');
          setLoading(false);
        });
    } else {
      setError('Missing tracking information');
      setLoading(false);
    }
  }, [searchParams]);

  const handleSubmitFeedback = async () => {
    if (!order || rating === 0) return;

    try {
      await submitFeedback(order.id, { rating, comment });
      setFeedbackSubmitted(true);
    } catch (err) {
      alert('Failed to submit feedback');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Track Order</h1>

      {/* Order Info */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-bold">{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-primary">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Customer</p>
            <p className="font-semibold">{order.customerName || 'Guest'}</p>
            <p>{order.customerPhone}</p>
          </div>
          <div>
            <p className="text-gray-600">Delivery Address</p>
            <p className="font-semibold">{order.deliveryAddress}</p>
          </div>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Order Status</h2>

        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      isCurrent ? 'text-primary' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-gray-600">Current Status</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between">
              <div>
                <p className="font-semibold">{item.itemName}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(item.totalPrice)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      {order.status === 'DELIVERED' && !feedbackSubmitted && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Rate Your Experience</h2>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleSubmitFeedback}
            disabled={rating === 0}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            Submit Feedback
          </button>
        </div>
      )}

      {feedbackSubmitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-semibold">
            Thank you for your feedback!
          </p>
        </div>
      )}
    </div>
  );
}
