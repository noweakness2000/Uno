#!/usr/bin/env python3
"""Generate LatAm (Neural2) practice MP3s for Uno listening exercises.

Requires:
  pip install google-cloud-texttospeech
  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

Note: Google Cloud TTS has no es-MX Neural2 voices. We use es-US-Neural2-A
(female LatAm/US Spanish Neural2) — the closest Neural2 match for Mexico/LatAm.
Files are still written under public/audio/es-mx/ for app paths.
"""
from __future__ import annotations

import argparse
import re
import unicodedata
from pathlib import Path

from google.cloud import texttospeech

# Closest Neural2 LatAm voice (no es-MX Neural2 exists in the API).
VOICE_NAME = "es-US-Neural2-A"
LANGUAGE_CODE = "es-US"
SPEAKING_RATE = 0.95

# Listening-choose phrases + useful teach/word clips
PHRASES: list[str] = [
    "Mucho gusto",
    "Buenas noches",
    "Gracias",
    "Hola, ¿cómo estás?",
    "Me llamo Sofía",
    "buenos días",
    "buenas tardes",
    "perdón",
    "disculpe",
    "hola",
    "adiós",
]


def slugify(text: str) -> str:
    """Stable filename slug from Spanish phrase text."""
    # Normalize accents to ASCII for filenames, keep readability
    nfkd = unicodedata.normalize("NFKD", text)
    ascii_text = "".join(c for c in nfkd if not unicodedata.combining(c))
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r"[¿?¡!,.]", "", ascii_text)
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text)
    return ascii_text.strip("-")


def synthesize(client: texttospeech.TextToSpeechClient, text: str) -> bytes:
    response = client.synthesize_speech(
        input=texttospeech.SynthesisInput(text=text),
        voice=texttospeech.VoiceSelectionParams(
            language_code=LANGUAGE_CODE,
            name=VOICE_NAME,
        ),
        audio_config=texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=SPEAKING_RATE,
        ),
    )
    return response.audio_content


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "public" / "audio" / "es-mx",
        help="Output directory for MP3s",
    )
    parser.add_argument(
        "--list-voices",
        action="store_true",
        help="List Spanish Neural2 voices and exit",
    )
    args = parser.parse_args()

    client = texttospeech.TextToSpeechClient()

    if args.list_voices:
        voices = client.list_voices()
        for v in sorted(voices.voices, key=lambda x: x.name):
            if "Neural2" in v.name and any(
                lc.startswith("es") for lc in v.language_codes
            ):
                gender = texttospeech.SsmlVoiceGender(v.ssml_gender).name
                print(f"{v.name}\tgender={gender}\tlangs={list(v.language_codes)}")
        return

    args.out.mkdir(parents=True, exist_ok=True)
    print(f"voice={VOICE_NAME} language={LANGUAGE_CODE} rate={SPEAKING_RATE}")
    print(f"out={args.out}")

    written: list[str] = []
    for phrase in PHRASES:
        slug = slugify(phrase)
        path = args.out / f"{slug}.mp3"
        audio = synthesize(client, phrase)
        path.write_bytes(audio)
        written.append(path.name)
        print(f"wrote {path.name} ({len(audio)} bytes) <- {phrase!r}")

    print(f"done: {len(written)} files")


if __name__ == "__main__":
    main()
