import * as React from "react"
import {
  type ColumnDef,
  type Row,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type UniqueIdentifier } from "@dnd-kit/core"
import { GripVertical } from "lucide-react"

import { cn } from "@packages/ui/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packages/ui/components/table"

// ── Drag handle column helper ──────────────────────────────────────────

function DragHandle({ rowId }: { rowId: string }) {
  const { attributes, listeners } = useSortable({ id: rowId })
  return (
    <button
      type="button"
      className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  )
}

function createDragHandleColumn<TData>(): ColumnDef<TData> {
  return {
    id: "drag-handle",
    header: () => null,
    cell: ({ row }) => <DragHandle rowId={row.id} />,
    size: 40,
    enableSorting: false,
    enableHiding: false,
  }
}

// ── Sortable row ───────────────────────────────────────────────────────

function SortableRow<TData>({ row }: { row: Row<TData> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() ? "selected" : undefined}
      className={cn(isDragging && "opacity-50")}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// ── DataTable component ────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  getRowId: (row: TData) => string
  onReorder?: (data: TData[]) => void
  tableOptions?: Partial<Omit<TableOptions<TData>, "data" | "columns" | "getCoreRowModel" | "getRowId">>
  noResultsMessage?: string
}

function DataTable<TData, TValue>({
  columns: userColumns,
  data,
  getRowId,
  onReorder,
  tableOptions,
  noResultsMessage = "No results.",
}: DataTableProps<TData, TValue>) {
  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(
    () =>
      onReorder
        ? [createDragHandleColumn<TData>() as ColumnDef<TData, TValue>, ...userColumns]
        : userColumns,
    [userColumns, onReorder],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    ...tableOptions,
  })

  const rowIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map((row) => getRowId(row)),
    [data, getRowId],
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id && onReorder) {
      const oldIndex = rowIds.indexOf(active.id)
      const newIndex = rowIds.indexOf(over.id)
      onReorder(arrayMove([...data], oldIndex, newIndex))
    }
  }

  const tableContent = (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          onReorder ? (
            <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
              {table.getRowModel().rows.map((row) => (
                <SortableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {noResultsMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  if (!onReorder) return tableContent

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      {tableContent}
    </DndContext>
  )
}

export { DataTable, createDragHandleColumn, type DataTableProps }
