import SpotifyWebApi from 'spotify-web-api-node';

export const mobile = { maxWidth: 450 };
export const shortMobile = { maxHeight: 575 };

// Useful code from https://stackoverflow.com/questions/58964265/spotify-implicit-grant-flow-with-react-user-login
export function getHashParams(): { [key: string]: string } {
  const hashParams: { [key: string]: string } = {};
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  let e = r.exec(q);
  while (e) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
    e = r.exec(q);
  }
  return hashParams;
}

export const spotify = new SpotifyWebApi();
export function setSpotifyToken(token: string): void {
  spotify.setAccessToken(token);
}

export function handleError(error: any): void {
  debugger;

  const lastReload = Number.parseInt(localStorage.getItem('spotifyLastError') || '0');

  if (Date.now() - lastReload > 5000) {
    localStorage.setItem('spotifyLastError', Date.now().toString());
    window.location.reload();
  }
}

// Uff, that is a bit generic ;)
async function paginationHelper<T>(
  getData: (
    page: number
  ) => Promise<{
    body: {
      items: T[];
      next: string | null;
    };
  }>
): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    const allData: T[] = [];
    let page = 0;

    while (page >= 0) {
      try {
        const data = await getData(page);
        allData.push(...(data.body.items as any[]));

        page = data.body.next ? page + 1 : -1;
      } catch (error) {
        handleError(error);
        return;
      }
    }

    resolve(allData);
  });
}

export async function getUserPlaylists(): Promise<SpotifyApi.PlaylistObjectSimplified[]> {
  return paginationHelper((page: number) => spotify.getUserPlaylists({ limit: 50, offset: page * 50 }));
}

export async function getPlaylist(id: string): Promise<SpotifyApi.PlaylistTrackObject[]> {
  return paginationHelper((page: number) => spotify.getPlaylistTracks(id, { limit: 100, offset: page * 100 }));
}

export async function getRelated(playlist: SpotifyApi.PlaylistTrackObject[]): Promise<SpotifyApi.TrackObjectSimplified[]> {
  return new Promise(async (resolve, reject) => {
    const related: SpotifyApi.TrackObjectSimplified[] = [];

    let tracks = '';
    for (let i = 1; i <= playlist.length; i++) {
      if (playlist[i - 1].is_local) continue;

      tracks += playlist[i - 1].track.id + (i % 5 !== 0 ? ',' : '');

      if (i % 5 === 0) {
        try {
          const rec = await spotify.getRecommendations({ seed_tracks: tracks, limit: 10 });

          // Ensure there are no duplicated. Can't use a Set here since {} !== {}
          rec.body.tracks.forEach((t) => {
            const found = related.findIndex((f) => f.id === t.id);
            if (found === -1) related.push(t);
          });

          tracks = '';
        } catch (error) {
          handleError(error);
          return;
        }
      }
    }

    resolve(related);
  });
}

export async function createPlaylist(
  generated: SpotifyApi.TrackObjectSimplified[],
  setPlaylistLink: (link: string) => void
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const name = prompt('Name of playlist?');
    if (!name || name.length === 0) {
      reject();
      return;
    }

    try {
      const p = await spotify.createPlaylist(name);

      for (let i = 0; i < generated.length; i += 100) {
        await spotify.addTracksToPlaylist(
          p.body.id,
          generated.slice(i, i + 100).map((t) => t.uri)
        );
      }

      setPlaylistLink(p.body.external_urls.spotify);
    } catch (error) {
      handleError(error);
      return;
    }

    resolve();
  });
}
