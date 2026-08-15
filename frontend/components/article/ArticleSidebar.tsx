"use client";

import TableOfContents from "./TableOfContents";
import ShareButtons from "./ShareButtons";

interface Props {

    url: string;

    title: string;

}

export default function ArticleSidebar({

    url,

    title,

}: Readonly<Props>) {

    return (

        <aside
            className="
                hidden
                xl:block
                xl:w-80
                shrink-0
            "
        >

            <div
                className="
                    sticky
                    top-24
                    space-y-6
                    max-h-[calc(100vh-7rem)]
                    flex
                    flex-col
                    justify-between
                "
            >

                <TableOfContents />

                <ShareButtons

                    url={url}

                    title={title}

                />

            </div>

        </aside>

    );

}