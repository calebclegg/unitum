import EventIcon from "@mui/icons-material/Event";
import { Container } from "@mui/material";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { ICommunity, useData, useUser } from "../hooks";
import JoinRequest from "./JoinRequest";

const AboutCommunity = () => {
  const { comm_id } = useParams<{ comm_id: string }>();
  const { data: community } = useData<ICommunity>(`community/${comm_id}`);
  const { user } = useUser();

  return (
    <Container maxWidth="sm" disableGutters={true}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        About Community
      </Typography>
      <Typography
        color="textSecondary"
        component="h2"
        fontSize={14}
        maxWidth={300}
      >
        {community?.description}
      </Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "5px",
          marginBottom: 0
        }}
      >
        <div>
          <Typography variant="h6" component="p" lineHeight={1}>
            {community && community.numberOfMembers > 980
              ? ((community?.numberOfMembers || 0) / 1000).toFixed(1)
              : community?.numberOfMembers || 0}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Members
          </Typography>
        </div>
        <div>
          <Typography variant="h6" component="p" lineHeight={1}>
            {community && community?.postCount > 980
              ? ((community?.postCount || 0) / 1000).toFixed(1)
              : community?.postCount || 0}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Posts
          </Typography>
        </div>
      </div>
      <Divider sx={{ my: 2 }} />
      {community?.createdAt && (
        <Stack direction="row" spacing={2}>
          <EventIcon />
          <Typography>
            Created {new Date(community.createdAt).toDateString()}
          </Typography>
        </Stack>
      )}
      <Divider sx={{ my: 2 }} />
      {user?._id === community?.admin._id && <JoinRequest />}
    </Container>
  );
};

export default AboutCommunity;
