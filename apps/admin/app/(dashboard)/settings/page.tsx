'use client';

import { useEffect, useState } from 'react';
import { getPlatformConfig, updatePlatformConfig } from '@/lib/api';
import { Save, Loader2 } from 'lucide-react';

interface PlatformConfig {
  deliveryFee: number;
  freeDeliveryThreshold: number;
  platformFeePercentage: number;
  taxPercentage: number;
  minOrderAmount: number;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<PlatformConfig>({
    deliveryFee: 0,
    freeDeliveryThreshold: 0,
    platformFeePercentage: 0,
    taxPercentage: 0,
    minOrderAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await getPlatformConfig();
      setConfig(res.data);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = Number(value);
    });

    try {
      await updatePlatformConfig(data);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-1">Configure platform-wide settings and fees</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Fee (PKR)
            </label>
            <input
              type="number"
              name="deliveryFee"
              required
              min="0"
              step="0.01"
              defaultValue={config.deliveryFee}
              className="input"
              placeholder="e.g., 50"
            />
            <p className="text-sm text-gray-500 mt-1">
              Standard delivery fee charged per order
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Free Delivery Threshold (PKR)
            </label>
            <input
              type="number"
              name="freeDeliveryThreshold"
              required
              min="0"
              step="0.01"
              defaultValue={config.freeDeliveryThreshold}
              className="input"
              placeholder="e.g., 500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Orders above this amount qualify for free delivery
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Fee (%)
            </label>
            <input
              type="number"
              name="platformFeePercentage"
              required
              min="0"
              max="100"
              step="0.01"
              defaultValue={config.platformFeePercentage}
              className="input"
              placeholder="e.g., 10"
            />
            <p className="text-sm text-gray-500 mt-1">
              Commission charged to partner shops on each order
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax / GST (%)
            </label>
            <input
              type="number"
              name="taxPercentage"
              required
              min="0"
              max="100"
              step="0.01"
              defaultValue={config.taxPercentage}
              className="input"
              placeholder="e.g., 5"
            />
            <p className="text-sm text-gray-500 mt-1">
              Tax percentage applied to orders (if applicable)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Order Amount (PKR)
            </label>
            <input
              type="number"
              name="minOrderAmount"
              required
              min="0"
              step="0.01"
              defaultValue={config.minOrderAmount}
              className="input"
              placeholder="e.g., 100"
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum order value required to place an order
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Order Calculation</h3>
          <p className="text-sm text-blue-700">
            Order Total = Subtotal + Delivery Fee - (Free if above threshold)
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-2">Partner Commission</h3>
          <p className="text-sm text-purple-700">
            Platform Fee = Order Subtotal × Platform Fee Percentage
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-2">Tax Calculation</h3>
          <p className="text-sm text-green-700">
            Tax Amount = (Subtotal + Fees) × Tax Percentage
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-semibold text-orange-900 mb-2">Order Validation</h3>
          <p className="text-sm text-orange-700">
            Orders below minimum amount will be rejected
          </p>
        </div>
      </div>
    </div>
  );
}
