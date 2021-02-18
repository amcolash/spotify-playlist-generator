import { useEffect } from 'react';
import { Loading } from './Loading';
import { getHashParams, setSpotifyToken } from './util';

function login(setAuthenticated: (authenticated: boolean) => void) {
  const params = getHashParams();

  if (!params.access_token || params.state !== localStorage.getItem('spotifyState')) {
    const scopes = ['playlist-read-private', 'playlist-modify-public'],
      redirectUri = 'http://localhost:3000',
      clientId = 'c2fc1a6c5ec54aa2819513c41fc6d12f',
      state = Math.random().toString(),
      showDialog = !localStorage.getItem('spotifyState');

    localStorage.setItem('spotifyState', state);

    // Do client-based auth flow
    const authorizeURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}&show_dialog=${showDialog}`;
    window.location.href = authorizeURL;
  } else {
    setAuthenticated(true);
    setSpotifyToken(params.access_token);

    window.location.hash = '';
  }
}

export function Login(props: { setAuthenticated: (authenticated: boolean) => void }) {
  const firstAuth = !localStorage.getItem('spotifyState');

  useEffect(() => {
    if (!firstAuth) login(props.setAuthenticated);
  }, [props, firstAuth]);

  if (!firstAuth) return <Loading text="Logging In" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ marginBottom: 0, fontSize: 72 }}>[NewList]</h1>
      <h3 style={{ marginTop: 4, marginBottom: 80 }}>Smarter Music Discovery</h3>
      <h2>Please Login to Spotify</h2>
      <button onClick={() => login(props.setAuthenticated)}>Login</button>
    </div>
  );
}
