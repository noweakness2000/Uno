import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { enrichWrongExplanation } from "@/lib/feedback-coach";
import { answersMatch } from "@/lib/grading";
import { LESSONS } from "@/lib/mock-data";
import {
  isNearMissIgnoringSubjectPronouns,
  matchIgnoringSubjectPronouns,
  typedAnswerMatches,
  withoutSubjectPronouns,
} from "@/lib/subject-pronouns";
import type { Exercise } from "@/lib/types";

const COFFEE = ["Quiero un café, por favor.", "Quiero un cafe, por favor", "Quiero un café por favor"];
const ok = (accepted: string, user: string) => typedAnswerMatches(accepted, user);

describe("optional subject pronouns — learner adds one", () => {
  test("yo + quiero (the reported case)", () => {
    assert.ok(COFFEE.some((a) => ok(a, "Yo quiero un café, por favor")));
    assert.ok(ok("Quiero un café, por favor.", "yo quiero un cafe por favor"));
  });
  test("tú / tu (accent optional) + quieres", () => {
    assert.ok(ok("¿Quieres agua?", "¿Tú quieres agua?"));
    assert.ok(ok("¿Quieres agua?", "tu quieres agua"));
    assert.ok(ok("Hablas inglés.", "tu hablas ingles"));
  });
  test("every person", () => {
    assert.ok(ok("Habla español.", "Él habla español"));
    assert.ok(ok("Habla español.", "Ella habla español"));
    assert.ok(ok("Habla español.", "Usted habla español"));
    assert.ok(ok("Habla español.", "Ud. habla español"));
    assert.ok(ok("Hablamos español.", "Nosotros hablamos español"));
    assert.ok(ok("Hablamos español.", "Nosotras hablamos español"));
    assert.ok(ok("Habláis español.", "Vosotros habláis español"));
    assert.ok(ok("Hablan español.", "Ellos hablan español"));
    assert.ok(ok("Hablan español.", "Ellas hablan español"));
    assert.ok(ok("Hablan español.", "Ustedes hablan español"));
    assert.ok(ok("Hablan español.", "Uds. hablan español"));
  });
  test("verbs the course doesn't table (ending check)", () => {
    assert.ok(ok("Necesito ayuda.", "Yo necesito ayuda"));
    assert.ok(ok("Necesitas ayuda.", "Tú necesitas ayuda"));
    assert.ok(ok("Viajamos mañana.", "Nosotros viajamos mañana"));
    assert.ok(ok("Llegaron tarde.", "Ellos llegaron tarde"));
    assert.ok(ok("Compraste pan.", "Tú compraste pan"));
  });
  test("with no / object pronouns / reflexives between", () => {
    assert.ok(ok("No quiero café.", "Yo no quiero café"));
    assert.ok(ok("Me llamo Carlos.", "Yo me llamo Carlos"));
    assert.ok(ok("No te entiendo.", "Yo no te entiendo"));
    assert.ok(ok("Se llama Ana.", "Ella se llama Ana"));
  });
  test("mid-sentence, after a clause opener", () => {
    assert.ok(ok("Creo que tiene razón.", "Creo que él tiene razón"));
    assert.ok(ok("Creo que tiene razón.", "Creo que el tiene razon"));
    assert.ok(ok("Mañana voy al cine.", "Mañana yo voy al cine"));
    assert.ok(ok("Quiero café y quieres té.", "Yo quiero café y tú quieres té"));
  });
});

describe("optional subject pronouns — learner leaves one out", () => {
  test("answer includes the pronoun", () => {
    assert.ok(ok("yo me llamo carlos", "me llamo carlos"));
    assert.ok(ok("Tú hablas inglés.", "Hablas ingles"));
    assert.ok(ok("¿Usted habla inglés?", "¿Habla inglés?"));
    assert.ok(ok("Antes, yo iba al aeropuerto en taxi.", "Antes iba al aeropuerto en taxi"));
    assert.ok(ok("Él tiene hambre.", "tiene hambre"));
  });
  test("one side has it, the other not, at different spots", () => {
    assert.ok(ok("Yo quiero café y quieres té.", "Quiero café y tú quieres té"));
  });
});

