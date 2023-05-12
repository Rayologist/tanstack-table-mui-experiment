import { useMemo, useState, useRef, memo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  RowData,
  ColumnFiltersState,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";

import {
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableProps as MuiTableProps,
  Stack,
  Typography,
  Divider,
  Box,
  IconButton,
  TablePaginationProps,
  TablePagination,
} from "@mui/material";

// import useStyles from "./styles";
import SortingIcon from "./components/SortingIcon";
import GlobalFilter from "./components/GlobalFilter";
import ColumnToggle from "./components/ColumnToggle";
// import ColumnFilter from "./components/ColumnFilter";
// import { inDateRange } from "./components/ColumnFilter/FilterFn";

type TableProps<T extends RowData> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  pagination?: {
    onChange: (state: PaginationState) => void;
    pageIndex: number;
    pageSize: number;
    rowCount?: number;
    rowsPerPageOptions?: number[];
  };
  globalFilter?: { onChange?: (value: string) => void };
  height?: string | number;
} & MuiTableProps;

function Table<T extends RowData>(props: TableProps<T>) {
  const {
    data,
    columns,
    height,
    pagination: paginator,
    globalFilter: globalFilterer,
    ...muiTableProps
  } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchRegex, setSearchRegex] = useState<RegExp>();
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: paginator?.pageIndex ?? 0,
    pageSize: paginator?.pageSize ?? 20,
  });
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  //   const { classes, cx } = useStyles();
  const col = useMemo(() => columns, [columns]);
  const table = useReactTable<T>({
    data,
    columns: col,
    // filterFns: {
    //   inDateRange,
    // },
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      // columnFilters,
      pagination,
    },
    pageCount: paginator?.rowCount ?? -1,
    columnResizeMode: "onChange",
    globalFilterFn: (row, columnId, filterValue: string) => {
      let value: any = row.getValue(columnId);
      if (typeof value === "number") {
        value = String(value);
      }

      if (searchRegex) {
        return searchRegex.test(value);
      }

      return value?.toLowerCase().includes(filterValue.toLowerCase());
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    manualPagination: true,
    onPaginationChange: setPagination,
    // getPaginationRowModel: getPaginationRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    count: rows.length,
  });

  const { getTotalSize, getVirtualItems } = virtualizer;

  const virtualRows = getVirtualItems();
  const totalSize = getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  const TH = memo(() => (
    <TableHead>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const isResizing = header.column.getIsResizing();
            return (
              <TableCell key={header.id} style={{ width: header.getSize() }}>
                <Stack direction="row">
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography sx={{ fontWeight: 500 }}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Typography>
                      {header.column.getCanSort() && (
                        <IconButton
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <SortingIcon
                            sorted={header.column.getIsSorted()}
                            canSort={header.column.getCanSort()}
                            fontSize="small"
                          />
                        </IconButton>
                      )}
                    </Stack>
                  </Box>
                  {/* {header.column.getCanFilter() && (
                    <ColumnFilter column={header.column} />
                  )} */}

                  {header.column.getCanResize() && (
                    <Divider
                      flexItem
                      orientation="vertical"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      sx={{
                        userSelect: "none",
                        touchAction: "none",
                        cursor: "col-resize",
                        marginRight: "-3px",
                        borderLeftStyle: "solid",
                        borderLeftWidth: "3px",
                        borderRadius: "3px",
                        borderColor: isResizing ? "#2979ff" : undefined,
                        "&:hover": {
                          borderColor: "#2979ff",
                        },
                      }}
                    />
                  )}
                </Stack>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableHead>
  ));

  const TB = memo(() => (
    <TableBody>
      {table.getRowModel().rows.length > 0 ? (
        <>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <TableRow
                hover
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <Typography noWrap>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            );
          })}

          {paddingBottom > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingBottom}px` }} />
            </TableRow>
          )}
        </>
      ) : (
        <TableRow>
          <TableCell colSpan={table.getVisibleLeafColumns().length}>
            <Typography align="center" sx={{ fontWeight: 500 }}>
              Nothing found
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  ));

  return (
    <>
      <Stack
        direction="row"
        sx={{ display: "flex", alignItems: "center" }}
        mb="md"
      >
        <GlobalFilter
          value={globalFilter ?? ""}
          onChange={(e) => {
            const { value } = e.target;
            // if value is a regex, set it as the search regex
            const regex = /\/(.*?)\/(.*)?/;
            if (regex.test(value)) {
              const result = value.match(regex);
              if (result && result[1] !== "") {
                const flags = result[2] || undefined;
                const searchRegExp = new RegExp(result[1], flags);
                setSearchRegex(searchRegExp);
                setGlobalFilter(value);
                return null;
              }
            }

            if (searchRegex) setSearchRegex(undefined);
            setGlobalFilter(value);
            globalFilterer?.onChange?.(value);
            return null;
          }}
          sx={{ flexGrow: 1 }}
        />

        <ColumnToggle<T>
          getIsAllColumnsVisible={table.getIsAllColumnsVisible}
          getIsSomeColumnsVisible={table.getIsSomeColumnsVisible}
          getAllLeafColumns={table.getAllLeafColumns}
          toggleAllColumnsVisible={table.toggleAllColumnsVisible}
        />
      </Stack>
      <TableContainer
        sx={{ maxHeight: 500, width: "100%" }}
        component={Box}
        ref={tableContainerRef}
      >
        <MuiTable
          stickyHeader
          sx={{
            borderCollapse: "separate",
            tableLayout: "fixed",
          }}
          {...muiTableProps}
        >
          <TH />
          <TB />
        </MuiTable>
      </TableContainer>
      <TablePagination
        component="div"
        count={table.getPageCount()}
        rowsPerPageOptions={paginator?.rowsPerPageOptions}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={async (_, page) => {
          paginator?.onChange?.({
            pageIndex: page,
            pageSize: table.getState().pagination.pageSize,
          });
          table.setPageIndex(page);
        }}
        onRowsPerPageChange={async (e) => {
          paginator?.onChange?.({
            pageIndex: table.getState().pagination.pageIndex,
            pageSize: Number(e.target.value),
          });
          table.setPageSize(Number(e.target.value));
        }}
        showFirstButton
        showLastButton
      />
    </>
  );
}

export default Table;
