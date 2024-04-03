"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@/services/auth";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from "react-spotify-web-playback";
import Wave from "react-wavify";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
});

interface ITrack {
  title: string;
  uri: string;
  duration: number;
}

export default function App() {
  const router = useRouter();
  const [firstEnter, setFirstEnter] = useState(true);
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [tracksUris, setTracksUris] = useState<string[]>([]);
  const [playlist, setPlaylist] = useState<string>();
  const [track, setTrack] = useState<any>();
  const [play, setPlay] = useState(false);
  const [waveDuration, setWaveDuration] = useState(false);
  const accessToken = useAuth(router.query.code?.toString() ?? "");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.searchPlaylists("piano focus").then((res: any) => {
      const playlistId = res.body.playlists.items[0].id;
      setPlaylist(res.body.playlists.items[0].uri);
      spotifyApi.getPlaylistTracks(playlistId).then((playlistTracks) => {
        playlistTracks.body.items.map((track) => {
          setTracks([
            ...tracks,
            {
              title: track.track?.name ?? "",
              duration: track.track?.duration_ms ?? 0,
              uri: track.track?.uri ?? "",
            },
          ]);
          setTracksUris([...tracksUris, track.track?.uri ?? ""]);
        });
      });
    });
    //setTrack(tracks[0].uri);
  }, [accessToken]);

  useEffect(() => {
    if (play) {
      setFirstEnter(false);
    }
  }, [play]);

  useEffect(() => () => setPlay(true), [track]);

  return (
    <div className="flex-col align-center justify-center min-h-screen">
      <div className="min-h-screen flex">
        {firstEnter && !play ? (
          <h1
            className="text-5xl text-center m-auto pb-20 font-thin"
            style={{ zIndex: 2 }}
          >
            aperte play para iniciar
          </h1>
        ) : (
          <h1
            className="text-9xl text-center m-auto pb-20 font-thin"
            style={{ zIndex: 2 }}
          >
            {play ? "focus" : "pause"}
          </h1>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <Wave
          fill="url(#gradient)"
          style={{ display: "flex", height: 180, zIndex: 1 }}
          options={{
            height: 20,
            amplitude: 30,
            speed: 0.3,
            points: 4,
          }}
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor="#36acac" />
              <stop offset="90%" stopColor="#2a7599" />
            </linearGradient>
          </defs>
        </Wave>
        <div className="">
          <SpotifyPlayer
            token={accessToken ?? ""}
            callback={(state) => {
              if (state.isPlaying) setPlay(true);
              if (state.isPlaying == false) setPlay(false);
            }}
            styles={{
              activeColor: "#fff",
              bgColor: "#2a7599",
              color: "#fff",
              loaderColor: "#fff",
              sliderColor: "#1cb954",
              trackArtistColor: "#ccc",
              trackNameColor: "#fff",
            }}
            showSaveIcon
            play={play}
            uris={playlist ? playlist : []}
          />
        </div>
      </div>
    </div>
  );
}
