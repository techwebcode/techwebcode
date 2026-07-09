"use client";

import { useFormContext } from "react-hook-form";

import { AppButton, AppCard } from "@/components/ui";
import { Card } from "../ui/card";

export default function PublishCard() {

    const { register } = useFormContext();

    return (

        <Card title="Publish">

            <div className="space-y-4">

                <select
                    {...register("status")}
                    className="w-full rounded-lg border p-2"
                >
                    <option value="draft">
                        Draft
                    </option>

                    <option value="published">
                        Published
                    </option>

                </select>

                <label className="flex items-center gap-2">

                    <input
                        type="checkbox"
                        {...register("is_featured")}
                    />

                    Featured Article

                </label>

                <AppButton
                    type="submit"
                    className="w-full"
                >
                    Save Article
                </AppButton>

            </div>

        </Card>

    );
}