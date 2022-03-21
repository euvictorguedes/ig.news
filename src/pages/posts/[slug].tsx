import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import * as PrismicH from '@prismicio/helpers';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });
  const { slug } = params;

  // if (!session) {
  // }

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: PrismicH.asText(response.data.title),
    content: PrismicH.asHTML(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};
