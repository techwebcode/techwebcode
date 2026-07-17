import { z } from "zod";

export const TagSchema = z.object({

    name:z.string().trim().min(3),
    slug: z.string().trim().min(3).optional(),    
    description:z.string().trim().max(200),
    status:z.boolean(),
    sort_order:z.number().int().min(0),

});