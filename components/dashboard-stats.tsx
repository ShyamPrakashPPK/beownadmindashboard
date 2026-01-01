'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, FolderTree, Tag } from 'lucide-react';

export function DashboardStats() {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        brands: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/products" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Products</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {loading ? '...' : stats.products}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </Link>

            <Link href="/categories" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Categories</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {loading ? '...' : stats.categories}
                        </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <FolderTree className="h-6 w-6 text-green-600" />
                    </div>
                </div>
            </Link>

            <Link href="/brands" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Brands</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {loading ? '...' : stats.brands}
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <Tag className="h-6 w-6 text-purple-600" />
                    </div>
                </div>
            </Link>
        </div>
    );
}

