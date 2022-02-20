import useSWR from "swr";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { content, resultTypes } from "../components/Search/Result";
import { fetcher } from "../utils";
import { useAuth } from "../context/Auth";
import Empty from "../components/Search/Empty";
import Failure from "../components/Search/Failure";
import Tag from "../components/Tag";
import RenderResult from "../components/Search/RenderResult";

const Search = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<string[]>([]);
  const query = useMemo(() => searchParams.get("keyword"), [searchParams]);
  const result = useMemo(
    () =>
      query ? content.replaceAll(query, `<mark>${query}</mark>`) : content,
    [query]
  );

  const {
    data: searchResults,
    error,
    isValidating
  } = useSWR(
    query ? ["search?" + searchParams.toString(), token] : null,
    fetcher,
    {
      shouldRetryOnError: false
    }
  );

  useEffect(() => {
    const params = new URLSearchParams();
    query && params.set("keyword", query);

    filters.forEach((type) => {
      params.set(type, "1");
    });

    setSearchParams(params.toString(), { replace: true });
  }, [filters, query]);

  const toggleFilter = (event: React.MouseEvent<HTMLDivElement>) => {
    const filter = event.currentTarget.textContent;

    filter &&
      setFilters((prevFilters) => {
        const newFilters = prevFilters.filter((f) => f !== filter);

        return newFilters.length === prevFilters.length
          ? [...prevFilters, filter]
          : newFilters;
      });
  };

  return (
    <>
      <Stack direction="row" justifyContent="center" spacing={1.5}>
        {resultTypes.map(({ type, color }) => (
          <Chip
            key={type}
            label={type}
            color={color}
            variant={filters.includes(type) ? "filled" : "outlined"}
            onClick={toggleFilter}
            sx={{
              height: 25,
              borderRadius: 0.5
            }}
          />
        ))}
      </Stack>
      <Collapse in={isValidating}>
        <LinearProgress sx={{ my: 1.5 }} />
      </Collapse>
      <Empty hasInput={!!query} />
      <Failure
        errorMessage={error?.message}
        errorStatus={error?.response.status}
      />
      {query && !error ? (
        <List role="listbox">
          {searchResults?.map((result: any) => (
            <RenderResult key={result._id} result={result} query={query} />
          ))}
        </List>
      ) : null}
    </>
  );
};

export default Search;
