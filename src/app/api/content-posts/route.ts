import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ContentPost } from '@prisma/client'; // Import ContentPost type

export async function POST(request: Request) {
  try {
    // Handle formData with file upload instead of JSON
    const formData = await request.formData();
    
    // Extract content post details from form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const shortDescription = formData.get('shortDescription') as string | null;
    const imageFile = formData.get('image') as File;
    const secondaryImageFile = formData.get('secondaryImage') as File;
    let imageUrl: string | null = null;
    let secondaryImageUrl: string | null = null;
    
    if (imageFile && imageFile.name) {
      // Initialize S3 client
      const s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/s3`,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID!,
          secretAccessKey: process.env.SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
      });

      // Create a unique filename
      const fileExtension = imageFile.name.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      const key = uniqueFilename;
      
      // Convert file to buffer
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: 'uploads',
        Key: key,
        Body: buffer,
        ContentType: imageFile.type,
      });
      
      await s3Client.send(command);
      
      // Generate public URL - Correct format for Supabase Storage
      imageUrl = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/uploads/${key}`;
    }

    if (secondaryImageFile && secondaryImageFile.name) {
      const s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/s3`,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID!,
          secretAccessKey: process.env.SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
      });

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
    
    const postData = {
      title,
      description,
      shortDescription,
      imageUrl: imageUrl || null,
      secondaryImageUrl: secondaryImageUrl || null
    };
    
    // Find the highest existing rang value
    const highestRangPost = await prisma.contentPost.findFirst({
      orderBy: {
        rang: 'desc'
      }
    });
    
    // Increment the highest rang value by 1 (or start at 0 if no content posts exist)
    const nextRang = highestRangPost ? highestRangPost.rang + 1 : 0;
    
    // Create the content post with unique rang
    const contentPost = await prisma.contentPost.create({
      data: { ...postData, rang: nextRang },
    });
    
    return NextResponse.json(contentPost, { status: 201 });
  } catch (error) {
    console.error('Error creating content post:', error);
    return NextResponse.json(
      { error: 'Failed to create content post' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contentPosts: ContentPost[] = await prisma.contentPost.findMany({
      orderBy: {
        rang: 'asc'
      }
    });

    // Ensure all image URLs are properly formatted for Supabase
    const formattedContentPosts = contentPosts.map(post => {
      const finalImageUrl = post.imageUrl;
      return {
        ...post,
        imageUrl: finalImageUrl,
        secondaryImageUrl: post.secondaryImageUrl
      };
    });

    return NextResponse.json(formattedContentPosts);
  } catch (error) {
    console.error('Error fetching content posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content posts'},
      { status: 500 }
    );
  }
} 