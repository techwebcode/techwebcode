"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {

    const [progress, setProgress] = useState(0);

    useEffect(() => {

        const updateProgress = () => {

            const scrollTop = window.scrollY;

            const height =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const percentage =
                height > 0
                    ? (scrollTop / height) * 100
                    : 0;

            setProgress(
                Math.min(100, percentage)
            );

        };

        window.addEventListener(
            "scroll",
            updateProgress
        );

        updateProgress();

        return () =>
            window.removeEventListener(
                "scroll",
                updateProgress
            );

    }, []);

    return (

        <div
            className="
                fixed
                left-0
                top-0
                z-[100]
                h-1
                w-full
                bg-transparent
            "
        >

            <div
                className="
                    h-full
                    bg-primary
                    transition-all
                    duration-150
                "
                style={{
                    width: `${progress}%`,
                }}
            />

        </div>

    );

}