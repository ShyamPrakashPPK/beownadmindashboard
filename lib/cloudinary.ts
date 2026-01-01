import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File, folder: string = 'brands'): Promise<string> {
    try {
        // Convert File to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert buffer to base64
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary (public by default)
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: folder,
            public_id: `${folder}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            resource_type: 'image',
            overwrite: false,
            invalidate: true,
            access_mode: 'public', // Ensure images are public
        });

        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
}

export async function deleteImage(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Failed to delete image');
    }
}

export { cloudinary };
