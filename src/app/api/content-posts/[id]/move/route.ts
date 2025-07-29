import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Move{
  currentRang:number
  targetRang:number
  targetContentPostId:number
}
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) { 
  try {
    const { currentRang, targetRang, targetContentPostId }: Move = await request.json();
    const currentContentPostId = Number((await params).id);


    if (isNaN(currentContentPostId) || !targetContentPostId) {
      return NextResponse.json(
        { error: 'Invalid content post IDs' },
        { status: 400 }
      );
    }

    if (currentContentPostId === targetContentPostId) {
      return NextResponse.json(
        { error: 'Cannot swap a content post with itself' },
        { status: 400 }
      );
    }

    const [currentContentPost, targetContentPost] = await prisma.$transaction([
      prisma.contentPost.findUnique({ where: { id: currentContentPostId } }),
      prisma.contentPost.findUnique({ where: { id: targetContentPostId } })
    ]);

    if (!currentContentPost || !targetContentPost) {
      return NextResponse.json(
        { error: 'One or both content posts not found' },
        { status: 404 }
      );
    }

    console.log('Moving content post:', {
      currentContentPost: { id: currentContentPost.id, rang: currentContentPost.rang },
      targetContentPost: { id: targetContentPost.id, rang: targetContentPost.rang },
      currentRang,
      targetRang
    });

    await prisma.$transaction([
      prisma.contentPost.update({
        where: { id: currentContentPostId },
        data: { rang: -1 },
      }),
      prisma.contentPost.update({
        where: { id: targetContentPostId },
        data: { rang: currentRang },
      }),
      prisma.contentPost.update({
        where: { id: currentContentPostId },
        data: { rang: targetRang },
      })
    ]);

    const [updatedCurrent, updatedTarget] = await prisma.$transaction([
      prisma.contentPost.findUnique({ where: { id: currentContentPostId } }),
      prisma.contentPost.findUnique({ where: { id: targetContentPostId } })
    ]);

    return NextResponse.json({
      success: true,
      currentContentPost: { id: updatedCurrent?.id, rang: updatedCurrent?.rang },
      targetContentPost: { id: updatedTarget?.id, rang: updatedTarget?.rang }
    });

  } catch (error) {
    console.error('Error updating content post order:', error);

    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'A content post with this position already exists. Please refresh and try again.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update content post order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 