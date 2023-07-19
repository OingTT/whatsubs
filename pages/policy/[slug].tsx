import { Container } from '@/lib/client/style';
import matter from 'gray-matter';
import { GetStaticProps } from 'next';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

interface PolicyProps {
  data: {
    title: string;
    date: string;
  };
  content: string;
}

export default function Policy({ data, content }: PolicyProps) {
  return (
    <Container>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Container>
  );
}

export function getStaticPaths() {
  return {
    paths: [{ params: { slug: 'privacy' } }, { params: { slug: 'terms' } }],
    fallback: 'blocking',
  };
}

export const getStaticProps: GetStaticProps = async ctx => {
  const { content, data } = matter.read(
    `documents/policy/${ctx.params?.slug}.md`
  );
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);

  return {
    props: {
      data,
      content: value,
    },
  };
};
