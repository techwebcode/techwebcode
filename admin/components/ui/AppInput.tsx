import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export default function AppInput({
    label,
    ...props
}: Props) {
    return (
        <div className="space-y-2">

            {label && (
                <label className="text-sm font-medium">
                    {label}
                </label>
            )}

            <input
                {...props}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />

        </div>
    );
}