import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useData } from "../hooks";
import { useParams } from "react-router-dom";
import { Avatar, Button, Card, CardHeader } from "@mui/material";
import { useState } from "react";
import { API } from "../lib";
import { useAuth } from "../context/Auth";

interface Requests {
  _id: string;
  user: {
    _id: string;
    profile: {
      fullName: string;
      picture: string;
    };
  };
}
export default function JoinRequest() {
  const { comm_id } = useParams<{ comm_id: string }>();
  const { token } = useAuth();
  const { data } = useData<Requests[]>(`/community/${comm_id}/requests`);
  const [requests, setRequests] = useState(data);

  const acceptRequest = async (
    // event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    await API.post<Record<string, string>>(
      `/community/${comm_id}/add?action=accept`,
      {
        requestID: id
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
  };
  return (
    <div style={{ width: "300px" }}>
      <Accordion sx={{ pt: 0, pb: 0, pl: 0, pr: 0 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Join Requests ({data?.length || 0})</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 0, pl: 0, pr: 0 }}>
          {data?.map((data) => (
            <Card
              sx={{ maxWidth: 300, pt: 0, pb: 0, pl: 0, pr: 0 }}
              key={data._id}
            >
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="recipe"
                    alt={data.user.profile.fullName}
                    src={data.user.profile.picture}
                  />
                }
                title={`${data.user.profile.fullName}`}
                subheader={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <Button
                      size="small"
                      onClick={() => {
                        acceptRequest(data._id);
                      }}
                    >
                      Accept
                    </Button>
                    <Button size="small" color="error">
                      Reject
                    </Button>
                  </div>
                }
              />
            </Card>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
