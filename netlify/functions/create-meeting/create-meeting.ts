import { Handler } from "@netlify/functions";
import axios from "axios";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
const USER_ID = process.env.USER_OBJECT_ID;

interface MeetingResponse {
  joinUrl: string;
  subject: string;
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const meetingSubject = event.queryStringParameters
    ? event.queryStringParameters.subject
    : `Automated Meeting from ${new Date().toISOString()}`;

  try {
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "https://graph.microsoft.com/.default",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const meetingResponse = await axios.post<MeetingResponse>(
      `https://graph.microsoft.com/v1.0/users/${USER_ID}/onlineMeetings`,
      {
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        subject: meetingSubject,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(meetingResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({
        joinUrl: meetingResponse.data.joinUrl,
        subject: meetingResponse.data.subject,
      }),
    };
  } catch (error) {
    console.error("Error:", error.response.data.error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

export { handler };
