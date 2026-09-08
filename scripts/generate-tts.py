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

VOICE_NAME = "es-US-Neural2-A"
LANGUAGE_CODE = "es-US"
SPEAKING_RATE = 0.95

PHRASES: list[str] = [
    "adiós",
    "Adiós, nos vemos pronto.",
    "¡Adiós! Que te vaya bien.",
    "Buenas noches",
    "buenas noches",
    "¡Buenas noches! Nos vemos mañana.",
    "Buenas noches, que descanses.",
    "buenas tardes",
    "Buenas tardes, ¿en qué puedo ayudarte?",
    "¡Buenas tardes! Llegamos a tiempo.",
    "Buenos días",
    "buenos días",
    "¡Buenos días! ¿Cómo estás?",
    "Buenos días, señor López.",
    "¿cómo estás?",
    "¿Cómo estás hoy?",
    "¿cómo te llamas?",
    "¿Cómo te llamas? Yo me llamo Ana.",
    "¿De dónde eres?",
    "¿de dónde eres?",
    "¿De dónde eres? Soy de Estados Unidos.",
    "¿De dónde eres? — Soy de México.",
    "de nada",
    "De nada, con gusto.",
    "Disculpe",
    "disculpe",
    "Disculpe, ¿habla inglés?",
    "Disculpe, ¿me puede ayudar?",
    "Ella es de México.",
    "Ella vive en un departamento en la ciudad.",
    "Es una empresa estadounidense.",
    "español",
    "Estados Unidos",
    "estadounidense",
    "Estoy aprendiendo español.",
    "Gracias",
    "gracias",
    "—Gracias. —De nada.",
    "Gracias por tu ayuda.",
    "hablar",
    "—¿Hablas español? —Sí.",
    "¿Hablas inglés?",
    "Hablo español",
    "Hablo español.",
    "Hablo español, pero un poco.",
    "Hablo inglés y un poco de español.",
    "Hablo un poco de español",
    "Hablo un poco de español.",
    "Hasta luego",
    "hasta luego",
    "Hasta luego, ¡cuidate!",
    "hola",
    "Hola, ¿cómo estás?",
    "Hola, ¿cómo te llamas?",
    "Hola, me llamo Sofía.",
    "Hola, me llamo Valeria. Mucho gusto.",
    "¡Hola! ¿Qué tal?",
    "Hola, soy Ana. ¡Mucho gusto!",
    "inglés",
    "llamarse",
    "me llamo",
    "Me llamo Ana. — Yo también soy Ana.",
    "Me llamo Diego.",
    "Me llamo Sofía",
    "¿Me pasas el menú, por favor?",
    "México",
    "¡Muchas gracias!",
    "Mucho gusto",
    "mucho gusto",
    "Mucho gusto, Carlos. Bienvenido.",
    "no",
    "No, gracias",
    "No, gracias.",
    "No hablo mucho español.",
    "Okay, hasta luego. Nos vemos.",
    "Perdón",
    "perdón",
    "Perdón, ¿dónde está el baño?",
    "¡Perdón! No te vi.",
    "pero",
    "por favor",
    "Sé un poco de inglés.",
    "ser",
    "sí",
    "Sí, por favor",
    "Sí, por favor.",
    "soy de",
    "Soy de Estados Unidos.",
    "Soy de México",
    "Soy de México.",
    "Soy de México, pero vivo en Estados Unidos.",
    "Soy estadounidense.",
    "Soy estudiante.",
    "también",
    "Un café, por favor.",
    "un poco de",
    "¿Ustedes hablan inglés?",
    "¿Vives en México?",
    "vivo en",
    "Vivo en Estados Unidos",
    "Vivo en Estados Unidos.",
    "Yo también hablo español."
]


def slugify(text: str) -> str:
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
        "--only-missing",
        action="store_true",
        help="Skip phrases that already have an mp3",
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
    skipped = 0
    # Dedupe by slug so first phrase wins for a given filename
    seen_slugs: set[str] = set()
    for phrase in PHRASES:
        slug = slugify(phrase)
        if not slug or slug in seen_slugs:
            continue
        seen_slugs.add(slug)
        path = args.out / f"{slug}.mp3"
        if args.only_missing and path.exists() and path.stat().st_size > 0:
            skipped += 1
            continue
        audio = synthesize(client, phrase)
        path.write_bytes(audio)
        written.append(path.name)
        print(f"wrote {path.name} ({len(audio)} bytes) <- {phrase!r}")

    print(f"done: {len(written)} written, {skipped} skipped")


if __name__ == "__main__":
    main()
