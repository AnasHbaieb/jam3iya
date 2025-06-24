import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: Request) {
  try {
    // Handle formData with file upload instead of JSON
    const formData = await request.formData();
    
    // Extract product details from form data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const isNew = formData.get('isNew') as string;
    const imageFile = formData.get('image') as File;
    let imageUrl: string | null = null;
    
    if (imageFile && imageFile.name) {
      
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Create a unique filename
      const uniqueFilename = `${Date.now()}-${imageFile.name}`;
      const imagePath = join(uploadsDir, uniqueFilename);
      
      // Save the file
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(imagePath, buffer);
      
      // Store the relative URL for the database
      imageUrl = `/uploads/${uniqueFilename}`;
    }
    
    const productData = {
      name,
      description,
      category,
      isNew: isNew === 'true',
      imageUrl: imageUrl || null
    };
    
    // Find the highest existing rang value
    const highestRangProduct = await prisma.product.findFirst({
      orderBy: {
        rang: 'desc'
      }
    });
    
    // Increment the highest rang value by 1 (or start at 0 if no products exist)
    const nextRang = highestRangProduct ? highestRangProduct.rang + 1 : 0;
    
    // إنشاء المنتج with unique rang
    const product = await prisma.product.create({
      data: { ...productData, rang: nextRang },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        rang: 'asc'
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products'},
      { status: 500 }
    );
  }
}
