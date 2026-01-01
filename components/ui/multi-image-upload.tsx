'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Label } from './label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiImageUploadProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    label?: string;
    folder?: string;
    maxImages?: number;
}

export function MultiImageUpload({
    value = [],
    onChange,
    label = 'Images',
    folder = 'products',
    maxImages = 10
}: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>(value || []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync images with value prop
    useEffect(() => {
        setImages(value || []);
    }, [value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check if adding these files would exceed maxImages
        if (images.length + files.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`);
            return;
        }

        setUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    throw new Error(`${file.name} is not an image file`);
                }

                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    throw new Error(`${file.name} exceeds 5MB size limit`);
                }

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
                    return data.data.url;
                } else {
                    throw new Error(data.error || `Failed to upload ${file.name}`);
                }
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            const newImages = [...images, ...uploadedUrls];
            setImages(newImages);
            onChange(newImages);
        } catch (error: any) {
            console.error('Error uploading images:', error);
            alert(error.message || 'Failed to upload images');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onChange(newImages);
    };

    const handleMove = (fromIndex: number, toIndex: number) => {
        const newImages = [...images];
        const [removed] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, removed);
        setImages(newImages);
        onChange(newImages);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label>{label}</Label>
                <span className="text-xs text-gray-500">
                    {images.length}/{maxImages} images • First image is thumbnail
                </span>
            </div>

            <div className="space-y-4">
                {/* Image Grid */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                                <div className="relative aspect-square rounded-lg border-2 border-gray-200 overflow-hidden">
                                    <img
                                        src={imageUrl}
                                        alt={`Product image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {index === 0 && (
                                        <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                            Thumbnail
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleMove(index, 0)}
                                            className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Set as thumbnail"
                                        >
                                            Set Thumbnail
                                        </button>
                                    )}
                                </div>
                                <div className="text-xs text-center text-gray-500 mt-1">
                                    Image {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Area */}
                {images.length < maxImages && (
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
                            multiple
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
                                <p className="text-sm text-gray-600">Click to upload images</p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                            </div>
                        )}
                    </div>
                )}

                {images.length < maxImages && !uploading && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add Images ({images.length}/{maxImages})
                    </Button>
                )}
            </div>
        </div>
    );
}

