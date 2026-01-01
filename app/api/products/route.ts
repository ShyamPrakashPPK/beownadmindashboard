import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();
        const products = await db.collection('products').find({}).toArray();

        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, price, category, brand, image, stock, sku } = body;

        if (!name || !price || !category || !brand) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        const product = {
            name,
            description: description || '',
            price: parseFloat(price),
            category,
            brand,
            image: image || '',
            stock: stock ? parseInt(stock) : 0,
            sku: sku || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('products').insertOne(product);

        return NextResponse.json(
            { success: true, data: { ...product, _id: result.insertedId } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        );
    }
}

