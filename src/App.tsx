import Table from "./components/Table";
import { PaginationState, createColumnHelper } from "@tanstack/react-table";
import { faker } from "@faker-js/faker";
import format from "date-fns/format";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { usePagination } from "./query/usePagination";
import { useSearchParams } from "react-router-dom";

type FakeUser = {
  id: number;
  firstName: string;
  lastName: string;
  sex: string;
  email: string;
  music: string;
  createdAt: Date;
  updatedAt: Date;
};

function createFakeUser(id: number): FakeUser {
  const createdAt = faker.date.past(
    5,
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 2)
  );
  const updatedAt = faker.date.future(2, createdAt);
  return {
    id: id + 1,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    sex: faker.name.sex(),
    email: faker.internet.email(),
    music: faker.music.genre(),
    createdAt,
    updatedAt,
  };
}

const columnHelper = createColumnHelper<FakeUser>();

const columns = [
  columnHelper.accessor((row) => row.id.toString(), {
    header: "Id",
    maxSize: 100,
  }),
  columnHelper.accessor("firstName", {
    header: "First Name",
    minSize: 170,
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
    minSize: 170,
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    header: "Full Name",
    minSize: 200,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (props) => (
      <Typography sx={{ wordWrap: "break-word" }}>
        {props.getValue()}
      </Typography>
    ),
    minSize: 200,
  }),
  columnHelper.accessor("sex", {
    header: "Sex",
    filterFn: "equalsString",
    minSize: 150,
    // meta: {
    //   filterInput: {
    //     type: "select",
    //     selectData(facetedUniqueValue) {
    //       return Array.from(facetedUniqueValue).map((val) => {
    //         const [value] = val;
    //         const mapping: { [key: string]: string } = {
    //           male: "M",
    //           female: "F",
    //         };
    //         let label: string;
    //         if (value in mapping) {
    //           label = mapping[String(value)];
    //         } else {
    //           label = String(value);
    //         }
    //         return { label, value };
    //       });
    //     },
    //     props: {
    //       clearable: true,
    //     },
    //   },
    // },
  }),
  columnHelper.accessor("music", {
    header: "Music Genre",
    minSize: 200,
    filterFn: "arrIncludesSome",
    // meta: {
    //   filterInput: {
    //     type: "multi-select",
    //     selectData(facetedUniqueValue) {
    //       return Array.from(facetedUniqueValue).map((val) => {
    //         const [value] = val;
    //         return { label: String(value), value };
    //       });
    //     },
    //     props: {
    //       clearable: true,
    //       searchable: true,
    //     },
    //   },
    // },
  }),
  columnHelper.accessor(
    (row) => format(new Date(row.createdAt), "yyyy-MM-dd HH:mm:ss"),
    {
      header: "Creation Time",
      minSize: 200,
      // filterFn: "inDateRange",
      // meta: {
      //   filterInput: {
      //     type: "date",
      //     props: {
      //       clearable: true,
      //       defaultLevel: "year",
      //     },
      //   },
      // },
    }
  ),
  columnHelper.accessor(
    (row) => format(new Date(row.updatedAt), "yyyy-MM-dd HH:mm:ss"),
    {
      header: "Last Updated",
      minSize: 200,
    }
  ),
];
function App() {
  // const [data, setData] = useState<FakeUser[]>();
  const [searchParams, setSearchParam] = useSearchParams();
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const q = params.get("q");
    setFilter(q);
  }, [searchParams.toString()]);

  const [{ pageIndex, pageSize }, setPage] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const page = useMemo(
    () => ({ pageIndex, pageSize, filter }),
    [pageIndex, pageSize, filter]
  );
  const { data, isError, isLoading } = usePagination(page);
  const defaultData = useMemo(() => [], []);
  if (isLoading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || isError) {
    return (
      <Box sx={{ display: "flex" }}>
        <Typography>Something went wrong...</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Paper sx={{ padding: "1rem" }}>
        <Table
          data={data.user ?? defaultData}
          columns={columns}
          pagination={{
            rowsPerPageOptions: [5, 10, 20],
            rowCount: data.meta.total,
            pageSize: page.pageSize,
            pageIndex: page.pageIndex,
            onChange: setPage,
          }}
          globalFilter={{
            onChange: (value) => {
              const params = new URLSearchParams(searchParams);
              params.set("q", value);

              setSearchParam(params);

              setFilter(value);
            },
          }}
        />
      </Paper>
    </Container>
  );
}

export default App;
