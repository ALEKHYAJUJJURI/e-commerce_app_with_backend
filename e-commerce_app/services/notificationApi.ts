import { API_BASE_URL } from "@/src/types/constants";
import axios from "axios";
// import { API_BASE_URL } from "../config/api";

export const sendNotification = async ({
  token,
  title,
  body,
  data = {},
}: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/notifications/send`,
    {
      token,
      title,
      body,
      data,
    }
  );

  return response.data;
};