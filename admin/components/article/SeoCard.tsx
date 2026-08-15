"use client";

import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SeoCardProps {
    onSeoDescManualEdit?: () => void;
    onSeoTitleManualEdit?: () => void;
}

export default function SeoCard({ onSeoDescManualEdit, onSeoTitleManualEdit }: Readonly<SeoCardProps> = {}) {

    const { register, formState: { errors } } = useFormContext();

    return (

        <Card>
            <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

                <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                        id="seo_title"
                        placeholder="Article Title | TechWebCode"
                        {...register("seo_title", {
                            onChange: () => onSeoTitleManualEdit?.(),
                        })}
                    />
                    {errors.seo_title && (
                        <p className="text-xs text-destructive">{String(errors.seo_title.message)}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                        id="seo_description"
                        rows={4}
                        placeholder="Search engine meta description (recommended max 160 characters)..."
                        {...register("seo_description", {
                            onChange: () => onSeoDescManualEdit?.(),
                        })}
                    />
                    {errors.seo_description && (
                        <p className="text-xs text-destructive">{String(errors.seo_description.message)}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="canonical_url">Canonical URL</Label>
                    <Input
                        id="canonical_url"
                        placeholder="https://techwebcode.in/articles/your-slug"
                        {...register("canonical_url")}
                    />
                    {errors.canonical_url && (
                        <p className="text-xs text-destructive">{String(errors.canonical_url.message)}</p>
                    )}
                </div>

            </CardContent>

        </Card>

    );
}