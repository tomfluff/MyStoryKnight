import axios, { AxiosHeaders } from "axios";

const getAxiosInstance = (headers?: AxiosHeaders) =>
  axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

export default getAxiosInstance;
