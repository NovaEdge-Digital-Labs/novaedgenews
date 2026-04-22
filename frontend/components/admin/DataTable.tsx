"use client";
import React from 'react';

export function DataTable({ columns, data, title }: { columns: any[], data: any[], title: string }) {
    return (
        <div className="premium-glass p-6 rounded-2xl flex flex-col gap-6 overflow-hidden">
            <h3 className="text-lg font-bold">{title}</h3>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            {columns.map((col, i) => (
                                <th key={i} className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                {columns.map((col, j) => (
                                    <td key={j} className="py-4 px-4 text-sm font-medium text-foreground">
                                        {col.cell ? col.cell(row) : row[col.accessorKey]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
