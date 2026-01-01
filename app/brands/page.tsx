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
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import Link from 'next/link';

interface Brand {
    _id: string;
    name: string;
    description: string;
    image: string;
    coo: string;
    createdAt: string;
}

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;

        try {
            const res = await fetch(`/api/brands/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (data.success) {
                fetchBrands();
            } else {
                alert(data.error || 'Failed to delete brand');
            }
        } catch (error) {
            console.error('Error deleting brand:', error);
            alert('Failed to delete brand');
        }
    };

    return (
        <LayoutWrapper>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
                        <p className="text-gray-600 mt-1">Manage product brands</p>
                    </div>
                    <Link href="/brands/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Brand
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : brands.length === 0 ? (
                        <div className="p-12 text-center">
                            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No brands found</p>
                            <Link href="/brands/new">
                                <Button variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Brand
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>COO</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {brands.map((brand) => (
                                    <TableRow key={brand._id}>
                                        <TableCell>
                                            {brand.image ? (
                                                <img
                                                    src={brand.image}
                                                    alt={brand.name}
                                                    className="h-12 w-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                                                    <Tag className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{brand.name}</TableCell>
                                        <TableCell className="text-gray-600 max-w-md truncate">
                                            {brand.description || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {brand.coo || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-500">
                                            {new Date(brand.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/brands/${brand._id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(brand._id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </LayoutWrapper>
    );
}
