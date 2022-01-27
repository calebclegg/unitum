import Add from "@mui/icons-material/Add";
import Feed from "@mui/icons-material/Feed";
import Group from "@mui/icons-material/Group";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import Search from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  {
    path: "/feed",
    label: "Feed",
    icon: <Feed />
  },
  {
    path: "/search",
    label: "Search",
    icon: <Search />
  },
  {
    path: "/chat",
    label: "Chat",
    icon: <QuestionAnswer />
  },
  {
    path: "/communities",
    label: "Comm",
    icon: <Group />
  }
];

const BottomNav = () => {
  const scrollPosition = useRef(0);
  const [current, setCurrent] = useState(0);
  const [scrollingDown, setScrollingDown] = useState(false);
  const smallMobile = useMediaQuery("@media (max-width: 389.99px)");
  const largeMobile = useMediaQuery(
    ({ breakpoints }: Theme) =>
      `@media (min-width: 390px) and ${breakpoints
        .down("sm")
        .replace("@media ", "")}`
  );

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: number
  ) => {
    setCurrent(value);
  };

  const handleScroll = () => {
    setScrollingDown(window.scrollY > scrollPosition.current);
    scrollPosition.current = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      position="fixed"
      bottom={0}
      width="100%"
      sx={{
        transition: ({ transitions }) =>
          transitions.create("transform", {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard
          }),
        transform: scrollingDown
          ? `translateY(${largeMobile ? "100%" : "50%"})`
          : "none"
      }}
    >
      {smallMobile && (
        <Stack mb={1.5} mr={1.5} direction="row" justifyContent="flex-end">
          <Fab color="primary" variant="extended" sx={{ borderRadius: 2 }}>
            <Add sx={{ mr: 1 }} />
            Create Post
          </Fab>
        </Stack>
      )}
      <BottomNavigation
        showLabels
        value={current}
        onChange={handleChange}
        sx={{
          borderTop: "2px solid",
          borderColor: "divider"
        }}
      >
        {navLinks.map(({ path, icon, label }) => (
          <BottomNavigationAction key={path} label={label} icon={icon} />
        ))}
        {largeMobile && (
          <Box
            px={1}
            sx={{
              transform: scrollingDown ? "translateY(-80%)" : "none",
              transition: ({ transitions }) =>
                transitions.create("transform", {
                  easing: transitions.easing.easeInOut,
                  duration: transitions.duration.standard
                })
            }}
          >
            <Fab
              color="primary"
              sx={{ transform: "scale(1.2) translate(-18%, -50%)" }}
            >
              <Add />
            </Fab>
          </Box>
        )}
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;