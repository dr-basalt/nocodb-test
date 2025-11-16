'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nocodbClient } from '@/lib/nocodb-client';
import { Feature } from '@/types/nocodb';
import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Zap } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesCollection() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const queryClient = useQueryClient();

  const { data: features, isLoading } = useQuery({
    queryKey: ['features'],
    queryFn: () => nocodbClient.getFeatures(),
  });

  const createMutation = useMutation({
    mutationFn: (title: string) => nocodbClient.createFeature({ Title: title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      setIsCreating(false);
      setNewFeatureTitle('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) =>
      nocodbClient.updateFeature(id, { Title: title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      setEditingFeature(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => nocodbClient.deleteFeature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeatureTitle.trim()) {
      createMutation.mutate(newFeatureTitle.trim());
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFeature && editingFeature.Title.trim()) {
      updateMutation.mutate({
        id: editingFeature.Id,
        title: editingFeature.Title.trim(),
      });
    }
  };

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
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Features Collection</h1>
                  <p className="text-sm text-gray-500">
                    {features?.pageInfo?.totalRows || 0} features
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Form */}
        {isCreating && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Feature</h3>
            <form onSubmit={handleCreate} className="flex gap-4">
              <input
                type="text"
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
                placeholder="Feature title..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewFeatureTitle('');
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Features List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Features</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading features...</div>
          ) : features?.list?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No features found. Create your first feature!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {features?.list?.map((feature) => (
                <div key={feature.Id} className="p-6 hover:bg-gray-50">
                  {editingFeature?.Id === feature.Id ? (
                    <form onSubmit={handleUpdate} className="flex gap-4">
                      <input
                        type="text"
                        value={editingFeature.Title}
                        onChange={(e) =>
                          setEditingFeature({ ...editingFeature, Title: e.target.value })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFeature(null)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{feature.Title}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(feature.CreatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingFeature(feature)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this feature?')) {
                              deleteMutation.mutate(feature.Id);
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