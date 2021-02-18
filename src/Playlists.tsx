import { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

export function Playlists(props: { accessToken: string }) {
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const [nextPage, setNextPage] = useState(1);

  const spotify = new SpotifyWebApi();
  spotify.setAccessToken(props.accessToken);

  const getPlaylistPage = (page: number) => {
    spotify
      .getUserPlaylists({ limit: 50, offset: page * 50 })
      .then((data) => {
        setPlaylists([...playlists, ...data.body.items]);
        if (data.body.next) setNextPage(page + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getPlaylistPage(nextPage);
  }, [props.accessToken, nextPage]);

  return (
    <div>
      <h2>Playlists</h2>
      <div>
        {playlists
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((p) => (
            <div>{p.name}</div>
          ))}
      </div>
    </div>
  );
}
