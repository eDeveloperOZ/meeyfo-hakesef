import type { ReactNode } from "react";

export function ChartDataTable({
  label,
  caption,
  columns,
  rows,
}: {
  label?: string;
  caption: string;
  columns: string[];
  rows: { key: string; cells: ReactNode[] }[];
}) {
  const table = (
    <div className="table-scroll">
      <table className="chart-data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={index}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!label) return table;
  return (
    <details className="chart-table-disclosure">
      <summary>{label}</summary>
      {table}
    </details>
  );
}
