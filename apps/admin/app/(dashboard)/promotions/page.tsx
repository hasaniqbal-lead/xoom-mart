'use client';

import { useEffect, useState } from 'react';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getItems,
} from '@/lib/api';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: string;
  value: number;
  itemId?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'promotions'>('banners');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'banners') {
        const res = await getBanners();
        setBanners(res.data);
      } else {
        const [promoRes, itemsRes] = await Promise.all([getPromotions(), getItems()]);
        setPromotions(promoRes.data);
        setItems(itemsRes.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      if (activeTab === 'banners') {
        await deleteBanner(id);
      } else {
        await deletePromotion(id);
      }
      loadData();
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const openModal = (item?: any) => {
    setEditingItem(item || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      if (key === 'isActive') {
        data[key] = value === 'true';
      } else if (key === 'sortOrder' || key === 'value') {
        data[key] = Number(value);
      } else if (key === 'itemId' && !value) {
        // Skip empty itemId
      } else {
        data[key] = value;
      }
    });

    try {
      if (activeTab === 'banners') {
        if (editingItem) {
          await updateBanner(editingItem.id, data);
        } else {
          await createBanner(data);
        }
      } else {
        if (editingItem) {
          await updatePromotion(editingItem.id, data);
        } else {
          await createPromotion(data);
        }
      }
      closeModal();
      loadData();
    } catch (error) {
      alert('Failed to save item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions Management</h1>
          <p className="text-gray-600 mt-1">Manage banners and promotions</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'banners' ? 'Banner' : 'Promotion'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['banners', 'promotions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500">No banners found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{banner.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{banner.link}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          banner.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <button
                        onClick={() => openModal(banner)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No promotions found
                  </td>
                </tr>
              ) : (
                promotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{promo.title}</p>
                        <p className="text-sm text-gray-600">{promo.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{promo.type}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {promo.type === 'PERCENTAGE' ? `${promo.value}%` : formatPrice(promo.value)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>
                        <p>{formatDate(promo.startDate)}</p>
                        <p>{formatDate(promo.endDate)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          promo.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(promo)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'banners' ? 'Banner' : 'Promotion'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingItem?.title}
                  className="input"
                />
              </div>

              {activeTab === 'banners' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      required
                      defaultValue={editingItem?.image}
                      className="input"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                    <input
                      type="text"
                      name="link"
                      defaultValue={editingItem?.link}
                      className="input"
                      placeholder="/category/deals"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      name="sortOrder"
                      defaultValue={editingItem?.sortOrder || 0}
                      className="input"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue={editingItem?.description}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      name="type"
                      required
                      defaultValue={editingItem?.type || 'PERCENTAGE'}
                      className="input"
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED_AMOUNT">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                    <input
                      type="number"
                      name="value"
                      required
                      defaultValue={editingItem?.value}
                      className="input"
                      placeholder="e.g., 20 for 20%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item (Optional)
                    </label>
                    <select name="itemId" defaultValue={editingItem?.itemId || ''} className="input">
                      <option value="">All Items</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      defaultValue={editingItem?.startDate?.split('T')[0]}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      defaultValue={editingItem?.endDate?.split('T')[0]}
                      className="input"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="isActive"
                  defaultValue={editingItem?.isActive?.toString() || 'true'}
                  className="input"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
