'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nocodbClient } from '@/lib/nocodb-client';
import { Receipt } from '@/types/nocodb';
import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Receipt as ReceiptIcon, DollarSign, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

export default function ReceiptsCollection() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [newReceipt, setNewReceipt] = useState({
    'Short Description': '',
    Total: 0,
    Notes: '',
    Category: '',
    'Who Paid?': '',
  });
  const queryClient = useQueryClient();

  const { data: receipts, isLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => nocodbClient.getReceipts(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Receipt>) => nocodbClient.createReceipt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      setIsCreating(false);
      setNewReceipt({
        'Short Description': '',
        Total: 0,
        Notes: '',
        Category: '',
        'Who Paid?': '',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Receipt> }) =>
      nocodbClient.updateReceipt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      setEditingReceipt(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => nocodbClient.deleteReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReceipt['Short Description'].trim()) {
      createMutation.mutate({
        ...newReceipt,
        'Date & Time': new Date().toISOString(),
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReceipt && editingReceipt['Short Description'].trim()) {
      updateMutation.mutate({
        id: editingReceipt.Id,
        data: {
          'Short Description': editingReceipt['Short Description'],
          Total: editingReceipt.Total,
          Notes: editingReceipt.Notes,
          Category: editingReceipt.Category,
          'Who Paid?': editingReceipt['Who Paid?'],
        },
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalAmount = receipts?.list?.reduce((sum, receipt) => sum + (receipt.Total || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <ReceiptIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Receipt Collection</h1>
                  <p className="text-sm text-gray-500">
                    {receipts?.pageInfo?.totalRows || 0} receipts • Total: {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Receipt
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Form */}
        {isCreating && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Receipt</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={newReceipt['Short Description']}
                    onChange={(e) =>
                      setNewReceipt({ ...newReceipt, 'Short Description': e.target.value })
                    }
                    placeholder="Receipt description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReceipt.Total}
                    onChange={(e) =>
                      setNewReceipt({ ...newReceipt, Total: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newReceipt.Category}
                    onChange={(e) =>
                      setNewReceipt({ ...newReceipt, Category: e.target.value })
                    }
                    placeholder="e.g., Food, Transport, Office..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Who Paid?
                  </label>
                  <input
                    type="text"
                    value={newReceipt['Who Paid?']}
                    onChange={(e) =>
                      setNewReceipt({ ...newReceipt, 'Who Paid?': e.target.value })
                    }
                    placeholder="Person name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newReceipt.Notes}
                  onChange={(e) =>
                    setNewReceipt({ ...newReceipt, Notes: e.target.value })
                  }
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Receipt'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewReceipt({
                      'Short Description': '',
                      Total: 0,
                      Notes: '',
                      Category: '',
                      'Who Paid?': '',
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Receipts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Receipts</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading receipts...</div>
          ) : receipts?.list?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No receipts found. Create your first receipt!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {receipts?.list?.map((receipt) => (
                <div key={receipt.Id} className="p-6 hover:bg-gray-50">
                  {editingReceipt?.Id === receipt.Id ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editingReceipt['Short Description']}
                          onChange={(e) =>
                            setEditingReceipt({
                              ...editingReceipt,
                              'Short Description': e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={editingReceipt.Total}
                          onChange={(e) =>
                            setEditingReceipt({
                              ...editingReceipt,
                              Total: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {updateMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingReceipt(null)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-4">
                            {receipt['Short Description']}
                          </h3>
                          <div className="flex items-center text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {formatCurrency(receipt.Total || 0)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          {receipt.Category && (
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-1" />
                              {receipt.Category}
                            </div>
                          )}
                          {receipt['Who Paid?'] && (
                            <div>Paid by: {receipt['Who Paid?']}</div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(receipt.CreatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        {receipt.Notes && (
                          <p className="text-gray-600 text-sm">{receipt.Notes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setEditingReceipt(receipt)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this receipt?')) {
                              deleteMutation.mutate(receipt.Id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}