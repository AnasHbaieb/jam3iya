import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Move{
  currentRang:number
  targetRang:number
  targetProductId:number
}
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) { 
  try {
    const { currentRang, targetRang, targetProductId }: Move = await request.json();
    const currentProductId = Number((await params).id);


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

    console.log('Moving product:', {
      currentProduct: { id: currentProduct.id, rang: currentProduct.rang },
      targetProduct: { id: targetProduct.id, rang: targetProduct.rang },
      currentRang,
      targetRang
    });

    await prisma.$transaction([
      prisma.product.update({
        where: { id: currentProductId },
        data: { rang: -1 },
      }),
      prisma.product.update({
        where: { id: targetProductId },
        data: { rang: currentRang },
      }),
      prisma.product.update({
        where: { id: currentProductId },
        data: { rang: targetRang },
      })
    ]);

    const [updatedCurrent, updatedTarget] = await prisma.$transaction([
      prisma.product.findUnique({ where: { id: currentProductId } }),
      prisma.product.findUnique({ where: { id: targetProductId } })
    ]);

    return NextResponse.json({
      success: true,
      currentProduct: { id: updatedCurrent?.id, rang: updatedCurrent?.rang },
      targetProduct: { id: updatedTarget?.id, rang: updatedTarget?.rang }
    });

  } catch (error) {
    console.error('Error updating product order:', error);

    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'A product with this position already exists. Please refresh and try again.' },
        { status: 409 }
      );
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
