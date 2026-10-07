"""Generate original quiet merge-sort cues using only the Python standard library."""

import math
import json
from pathlib import Path
import struct
import wave


RATE = 48000
OUTPUT = Path(__file__).resolve().parents[1] / "public/files/sem3/csi247/videos/sfx"


def tone(time, start, duration, frequency, amplitude):
    local = time - start
    if local <= 0 or local >= duration:
        return 0.0
    # A smooth onset/end and exponential decay avoid clicks and sharp tails.
    envelope = math.sin(math.pi * local / duration) ** 2
    envelope *= math.exp(-3.0 * local / duration)
    return amplitude * envelope * math.sin(2 * math.pi * frequency * local)


def write_cue(name, duration, voices):
    count = round(RATE * duration)
    samples = []
    for frame in range(count):
        time = frame / RATE
        sample = sum(tone(time, *voice) for voice in voices)
        if abs(sample) >= 1:
            raise ValueError(f"{name}: synthesis clipped at frame {frame}")
        samples.append(round(sample * 32767))
    with wave.open(str(OUTPUT / f"{name}.wav"), "wb") as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(RATE)
        audio.writeframes(struct.pack(f"<{count}h", *samples))
    peak = max(abs(sample) for sample in samples) / 32767
    rms = math.sqrt(sum(sample * sample for sample in samples) / count) / 32767
    peak_frame = max(range(count), key=lambda frame: abs(samples[frame]))
    metadata = {
        "duration": count / RATE,
        "peakTime": peak_frame / RATE,
        "peak": peak,
        "peakDbFS": 20 * math.log10(peak),
        "rmsDbFS": 20 * math.log10(rms),
        "sampleRate": RATE,
        "channels": 1,
        "sampleWidth": 2,
    }
    (OUTPUT / f"{name}.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf8")
    print(f"{name}: {count / RATE:.3f}s, peak {peak:.5f} ({20 * math.log10(peak):.1f} dBFS), RMS {20 * math.log10(rms):.1f} dBFS")


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    write_cue("compare", .050, [(0, .047, 1100, .11), (0, .038, 1650, .025)])
    write_cue("land", .080, [(0, .075, 280, .13), (0, .060, 560, .025)])
    write_cue("merge", .200, [(0, .105, 440, .11), (.085, .110, 660, .11)])


if __name__ == "__main__":
    main()
