"use client";

import { ReactNode } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export interface Column<T> {
    key: keyof T | string;
    title: string;
    width?: string;
    className?: string;

    render?: (
        value: any,
        row: T,
        index: number
    ) => ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];

    loading?: boolean;

    emptyMessage?: string;

    rowKey?: keyof T;
}

export default function DataTable<
    T extends Record<string, any>
>({
    columns,
    data,
    loading = false,
    emptyMessage = "No data found.",
    rowKey = "id" as keyof T,
}: Readonly<DataTableProps<T>>) {

    if (loading) {

        return (

            <div className="py-10 text-center text-muted-foreground">

                Loading...

            </div>

        );

    }

    return (

        <div className="overflow-x-auto">

            <Table className="min-w-full divide-y divide-gray-200">

                <TableHeader className="bg-muted/50">

                    <TableRow className="transition-colors hover:bg-muted/40">

                        {columns.map((column) => (

                            <TableHead
                                key={String(column.key)}
                                style={{
                                    width: column.width,
                                }}
                                className={
                                    column.className
                                }
                            >

                                {column.title}

                            </TableHead>

                        ))}

                    </TableRow>

                </TableHeader>

                <TableBody>
                    
                    {data.length === 0 && (

                        <TableRow className="transition-colors hover:bg-muted/40">

                            <TableCell
                                colSpan={
                                    columns.length
                                }
                                className="h-32 text-center text-muted-foreground"
                            >

                                {emptyMessage}

                            </TableCell>

                        </TableRow>

                    )}

                    {data.map(
                        (row, index) => (

                            <TableRow
                                key={String(
                                    row[rowKey]
                                )}
                                 className={
                                    index % 2 === 0
                                        ? "bg-background hover:bg-muted/40"
                                        : "bg-muted/20 hover:bg-muted/40"
                                 }
                        
                            >

                                {columns.map(
                                    (
                                        column
                                    ) => {

                                        const value =
                                            row[
                                                column.key as keyof T
                                            ];

                                        return (

                                            <TableCell
                                                key={String(
                                                    column.key
                                                )}
                                                className="py-4"
                                                
                                            >

                                                {column.render
                                                    ? column.render(
                                                          value,
                                                          row,
                                                          index
                                                      )
                                                    : value}

                                            </TableCell>

                                        );

                                    }
                                )}

                            </TableRow>

                        )
                    )}

                </TableBody>

            </Table>

        </div>

    );

}