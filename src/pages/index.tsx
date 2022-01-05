import { GetStaticProps } from 'next';

import { FiUser, FiCalendar } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';
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
  const { results, next_page } = postsPagination;

  const [postsData, setPostsData] = useState({
    nextPage: next_page,
    posts: results,
  });
  /* console.log(postsData); */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const loadMore = async () => {
    const response = await fetch(postsData.nextPage);
    const data = await response.json();

    const newPosts = [...postsData.posts, ...data.results];

    setPostsData({
      nextPage: data.next_page,
      posts: newPosts,
    });
  };

  return (
    <>
      <Head>
        <title>Início | spacetraveling.</title>
      </Head>
      <main className={styles.container}>
        {postsData.posts.map(post => (
          <Link href={`/post/${post.uid}`} key={post.uid}>
            <a className={styles.post}>
              <h2>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>
              <div className={styles.info}>
                <div className={styles.date}>
                  <FiCalendar className={styles.icon} />
                  {format(
                    new Date(post.first_publication_date),
                    "d 'de' MMM 'de' yyyy",
                    {
                      locale: ptBR,
                    }
                  )}
                </div>
                <div className={styles.author}>
                  <FiUser className={styles.icon} />
                  {post.data.author}
                </div>
              </div>
            </a>
          </Link>
        ))}
      </main>
      {postsData.nextPage && (
        <div className={`${styles.container} ${styles.loadmoreButton}`}>
          <button onClick={loadMore} type="button">
            Carregar mais posts
          </button>
        </div>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      /* fetch: ['posts.title', 'posts.content'], */
      pageSize: 1,
    }
  );

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60,
  };
};
