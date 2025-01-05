export type TableColumns = { header: string; accessor: string | "actions" }[];
export type TableData<T extends Record<string, any>> = T[];

type TableProps<T extends Record<string, any>> = {
  columns: TableColumns;
  data: TableData<T>;
  renderActions?: (row: T) => React.ReactNode;
};

export function Table<T extends Record<string, any>>(props: TableProps<T>) {
  const { columns, data, renderActions } = props;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="text-left">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-gray-50">
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`whitespace-nowrap px-4 py-2 font-medium ${
                    colIndex === 0 ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {col.accessor === "actions" && renderActions
                    ? renderActions(row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
