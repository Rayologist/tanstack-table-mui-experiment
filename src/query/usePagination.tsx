import useSWR from "swr";
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

export function usePagination(page: {
  pageIndex: number;
  pageSize: number;
  filter: string | null;
  // sort: {
  //   fields: {name: string, order: "asc" | "desc"}[];
  // }
}) {
  const { pageSize, pageIndex, filter } = page;
  let total = -1;

  const url = new URL("http://localhost:3001/users");
  const params = new URLSearchParams();

  params.append("_page", String(pageIndex + 1));
  params.append("_limit", String(pageSize));

  if (filter) {
    params.append("q", filter);
  }

  url.search = params.toString();

  const { data, error, mutate } = useSWR<{
    user: FakeUser[];
    meta: { total: number };
  }>(url.href, async (url) => {
    const resp = await fetch(url);
    total = Number(resp.headers.get("x-total-count"));
    const data = await resp.json();
    return { user: data, meta: { total } };
  });

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
