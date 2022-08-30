import { FC } from 'react';

import { Meta } from '@/utils/meta/Meta';

import { IHome } from './home.interface';

export const Home: FC<IHome> = ({ empty }) => {
  return (
    <>
      <Meta title="Coffe with Urbech" description="Dream Team - Coffe with Urbech">
        <p>Hello</p>
      </Meta>
    </>
  );
};
