'use client';

import { useEffect, useState } from 'react';
import {
  getShops,
  createShop,
  updateShop,
  deleteShop,
  getShopItems,
  addShopItem,
  updateShopItem,
  deleteShopItem,
} from '@/lib/api';
import { Plus, Edit2, Trash2, Search, X, Store } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    setLoading(true);
    try {
      const res = await getShops();
      setShops(res.data);
    } catch (error) {
      console.error('Failed to load shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shop?')) return;

    try {
      await deleteShop(id);
      loadShops();
    } catch (error) {
      alert('Failed to delete shop');
    }
  };

  const openModal = (shop?: Shop) => {
    setEditingShop(shop || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingShop(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      if (key === 'isActive') {
        data[key] = value === 'true';
      } else {
        data[key] = value;
      }
    });

    try {
      if (editingShop) {
        await updateShop(editingShop.id, data);
      } else {
        await createShop(data);
      }
      closeModal();
      loadShops();
    } catch (error) {
      alert('Failed to save shop');
    }
  };

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Management</h1>
          <p className="text-gray-600 mt-1">Manage partner shops</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Add Shop
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Shops</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{shops.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Active Shops</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {shops.filter((s) => s.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Inactive Shops</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {shops.filter((s) => !s.isActive).length}
          </p>
        </div>
      </div>

      {/* Shops Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No shops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-lg shadow overflow-hidden">
              {shop.image && (
                <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{shop.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{shop.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      shop.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {shop.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{shop.address}</p>
                  <p>{shop.phone}</p>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => openModal(shop)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(shop.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingShop ? 'Edit Shop' : 'Add Shop'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingShop?.name}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingShop?.description}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  rows={2}
                  required
                  defaultValue={editingShop?.address}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  defaultValue={editingShop?.phone}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  defaultValue={editingShop?.image}
                  className="input"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="isActive"
                  defaultValue={editingShop?.isActive?.toString() || 'true'}
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
                  {editingShop ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
