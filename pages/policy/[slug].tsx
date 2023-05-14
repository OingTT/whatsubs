import styled from "@emotion/styled";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  gap: 24px;

  @media (min-width: 1200px) {
    width: 984px;
  }

  @media (max-width: 809px) {
    padding: 16px;
    gap: 16px;
  }
`;

interface PolicyProps {
  data: {
    title: string;
    date: string;
  };
  content: string;
}

export default function Policy({ data, content }: PolicyProps) {
  return (
    <Wrapper>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Wrapper>
  );
}

export function getStaticPaths() {
  return {
    paths: [{ params: { slug: "privacy" } }, { params: { slug: "terms" } }],
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
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
