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

export default function NewBrandPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        coo: '',
    });

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
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter brand name"
                            />
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

