import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // 로그인 쿠키 같이 보내기
});

export default api;