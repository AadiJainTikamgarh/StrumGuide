export function playMetronomeClick(
  ctx: AudioContext,
  time: number,
  isFirstBeat: boolean,
  volume: number
) {
  if (volume <= 0.001) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Beat 1 gets a higher, brighter pitch and slightly higher amplitude
  const freq = isFirstBeat ? 1320 : 880;
  const clickGain = isFirstBeat ? volume * 0.9 : volume * 0.6;
  const duration = isFirstBeat ? 0.045 : 0.035;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);
  // Slight pitch drop creates a wooden 'tick' impact
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, time + duration);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(clickGain, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + duration + 0.01);
}