describe("still wrong", () => {
  test("pronoun-person mismatch", () => {
    assert.ok(!ok("Quieres agua.", "Yo quieres agua"));
    assert.ok(!ok("Quiero agua.", "Tú quiero agua"));
    assert.ok(!ok("Quiero agua.", "tu quiero agua"));
    assert.ok(!ok("Hablamos español.", "Ellos hablamos español"));
    assert.ok(!ok("Hablan español.", "Él hablan español"));
    assert.ok(!ok("Es de México.", "Yo es de México"));
    assert.ok(!ok("Necesito ayuda.", "Tú necesito ayuda"));
  });
  test("swapping one pronoun for another", () => {
    assert.ok(!ok("Él come pan.", "Ella come pan"));
    assert.ok(!ok("Yo hablo.", "Tú hablo"));
  });
  test("pronoun with no verb carries the meaning", () => {
    assert.ok(!ok("Yo también.", "También"));
    assert.ok(!ok("¿Y tú?", "¿Y?"));
    assert.ok(!ok("Ella y yo.", "Y yo"));
    assert.ok(!ok("Es más alto que él.", "Es más alto que"));
  });
  test("articles and possessives are not pronouns", () => {
    assert.ok(!ok("El café está frío.", "Café está frío"));
    assert.ok(!ok("Café, por favor.", "El café, por favor"));
    assert.ok(!ok("Quiero café.", "Quiero el café"));
    assert.ok(!ok("Tu casa es bonita.", "Casa es bonita"));
    assert.ok(!ok("Es tu casa.", "Es casa"));
    assert.ok(!ok("Creo que el metro es mejor.", "Creo que metro es mejor"));
  });
  test("other words still required (no article leniency)", () => {
    assert.ok(!COFFEE.some((a) => ok(a, "yo quiero cafe por favor")));
    assert.ok(!ok("Quiero un café, por favor.", "Yo quiero una café, por favor"));
  });
  test("gustar-style verbs don't take a subject pronoun", () => {
    assert.ok(!ok("Me gusta el café.", "Yo me gusta el café"));
  });
});

describe("existing leniency is unchanged", () => {
  test("accents, punctuation and case are forgiven", () => {
    assert.ok(answersMatch("Quiero un café, por favor.", "quiero un cafe por favor"));
    assert.ok(ok("¿Cómo estás?", "como estas"));
  });
  test("symmetry", () => {
    assert.ok(matchIgnoringSubjectPronouns("Quiero agua", "Yo quiero agua"));
    assert.ok(matchIgnoringSubjectPronouns("Yo quiero agua", "Quiero agua"));
  });
  test("withoutSubjectPronouns", () => {
    assert.equal(withoutSubjectPronouns("Yo quiero un café, por favor."), "quiero un cafe por favor");
    assert.equal(withoutSubjectPronouns("Yo también"), "yo tambien");
    assert.equal(withoutSubjectPronouns("El café está frío"), "el cafe esta frio");
  });
});

describe("near-miss second chance", () => {
  test("pronoun + one missing word is a near miss (the screenshot's answer)", () => {
    assert.ok(isNearMissIgnoringSubjectPronouns("yo quiero cafe por favor", COFFEE));
  });
  test("an accepted answer is not a near miss", () => {
    assert.ok(!isNearMissIgnoringSubjectPronouns("Yo quiero un café, por favor", COFFEE));
  });
  test("unrelated answer is not a near miss", () => {
    assert.ok(!isNearMissIgnoringSubjectPronouns("yo tengo un perro grande", COFFEE));
  });
});

describe("every authored translate/conjugate answer", () => {
  test("still matches itself, and with its pronoun added/removed where the rule allows", () => {
    let checked = 0;
    for (const lesson of Object.values(LESSONS)) {
      for (const ex of lesson.exercises as Exercise[]) {
        if (ex.type !== "translate" && ex.type !== "conjugate") continue;
        for (const a of ex.acceptedAnswers) {
          assert.ok(ok(a, a), a);
          checked++;
        }
      }
    }
    assert.ok(checked > 100);
  });
});

describe("wrong-answer coaching copy", () => {
  const ex = { type: "translate" } as Exercise;
  test("doesn't repeat an explanation that is just the answer", () => {
    const out = enrichWrongExplanation(ex, "Quiero un café, por favor.", "Quiero un café, por favor.");
    assert.ok(!out.startsWith("Quiero un café"), out);
    assert.equal(out.split("Quiero un café").length - 1, 1, out);
    assert.ok(!out.includes(".”."), out);
    assert.ok(out.includes("“Quiero un café, por favor”."), out);
  });
  test("keeps ? / ! answers intact without an extra period", () => {
    const out = enrichWrongExplanation(ex, "", "¿Cómo estás?");
    assert.ok(out.includes("“¿Cómo estás?”"), out);
    assert.ok(!out.includes("?”."), out);
  });
  test("doesn't append the answer when the explanation already quotes it", () => {
    const out = enrichWrongExplanation(ex, "Use quiero: Quiero un café.", "Quiero un café.");
    assert.ok(!out.includes("The expected answer"), out);
  });
});
