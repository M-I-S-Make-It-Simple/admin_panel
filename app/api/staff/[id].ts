import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { photoUrl, fullname, position, short_bio, community } = req.body;
    const updatedStaff = await prisma.staff.update({
      where: { id: Number(id) },
      data: { photoUrl, fullname, position, short_bio, community },
    });
    res.status(200).json(updatedStaff);
  } else if (req.method === 'DELETE') {
    await prisma.staff.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
