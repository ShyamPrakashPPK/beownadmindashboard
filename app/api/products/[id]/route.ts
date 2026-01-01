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
        const product = await db.collection('products').findOne({
            _id: new ObjectId(id),
        });

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Convert ObjectId to string for JSON serialization
        const serializedProduct = {
            ...product,
            _id: product._id.toString(),
        };
        return NextResponse.json({ success: true, data: serializedProduct });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch product' },
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

        // Check for duplicate SKU if SKU is provided and different from current
        if (sku) {
            const currentProduct = await db.collection('products').findOne({ _id: new ObjectId(id) });
            if (currentProduct && currentProduct.sku !== sku) {
                const existingProduct = await db.collection('products').findOne({ sku });
                if (existingProduct) {
                    return NextResponse.json(
                        { success: false, error: 'SKU already exists. Please use a unique SKU.' },
                        { status: 400 }
                    );
                }
            }
        }

        const updateData = {
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
            updatedAt: new Date(),
        };

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updateData });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update product' },
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
        const result = await db.collection('products').deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}

