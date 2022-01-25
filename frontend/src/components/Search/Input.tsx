import ClickAwayListener from "@mui/base/ClickAwayListener";
import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "../../lib";

const Result = lazy(() => import("./Result"));

const Search = () => {
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleFocus = () => setAnchorEl(inputRef.current);
  const handleBlur = () => setAnchorEl(null);

  const checkActiveElement = (e: Event) => {
    if (e.target) {
      const allChildren = document.querySelectorAll("#search-container *");
      if (!Array.from(allChildren).includes(e.target as Element)) handleBlur();
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
            ref={inputRef}
            id="search-combo-box"
            type="search"
            onFocus={handleFocus}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            }
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
            <Result anchorEl={anchorEl} />
          </Suspense>
        </div>
      </ClickAwayListener>
    </ThemeProvider>
  );
};

export default Search;
