import Container from "@/components/layout/Container";

import ArticleHeader from "@/components/article/ArticleHeader";

import ArticleContent from "@/components/article/ArticleContent";

import ArticleSidebar from "@/components/article/ArticleSidebar";

import RelatedArticles from "@/components/article/RelatedArticles";

import ArticleService from "@/services/article";

interface Props {

    params: Promise<{

        slug: string;

    }>;

}

export default async function ArticlePage({

    params,

}: Readonly<Props>) {

    const { slug } = await params;

    const response =
        await ArticleService.getArticle(slug);

    const article = response.data;

    return (

        <Container
            className="py-16"
        >

            <ArticleHeader
                article={article}
            />

            <div
                className="
                    flex
                    gap-12
                "
            >

                <div className="min-w-0 flex-1">

                    <ArticleContent
                        article={article}
                    />

                </div>

                <ArticleSidebar

                    url={`https://techwebcode.com/articles/${article.slug}`}

                    title={article.title}

                />

            </div>

            <RelatedArticles

                slug={article.slug}

            />

        </Container>

    );

}