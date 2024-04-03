const SpotifyWebApi = require("spotify-web-api-node");

export default async function refresh(req: any, res: any) {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.BASE_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  try {
    const response = await spotifyApi.refreshAccessToken();
    res.json({
      accessToken: response.body.access_token,
      expiresIn: response.body.expires_in,
    });
  } catch (e) {
    res.status(400).end();
  }
}
