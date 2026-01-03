'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { generateSlug } from '@/lib/slug';

export default function NewBrandPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        coo: '',
    });
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Ensure slug is sanitized before submission
            const submitData = {
                ...formData,
                slug: formData.slug ? generateSlug(formData.slug) : generateSlug(formData.name),
            };

            const res = await fetch('/api/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            });

            const data = await res.json();
            if (data.success) {
                router.push('/brands');
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
        <LayoutWrapper>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/brands">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Add New Brand</h1>
                        <p className="text-gray-600 mt-1">Create a new product brand</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Brand Name *</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => {
                                    const newName = e.target.value;
                                    const newSlug = slugManuallyEdited ? formData.slug : generateSlug(newName);
                                    setFormData({ ...formData, name: newName, slug: newSlug });
                                }}
                                placeholder="Enter brand name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="slug">Slug (URL-friendly) *</Label>
                            <Input
                                id="slug"
                                required
                                value={formData.slug}
                                onChange={(e) => {
                                    setSlugManuallyEdited(true);
                                    // Allow manual editing, but sanitize on blur
                                    setFormData({ ...formData, slug: e.target.value });
                                }}
                                onBlur={(e) => {
                                    // Sanitize slug when user finishes editing
                                    const sanitized = generateSlug(e.target.value);
                                    if (sanitized !== e.target.value) {
                                        setFormData({ ...formData, slug: sanitized });
                                    }
                                }}
                                placeholder="brand-slug"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Auto-generated from name. You can edit it manually. Used for SEO-friendly URLs.
                            </p>
                            {formData.slug && (
                                <p className="text-xs text-green-600 mt-1">
                                    Slug: {formData.slug}
                                </p>
                            )}
                        </div>

                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => {
                                console.log('Image URL received:', url);
                                setFormData((prev) => ({ ...prev, image: url }));
                            }}
                            label="Brand Image"
                            folder="brands"
                        />

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                placeholder="Brand description..."
                            />
                        </div>

                        <div>
                            <Label htmlFor="coo">Country of Origin (COO)</Label>
                            <Input
                                id="coo"
                                value={formData.coo}
                                onChange={(e) => setFormData({ ...formData, coo: e.target.value })}
                                placeholder="e.g., USA, China, India"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link href="/brands">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Brand'}
                        </Button>
                    </div>
                </form>
            </div>
        </LayoutWrapper>
    );
}

