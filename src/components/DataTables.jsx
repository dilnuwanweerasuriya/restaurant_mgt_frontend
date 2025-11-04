import React from "react";

export default function DataTable({ columns, data, keyField = "_id" }) {
    return (
        <div className="overflow-x-auto bg-zinc-800 rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-zinc-700">
                <thead className="bg-zinc-800">
                    <tr className="divide-x divide-zinc-700">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-6 py-3 text-center text-xs font-medium text-zinc-300 uppercase tracking-wider"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-zinc-900 divide-y divide-zinc-700">
                    {data.map((row) => (
                        <tr
                            key={row[keyField]}
                            className="divide-x divide-zinc-700 hover:bg-zinc-800 transition-colors"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-zinc-100 text-center"
                                >
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
