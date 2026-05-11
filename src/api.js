import axios from "axios";

const API = axios.create({
  baseURL: "https://unikartweb-production.up.railway.app",
});

export default API;
