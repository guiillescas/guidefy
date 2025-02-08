import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

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

    // Verifica se todas as músicas pertencem ao usuário antes de atualizar
    const userSongs = await prisma.song.findMany({
      where: {
        id: { in: songs.map(s => s.id) },
        userId: session.user.id
      }
    });

    if (userSongs.length !== songs.length) {
      return NextResponse.json({ error: 'Unauthorized access to songs' }, { status: 403 });
    }

    await prisma.$transaction(
      songs.map(({ id, order }) =>
        prisma.song.update({
          where: {
            id,
            userId: session.user.id
          },
          data: { order }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering songs:', error);
    return NextResponse.json({ error: 'Error reordering songs' }, { status: 500 });
  }
} 
