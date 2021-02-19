import { SpinnerCircularFixed } from 'spinners-react';

export function Loading(props: { text: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 60 }}>
      <h2>{props.text}</h2>
      <SpinnerCircularFixed size={40} thickness={200} speed={100} color="#179433" secondaryColor="#202324" />
    </div>
  );
}
