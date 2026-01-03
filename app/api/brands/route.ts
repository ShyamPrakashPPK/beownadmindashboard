import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { generateSlug, generateUniqueSlug } from '@/lib/slug';

export async function GET() {
    try {
        const db = await getDatabase();
        const brands = await db.collection('brands').find({}).toArray();

        // Convert ObjectId to string for JSON serialization
        const serializedBrands = brands.map(brand => ({
            ...brand,
            _id: brand._id.toString(),
        }));

        return NextResponse.json({ success: true, data: serializedBrands });
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch brands' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, image, coo, slug } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Brand name is required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // Check if brand already exists
        const existing = await db.collection('brands').findOne({ name });
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Brand already exists' },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        let brandSlug = slug || generateSlug(name);

        // Check for duplicate slug and make it unique if needed
        const existingBrands = await db.collection('brands').find({ slug: brandSlug }).toArray();
        if (existingBrands.length > 0) {
            const existingSlugs = existingBrands.map(b => b.slug || '');
            brandSlug = generateUniqueSlug(brandSlug, existingSlugs);
        }

        const brand = {
            name,
            slug: brandSlug,
            description: description || '',
            image: image || '',
            coo: coo || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('brands').insertOne(brand);

        return NextResponse.json(
            { success: true, data: { ...brand, _id: result.insertedId } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating brand:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create brand' },
            { status: 500 }
        );
    }
}

