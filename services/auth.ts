import axios from "axios";
import { useEffect, useState } from "react";

const _clientId = process.env.CLIENT_ID;
const _baseUrl = process.env.BASE_URL;
export const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${_clientId}&response_type=code&redirect_uri=${_baseUrl}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

export default function useAuth(code: string) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    if (code != "" && !accessToken)
      axios.post("/api/login", { code }).then((res: any) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios.post("/api/refresh", { refreshToken }).then((res: any) => {
        setAccessToken(res.data.accessToken);
        setExpiresIn(res.data.expiresIn);
      });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
