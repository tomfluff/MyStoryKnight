/*
 * This hook is used to make API requests using Axios.
 * It returns the data, error, loading and fetch function.
 * The fetch function is used to make the API request.
 * The data is the response from the API.
 * The error is the error from the API.
 * The loading is a boolean to indicate if the request is in progress.
 *
 * @example
 * const instance = axiosInstance();
 * const { data, error, loading, fetch } = useAxios();
 * fetch({ url: "/users", method: "get", instance });
 *
 */
import { useEffect, useState } from "react";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface IAxiosConfig {
  instance: AxiosInstance;
  url: string;
  method: "get" | "post" | "put" | "delete";
  requestConfig?: AxiosRequestConfig;
}

const useAxios = <T>() => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState<AbortController>();

  const axiosFetch = async (config: IAxiosConfig) => {
    const { url, method, instance, requestConfig } = config;
    try {
      setLoading(true);
      const ctrl = new AbortController();

      setController(ctrl);
      setError(undefined);
      setData(undefined);
      const response = await instance({
        url,
        method,
        ...requestConfig,
        signal: ctrl.signal,
      });
      setData(response.data);
      return response.data;
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => controller?.abort();
  }, [controller]);

  return { data, error, loading, axiosFetch };
};

export const axiosInstance = (headers?: any) =>
  axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

export default useAxios;
