import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-6">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                Gym Admin Dashboard
                            </h1>
                            <nav className="flex gap-4">
                                <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Products
                                </Link>
                                <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Categories
                                </Link>
                                <Link href="/brands" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Brands
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                                Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
                            </p>
                            <UserButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">$0</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <Link href="/products" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Products</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/products" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Manage Products</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add and manage your products</p>
                        </Link>
                        <Link href="/categories" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-colors text-left">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Manage Categories</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Organize products by categories</p>
                        </Link>
                        <Link href="/brands" className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-left">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Manage Brands</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add and manage product brands</p>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>No recent activity to display</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

