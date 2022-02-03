import { useLocation, useNavigate } from "react-router-dom";
import { getUrl } from "../utils";

export const useOpenWithHash = (section: string) => {
  const { hash, pathname } = useLocation();
  const open = hash === section || pathname === section;
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(getUrl().replace(hash, ""));
  };

  return { open, handleClose };
};
