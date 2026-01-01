'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Label } from './label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    folder?: string;
}

export function ImageUpload({ value, onChange, label = 'Image', folder = 'brands' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync preview with value prop
    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('Image size must be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            // Create temporary preview for better UX
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success && data.data?.url) {
                const imageUrl = data.data.url;
                // Update preview with Cloudinary URL
                setPreview(imageUrl);
                // Call onChange immediately to update parent form state
                onChange(imageUrl);
            } else {
                alert(data.error || 'Failed to upload image');
                setPreview(value || null); // Revert to previous value
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
            setPreview(value || null); // Revert to previous value
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="space-y-4">
                {preview ? (
                    <div className="relative inline-block">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors",
                            uploading && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="text-sm text-gray-500">Uploading...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-gray-400" />
                                <p className="text-sm text-gray-600">Click to upload image</p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        )}
                    </div>
                )}
                {!preview && !uploading && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Select Image
                    </Button>
                )}
            </div>
        </div>
    );
}

