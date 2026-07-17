import { Article } from "@/types/article";

interface Props {
    article: Article;
}

export default function ArticleContent({
    article,
}: Readonly<Props>) {

    return (

        <article
            className="
                prose
                prose-slate
                dark:prose-invert
                max-w-none

                prose-headings:scroll-mt-24
                prose-headings:font-bold

                prose-h1:text-5xl
                prose-h2:text-4xl
                prose-h3:text-3xl

                prose-p:leading-8

                prose-img:rounded-2xl

                prose-pre:rounded-2xl
                prose-pre:border

                prose-code:rounded
                prose-code:bg-muted
                prose-code:px-1.5
                prose-code:py-1

                prose-blockquote:border-primary
                prose-blockquote:not-italic

                prose-table:w-full

                prose-a:text-primary
                prose-a:no-underline
                hover:prose-a:underline
            "
            dangerouslySetInnerHTML={{
                __html: article.content_html,
            }}
        />

    );

}