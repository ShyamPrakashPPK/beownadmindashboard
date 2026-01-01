import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
        const { name, description, image, coo } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Brand name is required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        const updateData = {
            name,
            description: description || '',
            image: image || '',
            coo: coo || '',
            updatedAt: new Date(),
        };

        const result = await db.collection('brands').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Brand not found' },
                { status: 404 }
            );
        }

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

