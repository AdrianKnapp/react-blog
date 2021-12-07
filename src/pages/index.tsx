import { GetStaticProps } from 'next';

import { FiUser, FiCalendar } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <main className={styles.container}>
      <div className={styles.post}>
        <h2>Como utilizar Hooks</h2>
        <p>Pensando em sincronizalção em vez de ciclos de vida</p>
        <div className={styles.info}>
          <div className={styles.date}>
            <FiCalendar className={styles.icon} />
            15 Mar 2021
          </div>
          <div className={styles.author}>
            <FiUser className={styles.icon} />
            Joseph Oliveira
          </div>
        </div>
      </div>
    </main>
  );
}

/* export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('TODO');
}; */
