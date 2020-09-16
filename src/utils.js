import axios from "axios";

let api = axios.create({
  baseURL: "http:///hair-salons.local/",
  responseType: "json"
});
export {api};
