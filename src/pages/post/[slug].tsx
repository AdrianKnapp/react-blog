import { GetStaticPaths, GetStaticProps } from 'next';

import Image from 'next/image';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
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
  const ImageLoader = ({ src }: ImageLoaderProps): string => src;

  return (
    <>
      <header>
        <div className={styles.banner}>
          <Image
            loader={ImageLoader}
            src="/banner.png"
            alt="Imagem do produto"
            width={1440}
            height={400}
            unoptimized
          />
        </div>
        <div className={styles.headerContainer}>
          <h1>Criado um app CRA do zero</h1>
          <div className={styles.infosContainer}>
            <div className={styles.date}>
              <FiCalendar className={styles.icon} />
              15 Mar 2021
            </div>
            <div className={styles.author}>
              <FiUser className={styles.icon} />
              Joseph Oliveira
            </div>
            <div className={styles.time}>
              <FiClock className={styles.icon} />4 min
            </div>
          </div>
        </div>
      </header>
      <main className={styles.mainContainer}>
        <h2>Proin et varius</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dolor
          sapien, vulputate eu diam at, condimentum hendrerit tellus. Nam
          facilisis sodales felis, pharetra pharetra lectus auctor sed. Ut
          venenatis mauris vel libero pretium, et pretium ligula faucibus. Morbi
          nibh felis, elementum a posuere et, vulputate et erat. Nam venenatis.
        </p>
      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
