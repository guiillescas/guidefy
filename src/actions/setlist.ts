// 'use server'

// import { prisma } from "@/lib/prisma";

// export async function createSetlist(data: SetlistData) {
//   const session = await getServerSession();
//   if (!session) throw new Error('Unauthorized');

//   return prisma.setlist.create({
//     data: {
//       ...data,
//       userId: session.user.id
//     }
//   });
// }
