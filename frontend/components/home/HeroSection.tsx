import Link from "next/link";

import { ArrowRight, BookOpen } from "lucide-react";

import Container from "@/components/layout/Container";

import { Button } from "@/components/ui/button";

export default function HeroSection() {

    return (

        <section className="relative overflow-hidden py-24">

            {/* Background */}

            <div className="absolute inset-0 -z-10">

                <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

            </div>

            <Container>

                <div className="mx-auto max-w-4xl text-center">

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            bg-muted
                            px-4
                            py-2
                            text-sm
                            font-medium
                        "
                    >

                        <BookOpen className="h-4 w-4 text-primary" />

                        Learn Programming the Right Way

                    </div>

                    <h1
                        className="
                            mt-8
                            text-5xl
                            font-extrabold
                            tracking-tight
                            md:text-7xl
                        "
                    >

                        Build Better Software

                        <span className="block text-primary">

                            With Practical Tutorials

                        </span>

                    </h1>

                    <p
                        className="
                            mx-auto
                            mt-8
                            max-w-2xl
                            text-lg
                            leading-8
                            text-muted-foreground
                        "
                    >

                        Learn Backend, Frontend, DevOps,
                        Cloud, AI and Software Engineering
                        through production-ready examples,
                        real-world projects and in-depth
                        guides.

                    </p>

                    <div
                        className="
                            mt-10
                            flex
                            flex-wrap
                            justify-center
                            gap-4
                        "
                    >

                        <Button
                            size="lg"
                        >

                            <Link href="/articles">

                                Explore Articles

                                <ArrowRight className="ml-2 h-4 w-4" />

                            </Link>

                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                        >

                            <Link href="/categories">

                                Browse Categories

                            </Link>

                        </Button>

                    </div>

                    <div
                        className="
                            mt-16
                            grid
                            grid-cols-2
                            gap-8
                            md:grid-cols-4
                        "
                    >

                        <div>

                            <h3 className="text-3xl font-bold">

                                500+

                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">

                                Tutorials

                            </p>

                        </div>

                        <div>

                            <h3 className="text-3xl font-bold">

                                30+

                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">

                                Categories

                            </p>

                        </div>

                        <div>

                            <h3 className="text-3xl font-bold">

                                100K+

                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">

                                Readers

                            </p>

                        </div>

                        <div>

                            <h3 className="text-3xl font-bold">

                                24/7

                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">

                                Learning

                            </p>

                        </div>

                    </div>

                </div>

            </Container>

        </section>

    );

}