import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteCategory } from "@/api/category";

export function useDeleteCategory() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: deleteCategory,

        onSuccess() {

            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            toast.success("Category deleted.");

        },

        onError(error: any) {

            toast.error(error.message);

        },

    });

}