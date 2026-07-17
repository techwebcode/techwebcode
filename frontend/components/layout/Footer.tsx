import Link from "next/link";

import Container from "./Container";

export default function Footer() {

    return (

        <footer className="border-t">

            <Container>

                <div className="flex flex-col items-center justify-between gap-6 py-10 md:flex-row">

                    <div>

                        <h3 className="text-xl font-bold">

                            <span className="text-blue-600">

                                Tech

                            </span>

                            WebCode

                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">

                            Learn Programming, Backend,
                            Frontend, DevOps and Software
                            Engineering.

                        </p>

                    </div>

                    <div className="flex gap-6 text-sm">

                        <Link href="/about">

                            About

                        </Link>

                        <Link href="/contact">

                            Contact

                        </Link>

                        <Link href="/privacy">

                            Privacy

                        </Link>

                    </div>

                </div>

                <div className="border-t py-6 text-center text-sm text-muted-foreground">

                    © {new Date().getFullYear()} TechWebCode.
                    All rights reserved.

                </div>

            </Container>

        </footer>

    );

}