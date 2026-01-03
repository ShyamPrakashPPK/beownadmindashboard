'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiImageUpload } from '@/components/ui/multi-image-upload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { generateSlug } from '@/lib/slug';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        images: [] as string[],
        brand: '',
        category: '',
        price: '',
        mrp: '',
        stock: '',
        weight: '',
        flavor: '',
        sku: '',
        isActive: true,
    });
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    useEffect(() => {
        fetchProduct();
        fetchCategories();
        fetchBrands();
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${params.id}`);
            const data = await res.json();
            if (data.success) {
                const product = data.data;
                setFormData({
                    name: product.name || '',
                    slug: product.slug || generateSlug(product.name || ''),
                    description: product.description || '',
                    images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
                    brand: product.brand || '',
                    category: product.category || '',
                    price: product.price?.toString() || '',
                    mrp: product.mrp?.toString() || product.price?.toString() || '',
                    stock: product.stock?.toString() || '',
                    weight: product.weight || '',
                    flavor: product.flavor || '',
                    sku: product.sku || '',
                    isActive: product.isActive !== undefined ? product.isActive : true,
                });
                setSlugManuallyEdited(!!product.slug);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands');
            const data = await res.json();
            if (data.success) {
                setBrands(data.data);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Ensure slug is sanitized before submission
            const submitData = {
                ...formData,
                slug: formData.slug ? generateSlug(formData.slug) : generateSlug(formData.name),
            };

            const res = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            });

            const data = await res.json();
            if (data.success) {
                router.push('/products');
            } else {
                alert(data.error || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <LayoutWrapper>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </LayoutWrapper>
        );
    }

    return (
        <LayoutWrapper>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/products">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-gray-600 mt-1">Update product information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData((prev) => {
                                        const newName = e.target.value;
                                        const newSlug = slugManuallyEdited ? prev.slug : generateSlug(newName);
                                        return { ...prev, name: newName, slug: newSlug };
                                    });
                                }}
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="slug">Slug (URL-friendly) *</Label>
                            <Input
                                id="slug"
                                required
                                value={formData.slug}
                                onChange={(e) => {
                                    setSlugManuallyEdited(true);
                                    // Allow manual editing, but sanitize on blur
                                    setFormData((prev) => ({ ...prev, slug: e.target.value }));
                                }}
                                onBlur={(e) => {
                                    // Sanitize slug when user finishes editing
                                    const sanitized = generateSlug(e.target.value);
                                    if (sanitized !== e.target.value) {
                                        setFormData((prev) => ({ ...prev, slug: sanitized }));
                                    }
                                }}
                                placeholder="product-slug"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Auto-generated from name. You can edit it manually. Used for SEO-friendly URLs.
                            </p>
                            {formData.slug && (
                                <p className="text-xs text-green-600 mt-1">
                                    Current Slug: {formData.slug}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <MultiImageUpload
                                value={formData.images}
                                onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                                label="Product Images"
                                folder="products"
                                maxImages={10}
                            />
                        </div>

                        <div>
                            <Label htmlFor="price">Price (Selling Price) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <Label htmlFor="mrp">MRP (Maximum Retail Price)</Label>
                            <Input
                                id="mrp"
                                type="number"
                                step="0.01"
                                value={formData.mrp}
                                onChange={(e) => setFormData((prev) => ({ ...prev, mrp: e.target.value }))}
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <Label htmlFor="weight">Weight</Label>
                            <Input
                                id="weight"
                                value={formData.weight}
                                onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                                placeholder="e.g., 300 g, 1 kg"
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                id="category"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="brand">Brand *</Label>
                            <Select
                                id="brand"
                                required
                                value={formData.brand}
                                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand._id} value={brand.name}>
                                        {brand.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="flavor">Flavor</Label>
                            <Input
                                id="flavor"
                                value={formData.flavor}
                                onChange={(e) => setFormData((prev) => ({ ...prev, flavor: e.target.value }))}
                                placeholder="e.g., Unflavoured, Chocolate, Vanilla"
                            />
                        </div>

                        <div>
                            <Label htmlFor="sku">SKU *</Label>
                            <Input
                                id="sku"
                                required
                                value={formData.sku}
                                onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                                placeholder="Product SKU (must be unique)"
                            />
                            <p className="text-xs text-gray-500 mt-1">SKU must be unique</p>
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                placeholder="Product description..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                                />
                                <Label htmlFor="isActive" className="cursor-pointer">
                                    Product is active (visible on website)
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link href="/products">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Updating...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </LayoutWrapper>
    );
}
