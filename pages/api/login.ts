const SpotifyWebApi = require("spotify-web-api-node");

export default async function login(req: any, res: any) {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.BASE_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  try {
    const response = await spotifyApi.authorizationCodeGrant(code);
    const body = response.body;
    res.json({
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      expiresIn: body.expires_in,
    });
  } catch (e) {
    res.status(400).end();
  }
}
