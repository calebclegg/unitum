import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { ICommunity, useData } from "../hooks";

const AboutCommunity = () => {
  const { comm_id } = useParams<{ comm_id: string }>();
  const { data: community } = useData<ICommunity>(`community/${comm_id}`);

  return (
    <>
      <Typography variant="h5" component="h2">
        About Community
      </Typography>
      <Typography color="textSecondary" component="h2">
        {community?.description}
      </Typography>
    </>
  );
};

export default AboutCommunity;
