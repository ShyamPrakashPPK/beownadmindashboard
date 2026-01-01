'use client';

import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

interface Brand {
    _id: string;
    name: string;
    description: string;
    image: string;
    createdAt: string;
}

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands');
            const data = await res.json();
            if (data.success) {
                setBrands(data.data);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                setFormData({
                    name: '',
                    description: '',
                    image: '',
                });
                setShowForm(false);
                fetchBrands();
            } else {
                alert(data.error || 'Failed to create brand');
            }
        } catch (error) {
            console.error('Error creating brand:', error);
            alert('Failed to create brand');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-6">
                            <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
                                Gym Admin
                            </Link>
                            <nav className="flex gap-4">
                                <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Products
                                </Link>
                                <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Categories
                                </Link>
                                <Link href="/brands" className="text-blue-600 dark:text-blue-400 font-medium">
                                    Brands
                                </Link>
                            </nav>
                        </div>
                        <UserButton />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Brands</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {showForm ? 'Cancel' : 'Add Brand'}
                    </button>
                </div>

                {/* Add Brand Form */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Brand</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Brand Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="e.g., Nike, Adidas"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Brand description..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {submitting ? 'Creating...' : 'Create Brand'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Brands List */}
                {loading ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
                        Loading...
                    </div>
                ) : brands.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
                        No brands found. Add your first brand above.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {brands.map((brand) => (
                            <div
                                key={brand._id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {brand.image && (
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {brand.name}
                                    </h3>
                                    {brand.description && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            {brand.description}
                                        </p>
                                    )}
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Created: {new Date(brand.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

