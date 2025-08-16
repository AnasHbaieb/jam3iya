import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid image ID' }, { status: 400 });
    }

    await prisma.carouselImage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting carousel image with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message || 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const { order } = await request.json();

    if (isNaN(id) || typeof order !== 'number') {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }

    // Check if the new order already exists
    const existingImageWithOrder = await prisma.carouselImage.findUnique({
      where: { order },
    });

    if (existingImageWithOrder && existingImageWithOrder.id !== id) {
      // If an image with the target order exists, swap their orders
      await prisma.$transaction(async (prisma) => {
        // Get the current order of the image being moved
        const currentImage = await prisma.carouselImage.findUnique({ where: { id } });
        if (!currentImage) {
          throw new Error('Image not found');
        }
        const oldOrder = currentImage.order;

        // Update the existing image to the old order of the current image
        await prisma.carouselImage.update({
          where: { id: existingImageWithOrder.id },
          data: { order: oldOrder },
        });

        // Update the current image to the new order
        await prisma.carouselImage.update({
          where: { id },
          data: { order: order },
        });
      });

      return NextResponse.json({ message: 'Image order swapped successfully' }, { status: 200 });
    } else {
      // No image at the target order, or it's the same image, just update
      const updatedImage = await prisma.carouselImage.update({
        where: { id },
        data: { order },
      });
      return NextResponse.json(updatedImage, { status: 200 });
    }

  } catch (error: any) {
    console.error(`Error updating carousel image with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message || 'Unknown error' }, { status: 500 });
  }
}