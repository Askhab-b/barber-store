import type { NextApiRequest, NextApiResponse } from 'next';
import connectMongo from '@/utils/database/connectMongo';
import Test from '@/utils/models/testSchema';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await connectMongo().catch((error) => console.log(error));

  const data = await Test.find().catch((error) => console.log(error));

  res.status(200).json(data);
}
