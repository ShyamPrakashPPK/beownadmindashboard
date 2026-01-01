import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();
        const categories = await db.collection('categories').find({}).toArray();

        // Convert ObjectId to string for JSON serialization
        const serializedCategories = categories.map(category => ({
            ...category,
            _id: category._id.toString(),
        }));

        return NextResponse.json({ success: true, data: serializedCategories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Category name is required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // Check if category already exists
        const existing = await db.collection('categories').findOne({ name });
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Category already exists' },
                { status: 400 }
            );
        }

        const category = {
            name,
            description: description || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('categories').insertOne(category);

        return NextResponse.json(
            { success: true, data: { ...category, _id: result.insertedId } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create category' },
            { status: 500 }
        );
    }
}

