import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();

        const [productsCount, categoriesCount, brandsCount] = await Promise.all([
            db.collection('products').countDocuments(),
            db.collection('categories').countDocuments(),
            db.collection('brands').countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                products: productsCount,
                categories: categoriesCount,
                brands: brandsCount,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}

