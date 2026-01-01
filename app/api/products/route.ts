import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();
        const products = await db.collection('products').find({}).toArray();

        // Convert ObjectId to string for JSON serialization
        const serializedProducts = products.map(product => ({
            ...product,
            _id: product._id.toString(),
        }));

        return NextResponse.json({ success: true, data: serializedProducts });
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
        const {
            name,
            description,
            images,
            brand,
            category,
            price,
            mrp,
            stock,
            weight,
            flavor,
            sku,
            isActive
        } = body;

        if (!name || !price || !category || !brand) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // Check for duplicate SKU if SKU is provided
        if (sku) {
            const existingProduct = await db.collection('products').findOne({ sku });
            if (existingProduct) {
                return NextResponse.json(
                    { success: false, error: 'SKU already exists. Please use a unique SKU.' },
                    { status: 400 }
                );
            }
        }

        const product = {
            name,
            description: description || '',
            images: Array.isArray(images) ? images : [],
            brand,
            category,
            price: parseFloat(price),
            mrp: mrp ? parseFloat(mrp) : parseFloat(price),
            stock: stock ? parseInt(stock) : 0,
            weight: weight || '',
            flavor: flavor || '',
            sku: sku || '',
            isActive: isActive !== undefined ? isActive : true,
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

