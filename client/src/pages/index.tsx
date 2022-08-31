import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getMongo } from '@/config/api.config';
interface HomePageProps {
  tests: any[];
  isConnected: boolean;
}

const Home = ({ isConnected, tests }: HomePageProps) => {
  console.log({ tests, isConnected });
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Кофе с урбечом</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="py-10 text-3xl font-bold">Шаблон</h1>

      <div>
        {isConnected ? (
          <div>
            Вы <span className="text-xl font-bold text-green-500">подключены</span> к MongoDB
          </div>
        ) : (
          <div>
            Вы <span className="text-xl font-bold text-red-500">не подключены</span> к MongoDB
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await getMongo('/get');
    return {
      props: { res, isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default Home;
