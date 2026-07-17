"use client";

import { useEffect, useState } from "react";

interface Heading {

    id: string;

    text: string;

    level: number;

}

export default function TableOfContents() {

    const [headings, setHeadings] = useState<Heading[]>([]);

    const [active, setActive] = useState("");

    useEffect(() => {

        const elements = Array.from(
            document.querySelectorAll(
                "article h2, article h3"
            )
        );

        const items = elements.map((el) => ({

            id: el.id,

            text: el.textContent ?? "",

            level:
                Number(
                    el.tagName.substring(1)
                ),

        }));

        setHeadings(items);

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        setActive(
                            entry.target.id
                        );

                    }

                });

            },

            {

                rootMargin:
                    "-100px 0px -70% 0px",

            }

        );

        elements.forEach((el) =>
            observer.observe(el)
        );

        return () => {

            elements.forEach((el) =>
                observer.unobserve(el)
            );

        };

    }, []);

    if (!headings.length) {

        return null;

    }

    return (

        <aside
            className="
                sticky
                top-24
                rounded-xl
                border
                bg-card
                p-5
            "
        >

            <h3
                className="
                    mb-4
                    text-lg
                    font-semibold
                "
            >

                Table of Contents

            </h3>

            <nav>

                <ul className="space-y-2">

                    {headings.map((heading) => (

                        <li
                            key={heading.id}
                            className={
                                heading.level === 3
                                    ? "ml-4"
                                    : ""
                            }
                        >

                            <a

                                href={`#${heading.id}`}

                                className={`
                                    block
                                    text-sm
                                    transition-colors
                                    ${
                                        active ===
                                        heading.id
                                            ? "font-semibold text-primary"
                                            : "text-muted-foreground hover:text-primary"
                                    }
                                `}
                            >

                                {heading.text}

                            </a>

                        </li>

                    ))}

                </ul>

            </nav>

        </aside>

    );

}