import axios, { AxiosHeaders } from "axios";

const getAxiosInstance = (headers?: AxiosHeaders) =>
  axios.create({
    baseURL: "https://mystoryknight-be-zo5r7or52q-an.a.run.app/api",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

export default getAxiosInstance;
