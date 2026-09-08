#!/usr/bin/env python3
"""Generate LatAm Neural2 practice MP3s for Uno (female + male).

Voices (es-US Neural2 — closest LatAm Neural2; no es-MX Neural2 exists):
  f → es-US-Neural2-A (FEMALE)
  m → es-US-Neural2-B (MALE)

Output: public/audio/es-mx/{slug}-f.mp3 and {slug}-m.mp3

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
}

# Existing U1–U2 + Unit 3 Numbers phrases
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
    "Yo también hablo español.",
    # Unit 3 — Numbers that matter
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
    # Intermediate Units 4–8
    'Ayer trabajé hasta tarde.',
    'Camino al trabajo.',
    'Comí tacos hoy.',
    'Dije la verdad.',
    'Disculpe, ¿cómo llego a la estación?',
    'Disculpe, ¿me puede traer un menú?',
    'Dobla a la izquierda.',
    'El banco está a la derecha.',
    'El café está cerca.',
    'El departamento es pequeño pero cómodo.',
    'Fui al supermercado ayer.',
    'Gira a la derecha.',
    'Gracias, pero ahora no puedo.',
    'Hablé con mi hermana ayer.',
    'Hice la tarea anoche.',
    'Hoy comí temprano.',
    'Hoy voy al centro.',
    'La cuenta, por favor.',
    'La estación está lejos.',
    'La farmacia está a la izquierda.',
    'Me despierto a las siete.',
    'Me despierto temprano todos los días.',
    'Me gusta el café con leche.',
    'Me gusta el café.',
    'Me gustan los tacos.',
    'Me parece bien.',
    'Me parece una buena idea.',
    'No queda muy lejos caminando.',
    'No quiero llegar tarde.',
    'No tuve tiempo ayer.',
    'Quiero salir el viernes.',
    'Quiero un jugo de naranja.',
    'Quiero un jugo, por favor.',
    'Sigue todo recto.',
    'Tal vez otro día. ¡Gracias!',
    'Todo recto y luego a la derecha.',
    'Tomo el metro todos los días.',
    'Trabajo en una oficina.',
    'Trabajo todos los días.',
    'Tuve una reunión hoy.',
    'Vivo cerca del centro.',
    'Vivo en un departamento en la ciudad.',
    'Voy a cocinar esta noche.',
    'Voy a estudiar esta noche.',
    'Voy al centro en metro.',
    'Voy al trabajo en carro.',
    'ayer',
    'café',
    'carro',
    'cerca',
    'departamento',
    'el centro',
    'hoy',
    'jugo',
    'lejos',
    'me gusta',
    'metro',
    'quiero',
    '¿A qué hora te despiertas?',
    '¿Cómo llego al centro?',
    '¿Dónde está el baño?',
    '¿Dónde está la estación de metro?',
    '¿Dónde está la estación?',
    '¿En qué trabajas?',
    '¿Hablaste con el mesero?',
    '¿Me recomienda algo, por favor?',
    '¿Me trae la cuenta, por favor?',
    '¿Quieres caminar al centro?',
    '¿Qué comiste ayer?',
    '¿Qué hiciste ayer?',
    '¿Qué hiciste hoy?',
    '¿Qué quieres comer?',
    '¿Qué te dijo?',
    '¿Te gustaría ir al cine?',
    '¿Te gustaría tomar un café?',
    '¿Tienen jugo natural?',
    '¿Tienes carro?',
    '¿Vas a venir?',
]


def slugify(text: str) -> str:
    nfkd = unicodedata.normalize("NFKD", text)
    ascii_text = "".join(c for c in nfkd if not unicodedata.combining(c))
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r"[¿?¡!,.]", "", ascii_text)
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text)
    return ascii_text.strip("-")


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
        default=Path(__file__).resolve().parents[1] / "public" / "audio" / "es-mx",
    )
    parser.add_argument("--only-missing", action="store_true")
    parser.add_argument("--list-voices", action="store_true")
    parser.add_argument(
        "--voices",
        default="f,m",
        help="Comma list of voice keys: f,m",
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

    voice_keys = [k.strip() for k in args.voices.split(",") if k.strip()]
    for k in voice_keys:
        if k not in VOICES:
            raise SystemExit(f"Unknown voice key {k!r}; choose from {list(VOICES)}")

    args.out.mkdir(parents=True, exist_ok=True)
    print(f"language={LANGUAGE_CODE} rate={SPEAKING_RATE} voices={voice_keys}")
    print(f"out={args.out}")

    written: list[str] = []
    skipped = 0
    seen: set[tuple[str, str]] = set()
    for phrase in PHRASES:
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
