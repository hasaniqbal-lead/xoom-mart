'use client';

import { useEffect, useState } from 'react';
import {
  getCategories,
  getSubcategories,
  getItems,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  createItem,
  updateItem,
  deleteItem,
} from '@/lib/api';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
}

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  subcategoryId: string;
  isActive: boolean;
  inStock: boolean;
}

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories' | 'items'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'categories') {
        const res = await getCategories();
        setCategories(res.data);
      } else if (activeTab === 'subcategories') {
        const [subRes, catRes] = await Promise.all([getSubcategories(), getCategories()]);
        setSubcategories(subRes.data);
        setCategories(catRes.data);
      } else {
        const [itemRes, subRes] = await Promise.all([getItems(), getSubcategories()]);
        setItems(itemRes.data);
        setSubcategories(subRes.data);
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
      if (activeTab === 'categories') {
        await deleteCategory(id);
      } else if (activeTab === 'subcategories') {
        await deleteSubcategory(id);
      } else {
        await deleteItem(id);
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
      if (key === 'isActive' || key === 'inStock') {
        data[key] = value === 'true';
      } else if (key === 'price' || key === 'sortOrder') {
        data[key] = Number(value);
      } else {
        data[key] = value;
      }
    });

    try {
      if (activeTab === 'categories') {
        if (editingItem) {
          await updateCategory(editingItem.id, data);
        } else {
          await createCategory(data);
        }
      } else if (activeTab === 'subcategories') {
        if (editingItem) {
          await updateSubcategory(editingItem.id, data);
        } else {
          await createSubcategory(data);
        }
      } else {
        if (editingItem) {
          await updateItem(editingItem.id, data);
        } else {
          await createItem(data);
        }
      }
      closeModal();
      loadData();
    } catch (error) {
      alert('Failed to save item');
    }
  };

  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'categories') {
      return categories.filter((c) => c.name.toLowerCase().includes(term));
    } else if (activeTab === 'subcategories') {
      return subcategories.filter((s) => s.name.toLowerCase().includes(term));
    } else {
      return items.filter((i) => i.name.toLowerCase().includes(term));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Catalog Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['categories', 'subcategories', 'items'].map((tab) => (
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              {activeTab === 'subcategories' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
              )}
              {activeTab === 'items' && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subcategory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                </>
              )}
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
            ) : filteredData().length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No {activeTab} found
                </td>
              </tr>
            ) : (
              filteredData().map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  {activeTab === 'subcategories' && (
                    <td className="px-6 py-4 text-gray-600">
                      {categories.find((c) => c.id === item.categoryId)?.name}
                    </td>
                  )}
                  {activeTab === 'items' && (
                    <>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {subcategories.find((s) => s.id === item.subcategoryId)?.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
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
                  defaultValue={editingItem?.name}
                  className="input"
                />
              </div>

              {activeTab === 'items' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={editingItem?.description}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      required
                      defaultValue={editingItem?.price}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <select
                      name="subcategoryId"
                      required
                      defaultValue={editingItem?.subcategoryId}
                      className="input"
                    >
                      <option value="">Select subcategory</option>
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      In Stock
                    </label>
                    <select
                      name="inStock"
                      defaultValue={editingItem?.inStock?.toString() || 'true'}
                      className="input"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'subcategories' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="categoryId"
                    required
                    defaultValue={editingItem?.categoryId}
                    className="input"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  defaultValue={editingItem?.image}
                  className="input"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={editingItem?.sortOrder || 0}
                  className="input"
                />
              </div>

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
