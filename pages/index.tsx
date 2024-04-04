"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@/services/auth";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from "react-spotify-web-playback";
import Wave from "react-wavify";
import { useStopwatch } from "react-timer-hook";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
});

interface ITrack {
  title: string;
  uri: string;
  duration: number;
}

interface IOwner {
  display_name: string;
}

interface IImage {
  url: string;
}

interface IPlaylist {
  id: string;
  owner: IOwner;
  name: string;
  image: IImage[];
  uri: string;
}

export default function App() {
  const router = useRouter();
  const { start, pause, minutes, seconds, hours } = useStopwatch();
  const [theme, setTheme] = useState<"blue" | "purple">("blue");
  const [timerHours, setTimerHours] = useState(hours);
  const [timerMinutes, setTimerMinutes] = useState(minutes);
  const [timerSeconds, setTimerSeconds] = useState(seconds);
  const [firstEnter, setFirstEnter] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [playlist, setPlaylist] = useState<IPlaylist>();
  const [playlistsFound, setPlaylistsFound] = useState<IPlaylist[]>([]);
  const [play, setPlay] = useState(false);
  const [waveDuration, setWaveDuration] = useState(false);
  const accessToken = useAuth(router.query.code?.toString() ?? "");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (play) {
      setFirstEnter(false);
      start();
    }
    if (!play) {
      pause();
    }
  }, [play]);

  useEffect(() => {
    setTimerHours(hours);
    setTimerMinutes(minutes);
    setTimerSeconds(seconds);
  }, [hours, minutes, seconds]);

  useEffect(() => {
    if (!search) return setSearch("");

    spotifyApi.searchPlaylists(search, { limit: 5 }).then((res: any) => {
      console.log(res.body.playlists.items);
      setPlaylistsFound(
        res.body.playlists.items.map(
          (pl: { name: any; images: any; uri: any; id: any; owner: any }) => {
            return {
              name: pl.name,
              image: pl.images,
              uri: pl.uri,
              id: pl.id,
              owner: pl.owner,
            };
          }
        )
      );
    });
  }, [search]);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="flex justify-between mx-6 mt-6">
        <div className="w-[23%] relative">
          <input
            type="search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
            className={`px-4 py-5 text-sm rounded-lg bg-transparent outlined-none text-left w-[100%] border ${
              theme === "blue"
                ? "border-secondary-blue"
                : "border-primary-purple"
            }`}
            placeholder="Busque por playlist"
          />
          {search != "" && playlistsFound && (
            <div className="bg-white rounded-lg w-100 mt-2 px-3 py-1 absolute w-[100%]">
              {playlistsFound.map((pl) => {
                return (
                  <button
                    className="flex my-3 text-left"
                    onClick={() => {
                      setPlaylist(pl);
                      setPlay(true);
                      setSearch("");
                    }}
                  >
                    <img src={pl.image[0].url} width={64} />
                    <div className="ml-2">
                      <p className="text-black text-md">{pl.name}</p>
                      <p className="text-black text-sm text-slate-500">
                        {pl.owner.display_name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {playlist && (
          <div className="bg-white h-min py-1 px-5 rounded-full">
            <p
              className={
                theme === "blue"
                  ? "text-sm font-bold text-secondary-blue"
                  : "text-sm font-bold text-secondary-purple"
              }
            >
              Ouvindo de: {playlist.name}
            </p>
          </div>
        )}
        <div className="w-[23%] flex justify-end">
          <div
            className={`bg-transparent rounded-lg px-8 py-4 text-center h-min w-4/6 border ${
              theme === "blue"
                ? "border-secondary-blue text-secondary-blue"
                : "border-primary-purple text-primary-purple"
            }`}
          >
            <p className="text-lg font-normal">tempo de foco</p>
            <p className="text-2xl font-bold">
              {timerHours < 10 ? `0${timerHours}` : timerHours}:
              {timerMinutes < 10 ? `0${timerMinutes}` : timerMinutes}:
              {timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-[46px]"></div>
        {firstEnter && !play ? (
          <h1
            className="text-5xl text-center m-auto pb-20 font-thin"
            style={{ zIndex: 2 }}
          >
            busque uma playlist para iniciar
          </h1>
        ) : (
          <h1
            className="text-9xl text-center mx-auto mt-20 pb-20 font-thin"
            style={{ zIndex: 2 }}
          >
            {play ? "focus" : "pause"}
          </h1>
        )}
        <div className="mr-4 flex flex-col">
          <button
            onClick={() => setTheme("blue")}
            className={
              theme === "blue"
                ? "h-[30px] w-[30px] bg-primary-blue rounded-md mb-2 border-4 border-white"
                : "h-[30px] w-[30px] bg-primary-blue rounded-md mb-2"
            }
          />
          <button
            onClick={() => setTheme("purple")}
            className={
              theme === "purple"
                ? "h-[30px] w-[30px] bg-primary-purple rounded-md border-4 border-white"
                : "h-[30px] w-[30px] bg-primary-purple rounded-md"
            }
          />
        </div>
      </div>

      <div className="">
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
              <stop
                offset="10%"
                stopColor={theme === "blue" ? "#36acac" : "#ecabf2"}
              />
              <stop
                offset="90%"
                stopColor={theme === "blue" ? "#2a7599" : "#9643cc"}
              />
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
              bgColor: theme === "blue" ? "#2a7599" : "#9643cc",
              color: "#fff",
              loaderColor: "#fff",
              sliderColor: "#1cb954",
              trackArtistColor: "#ccc",
              trackNameColor: "#fff",
            }}
            showSaveIcon
            play={play}
            uris={playlist ? playlist.uri : []}
          />
        </div>
      </div>
    </div>
  );
}
