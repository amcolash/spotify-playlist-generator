export function Tutorial(props: { closeTutorial: () => void }) {
  return (
    <>
      <p>
        DiscoList is a free tool that helps you discover new music. By using Spotify's own recommendation algorithms, we can generate new
        and unque playlists based on your own existing playlists.
      </p>
      <p>
        There are a few options that you can use to tweak your new playlists. Go wild - there are no wrong choices as long as you find good
        music.
      </p>
      <p>To get started, just choose a playlist.</p>
      <button onClick={props.closeTutorial}>Let's Get Started!</button>
    </>
  );
}
