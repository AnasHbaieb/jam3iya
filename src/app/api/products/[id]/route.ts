import { NextResponse} from "next/server";
import { prisma } from '@/lib/prisma';
import { writeFile, unlink } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        const product = await prisma.product.findUnique({
            where: { id },
        });
        
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        console.log('Update request received for product ID:', (await params).id);
        
        const id = Number((await params).id);
        const formData = await request.formData();

        console.log('Received FormData:', Object.fromEntries(formData.entries()));

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const imageFile = formData.get('image') as File | null;

        console.log('Parsed values:', { id, name, description, category });

        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            console.error('Product not found for ID:', id);
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }
        
        console.log('Existing product:', existingProduct);

        let imageUrl = existingProduct.imageUrl;

        // Process new image upload if provided
        if (imageFile && imageFile.name) {
            // Delete old image if it exists
            if (existingProduct.imageUrl) {
                const oldImagePath = join(process.cwd(), 'public', existingProduct.imageUrl);
                try {
                    await unlink(oldImagePath);
                } catch (error) {
                    console.error('Error deleting old image:', error);
                }
            }
            // Ensure uploads directory exists
            const uploadsDir = join(process.cwd(), 'public', 'uploads');
            if (!existsSync(uploadsDir)) {
                mkdirSync(uploadsDir, { recursive: true });
            }
            // Create a unique filename
            const uniqueFilename = `${Date.now()}-${imageFile.name}`;
            const imagePath = join(uploadsDir, uniqueFilename);
            
            // Save the new file
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(imagePath, buffer);
            
            // Update the image URL
            imageUrl = `/uploads/${uniqueFilename}`;
        }

        // Update the product in the database
        const updateData = {
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            category: category || existingProduct.category,
            imageUrl: imageUrl || existingProduct.imageUrl,
        };

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        const product = await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}


