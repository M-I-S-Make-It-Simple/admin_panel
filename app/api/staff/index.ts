import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const staff = await prisma.staff.findMany();
    res.status(200).json(staff);
  } else if (req.method === 'POST') {
    const { photoUrl, fullname, position, short_bio, community } = req.body;
    const newStaff = await prisma.staff.create({
      data: { photoUrl, fullname, position, short_bio, community },
    });
    res.status(201).json(newStaff);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
