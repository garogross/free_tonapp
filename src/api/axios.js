import { retrieveRawInitData } from "@telegram-apps/sdk";
import axios from "axios";

const initData = import.meta.env.DEV
  ? import.meta.env.VITE_API_TEST_INIT_DATA
  : retrieveRawInitData();

export const api = axios.create({
  baseURL: import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : "",
  headers: {
    "Content-Type": "application/json",
    Authorization: "tma " + initData,
  },
});
