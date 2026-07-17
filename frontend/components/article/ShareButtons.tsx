"use client";

import {
    Link2,
} from "lucide-react";

import {
  FaFacebook,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

import { Button } from "@/components/ui/button";

interface Props {

    url: string;

    title: string;

}

export default function ShareButtons({

    url,

    title,

}: Readonly<Props>) {

    const copy = async () => {

        await navigator.clipboard.writeText(url);

    };

    return (

        <div className="space-y-3">

            <h3 className="font-semibold">

                Share

            </h3>

            <div className="flex gap-2">

                <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                        window.open(
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
                        )
                    }
                >

                    <FaXTwitter className="h-4 w-4" />

                </Button>

                <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                        window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                        )
                    }
                >

                    <FaFacebook className="h-4 w-4" />

                </Button>

                <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                        window.open(
                            `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`
                        )
                    }
                >

                    <FaLinkedin className="h-4 w-4" />

                </Button>

                <Button
                    size="icon"
                    variant="outline"
                    onClick={copy}
                >

                    <Link2 className="h-4 w-4" />

                </Button>

            </div>

        </div>

    );

}