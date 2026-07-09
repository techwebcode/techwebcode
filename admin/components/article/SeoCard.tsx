"use client";

import { useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Input } from "../ui/input";

export default function SeoCard() {

    const { register } = useFormContext();

    return (

        <Card title="SEO">

            <div className="space-y-4">

                <label className="mb-2 block text-sm">
                        SEO Title
                </label>
                <Input
                    {...register("seo_title")}
                />

                <div>

                    <label className="mb-2 block text-sm">

                        SEO Description

                    </label>

                    <textarea
                        rows={4}
                        {...register("seo_description")}
                        className="w-full rounded-lg border p-2"
                    />

                </div>
                <label className="mb-2 block text-sm">
                    Canonical URL
                </label>
                <Input
                    // label="Canonical URL"
                    {...register("canonical_url")}
                />

            </div>

        </Card>

    );
}