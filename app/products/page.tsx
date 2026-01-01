'use client';

import { useState, useEffect } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
    _id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    mrp?: number;
    category: string;
    brand: string;
    stock: number;
    weight?: string;
    flavor?: string;
    sku: string;
    isActive?: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (data.success) {
                fetchProducts();
            } else {
                alert(data.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    return (
        <LayoutWrapper>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600 mt-1">Manage your product inventory</p>
                    </div>
                    <Link href="/products/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg border border-gray-200">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : products.length === 0 ? (
                        <div className="p-12 text-center">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No products found</p>
                            <Link href="/products/new">
                                <Button variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Product
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Thumbnail</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Brand</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>MRP</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => {
                                        const thumbnail = product.images && product.images.length > 0
                                            ? product.images[0]
                                            : null;
                                        return (
                                            <TableRow key={product._id}>
                                                <TableCell>
                                                    {thumbnail ? (
                                                        <img
                                                            src={thumbnail}
                                                            alt={product.name}
                                                            className="h-12 w-12 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                                                            <Package className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium max-w-xs">
                                                    <div>{product.name}</div>
                                                    {product.weight && (
                                                        <div className="text-xs text-gray-500">{product.weight}</div>
                                                    )}
                                                    {product.flavor && (
                                                        <div className="text-xs text-gray-500">{product.flavor}</div>
                                                    )}
                                                </TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>{product.brand}</TableCell>
                                                <TableCell className="font-medium">₹{product.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    {product.mrp ? (
                                                        <span className="text-gray-500 line-through">₹{product.mrp.toFixed(2)}</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                                        {product.stock}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-gray-500 text-sm">{product.sku || '-'}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded text-xs ${product.isActive !== false
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {product.isActive !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/products/${product._id}/edit`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(product._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </LayoutWrapper>
    );
}
