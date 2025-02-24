import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface SongOrder {
  id: string;
  order: number;
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body || !body.songs || !Array.isArray(body.songs)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { songs } = body as { songs: SongOrder[] };

    await prisma.$transaction(
      songs.map(({ id }, index) =>
        prisma.song.update({
          where: { id, userId: session.user.id },
          data: { order: -1000 - index }
        })
      )
    );

    await prisma.$transaction(
      songs.map(({ id }, index) =>
        prisma.song.update({
          where: { id, userId: session.user.id },
          data: { order: index }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Detailed error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack available'
    });

    return NextResponse.json(
      {
        error: 'Error reordering songs',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
