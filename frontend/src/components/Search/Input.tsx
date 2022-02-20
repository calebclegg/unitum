import ClickAwayListener from "@mui/base/ClickAwayListener";
import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { debounce } from "@mui/material/utils";
import { ThemeProvider } from "@mui/material/styles";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { lightTheme } from "../../lib";
import { fetcher } from "../../utils";

const Result = lazy(() => import("./Result"));

const Search = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");

  const handleFocus = () => setAnchorEl(searchRef.current);
  const handleBlur = () => setAnchorEl(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const checkActiveElement = (event: Event) => {
    if (event.target) {
      const allChildren = document.querySelectorAll("#search-container *");
      if (!Array.from(allChildren).includes(event.target as Element))
        handleBlur();
    }
  };

  useEffect(() => {
    if (anchorEl) {
      document.addEventListener("focus", checkActiveElement, true);
    } else {
      document.removeEventListener("focus", checkActiveElement, true);
    }

    return () =>
      document.removeEventListener("focus", checkActiveElement, true);
  }, [anchorEl]);

  return (
    <ThemeProvider theme={lightTheme}>
      <ClickAwayListener onClickAway={handleBlur}>
        <div id="search-container">
          <OutlinedInput
            ref={searchRef}
            id="search-combo-box"
            type="search"
            onFocus={handleFocus}
            onChange={debounce(handleChange, 600)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            }
            autoComplete="off"
            inputProps={{
              role: "combobox",
              placeholder: "Search for posts, users and communities",
              "aria-owns": "search-result",
              "aria-label": "Search for posts, users and communities",
              "aria-expanded": Boolean(anchorEl)
            }}
            sx={{
              width: anchorEl ? 400 : 300,
              bgcolor: anchorEl ? "#fffa" : "#fff5",
              transition: ({ transitions }) =>
                transitions.create(["background-color", "width"], {
                  easing: transitions.easing.easeOut,
                  duration: transitions.duration.short
                }),
              "& .MuiOutlinedInput-input": {
                py: 1,
                color: ({ palette }) => palette.grey[800]
              }
            }}
          />
          <Suspense fallback={<div />}>
            <Result anchorEl={anchorEl} query={query} />
          </Suspense>
        </div>
      </ClickAwayListener>
    </ThemeProvider>
  );
};

export default Search;
