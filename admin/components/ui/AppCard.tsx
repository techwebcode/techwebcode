interface Props {
    title?: string;
    children: React.ReactNode;
}

export default function AppCard({
    title,
    children,
}: Props) {
    return (
        <div className="rounded-xl border bg-white shadow-sm">

            {title && (
                <div className="border-b px-6 py-4">
                    <h2 className="font-semibold">
                        {title}
                    </h2>
                </div>
            )}

            <div className="p-6">
                {children}
            </div>

        </div>
    );
}