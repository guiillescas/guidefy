import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const songs = await prisma.song.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error loading songs:', error);
    return NextResponse.json({ error: 'Error loading songs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const lastSong = await prisma.song.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' }
    });

    const nextOrder = lastSong ? lastSong.order + 1 : 0;

    const song = await prisma.song.create({
      data: {
        title: body.title,
        key: body.key,
        sequence: body.sequence || [],
        userId: session.user.id,
        order: nextOrder
      }
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error('Error creating song:', error);
    return NextResponse.json({ error: 'Error creating song' }, { status: 500 });
  }
}
