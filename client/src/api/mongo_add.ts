import type { NextApiRequest, NextApiResponse } from 'next';
import connectMongo from '@/utils/database/connectMongo';
import Test from '@/utils/models/testSchema';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await connectMongo().catch((error) => console.log(error));

  const r = req.body;
  const data = await new Test(r);

  await data.save().then(console.log('Document created.'));

  res.status(200).json(data);
}
