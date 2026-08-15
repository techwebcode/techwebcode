"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function PublishCard() {
    const { register } = useFormContext();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Publishing & Visibility</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <Label className="mb-2 block">Article Status</Label>
                    <select
                        {...register("status")}
                        className="w-full rounded-lg border p-2.5 bg-background font-medium text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="draft">Draft (Hidden from Public)</option>
                        <option value="published">Published (Live on Public Site)</option>
                    </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                        type="checkbox"
                        {...register("is_featured")}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-sm font-medium">Mark as Featured Article</span>
                </label>
            </CardContent>
        </Card>
    );
}