'use client';

import { useQuery } from '@tanstack/react-query';
import { nocodbClient } from '@/lib/nocodb-client';
import { Database, FileText, Receipt, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: features, isLoading: featuresLoading } = useQuery({
    queryKey: ['features'],
    queryFn: () => nocodbClient.getFeatures(),
  });

  const { data: receipts, isLoading: receiptsLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => nocodbClient.getReceipts(),
  });

  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: () => nocodbClient.getTables(),
  });

  const stats = [
    {
      name: 'Total Collections',
      value: tables?.list?.length || 0,
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Features',
      value: features?.pageInfo?.totalRows || 0,
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Receipts',
      value: receipts?.pageInfo?.totalRows || 0,
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Active Users',
      value: 1,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const collections = [
    {
      id: 'features',
      name: 'Features Collection',
      description: 'Manage product features and capabilities',
      icon: Zap,
      count: features?.pageInfo?.totalRows || 0,
      href: '/collections/features',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'receipts',
      name: 'Receipt Collection',
      description: 'Track expenses and receipt management',
      icon: Receipt,
      count: receipts?.pageInfo?.totalRows || 0,
      href: '/collections/receipts',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Workspace Manager</h1>
                <p className="text-sm text-gray-500">Modern data management platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Connected to workspace
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tablesLoading || featuresLoading || receiptsLoading ? '...' : stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Collections Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Collections</h2>
            <div className="text-sm text-gray-500">
              {collections.length} active collections
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={collection.href}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${collection.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <collection.icon className={`w-6 h-6 ${collection.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{collection.count}</p>
                    <p className="text-sm text-gray-500">records</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{collection.name}</h3>
                <p className="text-gray-600 text-sm">{collection.description}</p>
                <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                  View collection
                  <TrendingUp className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/collections/features"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Zap className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium">Add Feature</span>
            </Link>
            <Link
              href="/collections/receipts"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Receipt className="w-5 h-5 text-purple-600 mr-3" />
              <span className="font-medium">Log Receipt</span>
            </Link>
            <Link
              href="/workspace"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-5 h-5 text-blue-600 mr-3" />
              <span className="font-medium">View Reports</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}