import { ReactNode } from "react";

import Container from "@/components/layout/Container";

interface Props {

    children: ReactNode;

}

export default function ArticleLayout({

    children,

}: Readonly<Props>) {

    return (

        <section className="py-16">

            <Container
                className="max-w-5xl"
            >

                {children}

            </Container>

        </section>

    );

}