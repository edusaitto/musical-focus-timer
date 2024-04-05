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
  images: IImage[];
  uri: string;
}
