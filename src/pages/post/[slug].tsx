import { GetStaticPaths, GetStaticProps } from 'next';

import Image from 'next/image';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

type ImageLoaderProps = {
  src: string;
};

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const ImageLoader = ({ src }: ImageLoaderProps): string => src;

  const timeToRead = post?.data.content.reduce((accumulator, currentValue) => {
    const bodyText = RichText.asText(currentValue.body)
      .split(/<.+?>(.+?)<\/.+?>/g)
      .filter(t => t);

    const wordsTotal = [];
    bodyText.forEach(text => {
      text.split(' ').forEach(word => {
        wordsTotal.push(word);
      });
    });

    const minutes = Math.ceil(wordsTotal.length / 200);

    return accumulator + minutes;
  }, 0);

  return router.isFallback ? (
    <div className={styles.container}>Carregando...</div>
  ) : (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling.</title>
      </Head>
      <header>
        <div className={styles.banner}>
          <Image
            loader={ImageLoader}
            src={post.data.banner.url}
            alt="Imagem do produto"
            width={1440}
            height={400}
            unoptimized
          />
        </div>
        <div className={styles.headerContainer}>
          <h1>{post.data.title}</h1>
          <div className={styles.infosContainer}>
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
            <div className={styles.time}>
              <FiClock className={styles.icon} />
              {timeToRead} min
            </div>
          </div>
        </div>
      </header>
      <main className={styles.mainContainer}>
        {post.data.content.map(content => (
          <div key={content.heading}>
            <h2>{content.heading}</h2>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
            />
          </div>
        ))}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.uid'],
      pageSize: 100,
    }
  );

  const postsPaths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths: postsPaths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post: response,
    },
  };
};
