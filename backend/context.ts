import { getContext } from '@keystone-6/core/context';
import config from './keystone';
//import { getServerSession } from 'next-auth/next'
//import { authOptions } from 'pages/api/auth/[...nextauth]'
import * as PrismaModule from '@prisma/client';
import { Context } from '.keystone/types';
import { NextApiRequest, NextApiResponse } from 'next/types';

// Making sure multiple prisma clients are not created during hot reloading
export const keystoneContext: Context =
  (globalThis as any).keystoneContext || getContext(config, PrismaModule);

if (process.env.NODE_ENV !== 'production')
  (globalThis as any).keystoneContext = keystoneContext;

export async function getSessionContext(props: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<Context> {
  return keystoneContext.withRequest(props.req, props.res);
}
