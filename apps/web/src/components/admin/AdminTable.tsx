"use client";

import React from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@blih/ui";

export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey: (row: T) => string;
  sortKey?: string | null;
  sortDir?: SortDirection;
  onSort?: (key: string) => void;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptySubtext?: string;
  skeletonRows?: number;
}

function SortIcon({
  columnKey,
  sortKey,
  sortDir,
}: {
  columnKey: string;
  sortKey?: string | null;
  sortDir?: SortDirection;
}) {
  if (sortKey !== columnKey) return <ChevronsUpDown className="h-3.5 w-3.5 text-[#D9CEDF]" />;
  if (sortDir === "asc") return <ChevronUp className="h-3.5 w-3.5 text-[#1E5BFF]" />;
  return <ChevronDown className="h-3.5 w-3.5 text-[#1E5BFF]" />;
}

export function AdminTable<T>({
  columns,
  data,
  loading,
  rowKey,
  sortKey,
  sortDir,
  onSort,
  emptyIcon,
  emptyTitle = "No records found",
  emptySubtext = "There is no data to display.",
  skeletonRows = 8,
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white border border-[#D9CEDF] rounded-xl overflow-hidden shadow-sm">
        <style>{`
          @keyframes adminTableRowFadeIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-admin-table-row {
            animation: adminTableRowFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        `}</style>
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F8FC] border-b border-[#D9CEDF]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left font-mono text-xs text-[#6E6678] uppercase tracking-wide"
                    style={{ width: col.width }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9CEDF]/50">
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <tr
                  key={i}
                  className="animate-admin-table-row"
                  style={{ animationDelay: `${Math.min(i * 35, 450)}ms` }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <Skeleton
                        variant="rectangular"
                        className="h-4 rounded"
                        style={{ width: col.width ? "60%" : "80%" }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="border-2 border-dashed border-[#D9CEDF] rounded-xl p-12 text-center bg-white space-y-3">
        {emptyIcon && (
          <div className="w-10 h-10 rounded-xl bg-white border border-[#D9CEDF] text-[#17131F] flex items-center justify-center mx-auto shadow-xs">
            {emptyIcon}
          </div>
        )}
        <h3 className="font-display font-bold text-lg text-[#17131F]">{emptyTitle}</h3>
        <p className="text-sm text-[#6E6678] max-w-sm mx-auto">{emptySubtext}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-xl overflow-hidden shadow-sm">
      <style>{`
        @keyframes adminTableRowFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-admin-table-row {
          animation: adminTableRowFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F9F8FC] border-b border-[#D9CEDF]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-mono text-xs text-[#6E6678] uppercase tracking-wide whitespace-nowrap ${col.sortable && onSort ? "cursor-pointer select-none hover:text-[#17131F] transition-colors" : ""}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <SortIcon columnKey={col.key} sortKey={sortKey} sortDir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9CEDF]/40">
            {data.map((row, idx) => (
              <tr
                key={rowKey(row)}
                className="animate-admin-table-row hover:bg-[#F9F8FC]/60 transition-colors"
                style={{
                  animationDelay: `${Math.min(idx * 35, 450)}ms`,
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3.5 text-[#17131F] align-middle"
                    style={{ width: col.width }}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
