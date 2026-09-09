#!/usr/bin/env python3
"""Generate LatAm Neural2 practice MP3s for Uno (varied Neural2 voices).

Voices (es-US Neural2 — closest LatAm Neural2; no es-MX Neural2 exists):
  f → es-US-Neural2-A (FEMALE)
  m → es-US-Neural2-B (MALE)
  c → es-US-Neural2-C (MALE)

Output: public/audio/es-mx/{slug}-{voice}.mp3

Harvests speakable Spanish from src/lib content (lemmas, examples, audioText,
target phrases, Spanish options, match pairs) plus any EXTRA_PHRASES below.

Requires:
  pip install google-cloud-texttospeech
  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
"""
from __future__ import annotations

import argparse
import re
import unicodedata
from pathlib import Path

from google.cloud import texttospeech

LANGUAGE_CODE = "es-US"
SPEAKING_RATE = 0.95
VOICES = {
    "f": "es-US-Neural2-A",
    "m": "es-US-Neural2-B",
    "c": "es-US-Neural2-C",
}

ROOT = Path(__file__).resolve().parents[1]
CONTENT_FILES = [
    ROOT / "src" / "lib" / "content" / "intermediate.ts",
    ROOT / "src" / "lib" / "content" / "unit5.ts",
    ROOT / "src" / "lib" / "content" / "unit6.ts",
    ROOT / "src" / "lib" / "content" / "unit7.ts",
    ROOT / "src" / "lib" / "content" / "unit8.ts",
    ROOT / "src" / "lib" / "mock-data.ts",
]

# Seed / legacy phrases (U1–U3 + extras). Harvest merges these with content.
EXTRA_PHRASES: list[str] = [
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
    "Yo también hablo español.",
    "uno",
    "una",
    "Uno, dos, tres.",
    "Quiero un café, por favor.",
    "dos",
    "Tengo dos hermanos.",
    "Son las dos.",
    "tres",
    "Vivo en el número tres.",
    "Tres por favor.",
    "cinco",
    "Cuesta cinco pesos.",
    "Mi número termina en cinco.",
    "diez",
    "Cuento hasta diez.",
    "Son diez dólares.",
    "veinte",
    "Tengo veinte años.",
    "Cuesta veinte pesos.",
    "celular",
    "¿Cuál es tu número de celular?",
    "Mi celular no tiene señal.",
    "¿Cuántos años tienes?",
    "Tengo veinticinco años.",
    "tener",
    "tengo",
    "Tengo un celular nuevo.",
    "¿Tienes cinco minutos?",
    "¿Cuánto cuesta?",
    "¿Cuánto cuestan los jugos?",
    "pesos",
    "Cuesta diez pesos.",
    "Son cincuenta pesos.",
    "dólares",
    "Cuesta veinte dólares.",
    "¿Aceptan dólares?",
    "gratis",
    "Es gratis.",
    "El agua es gratis.",
]


def slugify(text: str) -> str:
    """Match src/lib/audio.ts slugifyAudio exactly."""
    nfkd = unicodedata.normalize("NFKD", text)
    ascii_text = "".join(c for c in nfkd if not unicodedata.combining(c))
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r"[¿?¡!,.]", "", ascii_text)
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text)
    return ascii_text.strip("-")


def looks_spanish(text: str) -> bool:
    """Mirror src/lib/audio.ts looksSpanish for option harvesting."""
    t = text.strip()
    if not t:
        return False
    if re.search(r"[áéíóúüñ¿¡]", t, re.I):
        return True
    norm = unicodedata.normalize("NFD", t.lower())
    norm = "".join(c for c in norm if not unicodedata.combining(c))
    norm = re.sub(r"[¿?¡!,.]", "", norm)
    if re.search(
        r"\b(hola|adios|gracias|perdon|disculpe|buenos|buenas|dias|tardes|noches|"
        r"mucho|gusto|llamo|llamas|llamarse|soy|eres|es|somos|son|hablo|hablas|habla|"
        r"hablan|ingles|espanol|mexico|estados|unidos|vivo|viven|tambien|pero|nada|"
        r"favor|luego|hasta|usted|ustedes|como|donde|de|un|poco|si|no|me|te|se|nos|"
        r"uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|veinte|cien|celular|"
        r"telefono|anos|cuanto|cuesta|pesos|dolares|gratis|tengo|tienes|numero|"
        r"numeros|carro|jugo|departamento|despierto|trabajo|camino|gusta|gustan|"
        r"quiero|cuenta|cerca|lejos|derecha|izquierda|recto|centro|metro|llego|comi|"
        r"hable|ayer|hoy|fui|hice|tuve|dije|voy|vas|gustaria|parece|levanto|levantas|ducho|duchas|desayuno|estudio|limpio|cocina|fin|semana|descanso|temprano|manana|preparo|lavo|oficina|escuela|tarea|ropa|platos|dormir|duermo|tacos|pollo|arroz|pan|comida|menu|agua|leche|te|restaurante|mesero|propina|almuerzo|cena|llevar|gustaria|recomienda|traiga|trae|natural|naranja)\b",
        norm,
    ):
        return True
    if re.match(
        r"^(hola|adios|gracias|perdon|disculpe|si|no|de nada|por favor|mucho gusto|hasta luego)$",
        t,
        re.I,
    ):
        return True
    return False


