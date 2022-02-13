import EventIcon from "@mui/icons-material/Event";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { ICommunity, useData } from "../hooks";

const AboutCommunity = () => {
  const { comm_id } = useParams<{ comm_id: string }>();
  const { data: community } = useData<ICommunity>(`community/${comm_id}`);

  return (
    <>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        About Community
      </Typography>
      <Typography color="textSecondary" component="h2" maxWidth={300}>
        {community?.description}
      </Typography>
      <Typography
        variant="h6"
        component="p"
        lineHeight={1}
        sx={{ mt: 2, mb: 0 }}
      >
        {community && community.numberOfMembers > 980
          ? ((community?.numberOfMembers || 0) / 1000).toFixed(1)
          : community?.numberOfMembers || 0}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Members
      </Typography>
      <Divider sx={{ my: 2 }} />
      {community?.createdAt && (
        <Stack direction="row" spacing={2}>
          <EventIcon />
          <Typography>
            Created {new Date(community.createdAt).toDateString()}
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default AboutCommunity;
