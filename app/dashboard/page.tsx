import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Package, FolderTree, Tag, Plus } from 'lucide-react';
import Link from 'next/link';
import { DashboardStats } from '@/components/dashboard-stats';

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    return (
        <LayoutWrapper>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}
                    </p>
                </div>

                {/* Quick Stats */}
                <DashboardStats />

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/products/new"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                            <Plus className="h-5 w-5 text-gray-600" />
                            <div className="text-left">
                                <h3 className="font-medium text-gray-900">Add Product</h3>
                                <p className="text-sm text-gray-500">Create a new product</p>
                            </div>
                        </Link>
                        <Link
                            href="/categories/new"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                        >
                            <Plus className="h-5 w-5 text-gray-600" />
                            <div className="text-left">
                                <h3 className="font-medium text-gray-900">Add Category</h3>
                                <p className="text-sm text-gray-500">Create a new category</p>
                            </div>
                        </Link>
                        <Link
                            href="/brands/new"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                        >
                            <Plus className="h-5 w-5 text-gray-600" />
                            <div className="text-left">
                                <h3 className="font-medium text-gray-900">Add Brand</h3>
                                <p className="text-sm text-gray-500">Create a new brand</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
}