def harvest_content_phrases() -> list[str]:
    """Pull every speakable string from lesson/word-card content."""
    found: list[str] = []
    seen: set[str] = set()

    def add(raw: str) -> None:
        p = raw.strip()
        if not p or p in seen:
            return
        seen.add(p)
        found.append(p)

    for path in CONTENT_FILES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(r'lemma:\s*"([^"]+)"', text):
            add(m.group(1))
        for m in re.finditer(r"lemma:\s*'([^']+)'", text):
            add(m.group(1))
        for m in re.finditer(r'\bes:\s*"([^"]+)"', text):
            add(m.group(1))
        for m in re.finditer(r"\bes:\s*'([^']+)'", text):
            add(m.group(1))
        for m in re.finditer(r'listen\(\s*"[^"]+"\s*,\s*"([^"]+)"', text):
            add(m.group(1))
        for m in re.finditer(r"listen\(\s*'[^']+'\s*,\s*'([^']+)'", text):
            add(m.group(1))
        for m in re.finditer(r'listen\(\s*"[^"]+"\s*,\s*\'([^\']+)\'', text):
            add(m.group(1))
        for m in re.finditer(r'audioText:\s*"([^"]+)"', text):
            add(m.group(1))
        for m in re.finditer(r'targetPhrase:\s*"([^"]+)"', text):
            add(m.group(1))
        for m in re.finditer(r"targetPhrase:\s*'([^']+)'", text):
            add(m.group(1))
        for m in re.finditer(r"correctOrder:\s*\[([^\]]+)\]", text, re.S):
            parts = [
                a or b
                for a, b in re.findall(r'"([^"]*)"|\'([^\']*)\'', m.group(1))
            ]
            if parts:
                add(" ".join(parts))
        for m in re.finditer(r"options:\s*\[([^\]]+)\]", text, re.S):
            for a, b in re.findall(r'"([^"]*)"|\'([^\']*)\'', m.group(1)):
                opt = a or b
                if looks_spanish(opt):
                    add(opt)
        for m in re.finditer(r'\b(?:left|right):\s*"([^"]+)"', text):
            if looks_spanish(m.group(1)):
                add(m.group(1))
        for m in re.finditer(r"\b(?:left|right):\s*'([^']+)'", text):
            if looks_spanish(m.group(1)):
                add(m.group(1))
        # Story-listen lines and other Spanish text: fields
        for m in re.finditer(r'\btext:\s*"([^"]+)"', text):
            if looks_spanish(m.group(1)):
                add(m.group(1))
        for m in re.finditer(r"\btext:\s*'([^']+)'", text):
            if looks_spanish(m.group(1)):
                add(m.group(1))
    return found


def all_phrases() -> list[str]:
    merged: list[str] = []
    seen: set[str] = set()
    for p in EXTRA_PHRASES + harvest_content_phrases():
        if p not in seen:
            seen.add(p)
            merged.append(p)
    return merged


def synthesize(
    client: texttospeech.TextToSpeechClient, text: str, voice_name: str
) -> bytes:
    response = client.synthesize_speech(
        input=texttospeech.SynthesisInput(text=text),
        voice=texttospeech.VoiceSelectionParams(
            language_code=LANGUAGE_CODE,
            name=voice_name,
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
        default=ROOT / "public" / "audio" / "es-mx",
    )
    parser.add_argument("--only-missing", action="store_true")
    parser.add_argument("--list-voices", action="store_true")
    parser.add_argument("--list-phrases", action="store_true")
    parser.add_argument(
        "--voices",
        default="f,m,c",
        help="Comma list of voice keys: f,m,c",
    )
    args = parser.parse_args()

    phrases = all_phrases()
    if args.list_phrases:
        for p in phrases:
            print(f"{slugify(p)}\t{p}")
        print(f"# {len(phrases)} phrases")
        return

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

    voice_keys = [k.strip() for k in args.voices.split(",") if k.strip()]
    for k in voice_keys:
        if k not in VOICES:
            raise SystemExit(f"Unknown voice key {k!r}; choose from {list(VOICES)}")

    args.out.mkdir(parents=True, exist_ok=True)
    print(f"language={LANGUAGE_CODE} rate={SPEAKING_RATE} voices={voice_keys}")
    print(f"out={args.out}")
    print(f"phrases={len(phrases)} (harvested + extras)")

    written: list[str] = []
    skipped = 0
    seen: set[tuple[str, str]] = set()
    for phrase in phrases:
        slug = slugify(phrase)
        if not slug:
            continue
        for key in voice_keys:
            pair = (slug, key)
            if pair in seen:
                continue
            seen.add(pair)
            path = args.out / f"{slug}-{key}.mp3"
            if args.only_missing and path.exists() and path.stat().st_size > 0:
                skipped += 1
                continue
            audio = synthesize(client, phrase, VOICES[key])
            path.write_bytes(audio)
            written.append(path.name)
            print(f"wrote {path.name} ({len(audio)} bytes) <- {phrase!r} [{key}]")

    print(f"done: {len(written)} written, {skipped} skipped")


if __name__ == "__main__":
    main()
