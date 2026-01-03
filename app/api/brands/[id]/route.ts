import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { generateSlug, generateUniqueSlug } from '@/lib/slug';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await getDatabase();
        const brand = await db.collection('brands').findOne({
            _id: new ObjectId(id),
        });

        if (!brand) {
            return NextResponse.json(
                { success: false, error: 'Brand not found' },
                { status: 404 }
            );
        }

        // Convert ObjectId to string for JSON serialization
        const serializedBrand = {
            ...brand,
            _id: brand._id.toString(),
        };
        return NextResponse.json({ success: true, data: serializedBrand });
    } catch (error) {
        console.error('Error fetching brand:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch brand' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description, image, coo, slug } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Brand name is required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // Get current brand
        const currentBrand = await db.collection('brands').findOne({ _id: new ObjectId(id) });
        if (!currentBrand) {
            return NextResponse.json(
                { success: false, error: 'Brand not found' },
                { status: 404 }
            );
        }

        // Generate slug if not provided or if name changed
        let brandSlug = slug || currentBrand.slug || generateSlug(name);

        // If slug changed, check for duplicates
        if (brandSlug !== currentBrand.slug) {
            const existingBrands = await db.collection('brands').find({
                slug: brandSlug,
                _id: { $ne: new ObjectId(id) }
            }).toArray();

            if (existingBrands.length > 0) {
                const existingSlugs = existingBrands.map(b => b.slug || '');
                brandSlug = generateUniqueSlug(brandSlug, existingSlugs);
            }
        }

        const updateData = {
            name,
            slug: brandSlug,
            description: description || '',
            image: image || '',
            coo: coo || '',
            updatedAt: new Date(),
        };

        const result = await db.collection('brands').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        return NextResponse.json({ success: true, data: updateData });
    } catch (error) {
        console.error('Error updating brand:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update brand' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await getDatabase();
        const result = await db.collection('brands').deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Brand not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting brand:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete brand' },
            { status: 500 }
        );
    }
}

