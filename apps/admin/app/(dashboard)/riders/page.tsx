'use client';

import { useEffect, useState } from 'react';
import { getRiders, createRider, updateRider, deleteRider } from '@/lib/api';
import { Plus, Edit2, Trash2, Search, X, Bike } from 'lucide-react';

interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  isAvailable: boolean;
  createdAt: string;
}

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    setLoading(true);
    try {
      const res = await getRiders();
      setRiders(res.data);
    } catch (error) {
      console.error('Failed to load riders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rider?')) return;

    try {
      await deleteRider(id);
      loadRiders();
    } catch (error) {
      alert('Failed to delete rider');
    }
  };

  const toggleAvailability = async (rider: Rider) => {
    try {
      await updateRider(rider.id, { isAvailable: !rider.isAvailable });
      loadRiders();
    } catch (error) {
      alert('Failed to update rider availability');
    }
  };

  const openModal = (rider?: Rider) => {
    setEditingRider(rider || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRider(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      if (key === 'isAvailable') {
        data[key] = value === 'true';
      } else {
        data[key] = value;
      }
    });

    try {
      if (editingRider) {
        await updateRider(editingRider.id, data);
      } else {
        await createRider(data);
      }
      closeModal();
      loadRiders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save rider');
    }
  };

  const filteredRiders = riders.filter(
    (rider) =>
      rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phone.includes(searchTerm) ||
      rider.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rider Management</h1>
          <p className="text-gray-600 mt-1">Manage delivery riders</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Add Rider
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search riders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Riders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{riders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {riders.filter((r) => r.isAvailable).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Unavailable</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {riders.filter((r) => !r.isAvailable).length}
          </p>
        </div>
      </div>

      {/* Riders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehicle
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
              ) : filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No riders found</p>
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider) => (
                  <tr key={rider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                          {rider.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{rider.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{rider.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{rider.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{rider.vehicleType}</p>
                        <p className="text-gray-600">{rider.vehicleNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(rider)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          rider.isAvailable
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {rider.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(rider)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rider.id)}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingRider ? 'Edit Rider' : 'Add Rider'}
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
                  defaultValue={editingRider?.name}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={editingRider?.email}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  defaultValue={editingRider?.phone}
                  className="input"
                />
              </div>

              {!editingRider && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="input"
                    placeholder="Min 6 characters"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  required
                  defaultValue={editingRider?.vehicleType || 'Motorcycle'}
                  className="input"
                >
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Car">Car</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  required
                  defaultValue={editingRider?.vehicleNumber}
                  className="input"
                  placeholder="e.g., ABC-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="isAvailable"
                  defaultValue={editingRider?.isAvailable?.toString() || 'true'}
                  className="input"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
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
                  {editingRider ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
