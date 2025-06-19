import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';



export async function PUT(
  request: Request,
  context: { params: { id: number } }
) {
  try {
    const { currentRang, targetRang, targetProductId } = await request.json();
    const currentProductId = context.params.id;

    if (isNaN(currentProductId) || !targetProductId) {
      return NextResponse.json(
        { error: 'Invalid product IDs' },
        { status: 400 }
      );
    }

    if (currentProductId === targetProductId) {
      return NextResponse.json(
        { error: 'Cannot swap a product with itself' },
        { status: 400 }
      );
    }

    // Get both products in a transaction to ensure consistency
    const [currentProduct, targetProduct] = await prisma.$transaction([
      prisma.product.findUnique({ where: { id: currentProductId } }),
      prisma.product.findUnique({ where: { id: targetProductId } })
    ]);

    if (!currentProduct || !targetProduct) {
      return NextResponse.json(
        { error: 'One or both products not found' },
        { status: 404 }
      );
    }

    // Log the current state for debugging
    console.log('Moving product:', {
      currentProduct: { id: currentProduct.id, rang: currentProduct.rang, name: currentProduct.name },
      targetProduct: { id: targetProduct.id, rang: targetProduct.rang, name: targetProduct.name },
      currentRang,
      targetRang
    });

    // Update both products in a transaction
    await prisma.$transaction([
      // First, set current product's rang to a temporary value to avoid unique constraint violation
      prisma.product.update({
        where: { id: currentProductId },
        data: { rang: -1 },
      }),
      // Then update the target product
      prisma.product.update({
        where: { id: targetProductId },
        data: { rang: currentRang },
      }),
      // Finally, update the current product to the target rang
      prisma.product.update({
        where: { id: currentProductId },
        data: { rang: targetRang },
      })
    ]);

    // Get updated products to verify
    const [updatedCurrent, updatedTarget] = await prisma.$transaction([
      prisma.product.findUnique({ where: { id: currentProductId } }),
      prisma.product.findUnique({ where: { id: targetProductId } })
    ]);

    console.log('After move:', {
      currentProduct: updatedCurrent ? { id: updatedCurrent.id, rang: updatedCurrent.rang } : 'Not found',
      targetProduct: updatedTarget ? { id: updatedTarget.id, rang: updatedTarget.rang } : 'Not found'
    });

    return NextResponse.json({ 
      success: true,
      currentProduct: { id: updatedCurrent?.id, rang: updatedCurrent?.rang },
      targetProduct: { id: updatedTarget?.id, rang: updatedTarget?.rang }
    });

  } catch (error) {
    console.error('Error updating product order:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A product with this position already exists. Please refresh and try again.' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to update product order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}