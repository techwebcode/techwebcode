import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

export default function AppButton({
    loading,
    className,
    children,
    ...props
}: Props) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={clsx(
                "rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50",
                className
            )}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}