import { NextResponse} from "next/server";
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ContentPost } from '@prisma/client'; // Import ContentPost type

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id);
        const contentPost = await prisma.contentPost.findUnique({
            where: { id },
        });
        
        if (!contentPost) {
            return NextResponse.json(
                { error: 'Content post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(contentPost);
    } catch (error) {
        console.error('Error fetching content post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch content post' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        console.log('Update request received for content post ID:', (await params).id);
        
        const id = Number((await params).id);
        const formData = await request.formData();

        console.log('Received FormData:', Object.fromEntries(formData.entries()));

        const title = formData.get('title') as string;
        const description = formData.get('description') as string | null;
        const shortDescription = formData.get('shortDescription') as string | null;
        const imageFile = formData.get('image') as File | null;
        const secondaryImageFile = formData.get('secondaryImage') as File | null;

        console.log('Parsed values:', { id, title, description, shortDescription });

        const existingContentPost: ContentPost | null = await prisma.contentPost.findUnique({
            where: { id },
        });

        if (!existingContentPost) {
            console.error('Content post not found for ID:', id);
            return NextResponse.json(
                { error: 'Content post not found' },
                { status: 404 }
            );
        }
        
        console.log('Existing content post:', existingContentPost);

        let imageUrl = existingContentPost.imageUrl;
        let secondaryImageUrl = existingContentPost.secondaryImageUrl;

        const s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/s3`,
            credentials: {
              accessKeyId: process.env.ACCESS_KEY_ID!,
              secretAccessKey: process.env.SECRET_ACCESS_KEY!,
            },
            forcePathStyle: true,
        });

        // Process new image upload if provided
        if (imageFile && imageFile.name) {
            // Delete old image from S3 if it exists
            // For now, we will just overwrite with new upload. Realistically, you'd implement S3 delete.
            
            const fileExtension = imageFile.name.split('.').pop();
            const uniqueFilename = `${uuidv4()}.${fileExtension}`;
            const key = uniqueFilename;
            
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const command = new PutObjectCommand({
                Bucket: 'uploads',
                Key: key,
                Body: buffer,
                ContentType: imageFile.type,
            });
            
            await s3Client.send(command);
            
            imageUrl = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/uploads/${key}`;
        }

        // Process new secondary image upload if provided
        if (secondaryImageFile && secondaryImageFile.name) {
            // Delete old secondary image from S3 if it exists
            // For now, we will just overwrite with new upload. Realistically, you'd implement S3 delete.

            const fileExtension = secondaryImageFile.name.split('.').pop();
            const uniqueFilename = `${uuidv4()}-secondary.${fileExtension}`;
            const key = uniqueFilename;
            
            const bytes = await secondaryImageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const command = new PutObjectCommand({
                Bucket: 'uploads',
                Key: key,
                Body: buffer,
                ContentType: secondaryImageFile.type,
            });
            
            await s3Client.send(command);
            
            secondaryImageUrl = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/uploads/${key}`;
        }

        // Update the content post in the database
        const updateData = {
            title: title || existingContentPost.title,
            description: description ?? existingContentPost.description,
            shortDescription: shortDescription ?? existingContentPost.shortDescription, // Use nullish coalescing for optional string
            imageUrl: imageUrl || existingContentPost.imageUrl,
            secondaryImageUrl: secondaryImageUrl || existingContentPost.secondaryImageUrl,
        };

        const updatedContentPost = await prisma.contentPost.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedContentPost);
    } catch (error) {
        console.error('Error updating content post:', error);
        return NextResponse.json(
            { error: 'Failed to update content post' },
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
        const contentPost = await prisma.contentPost.delete({
            where: { id },
        });

        return NextResponse.json(contentPost);
    } catch (error) {
        console.error('Error deleting content post:', error);
        return NextResponse.json(
            { error: 'Failed to delete content post' },
            { status: 500 }
        );
    }
} 