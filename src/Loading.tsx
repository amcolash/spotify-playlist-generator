import { SpinnerCircularFixed } from 'spinners-react';
import { Colors } from './util';

export function Loading(props: { text: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 60 }}>
      <h2>{props.text}</h2>
      <SpinnerCircularFixed size={40} thickness={200} color={Colors.Green} secondaryColor={Colors.Grey} />
    </div>
  );
}
