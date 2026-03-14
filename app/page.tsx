"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Data constants
const AROMAS = [
  { id: "vetiver", name: "Vetiver", icon: "🌾" },
  { id: "sandalo", name: "Sándalo", icon: "🪵" },
  { id: "vainilla_francesa", name: "Vainilla francesa", icon: "🍨" },
  { id: "vainilla_amaderada", name: "Vainilla amaderada", icon: "🍦" },
  { id: "te_blanco", name: "Té blanco", icon: "🫖" },
  { id: "maracuya", name: "Maracuyá", icon: "🥭" },
  { id: "flor_de_azahar", name: "Flor de azahar", icon: "🌼" },
  { id: "orquidea", name: "Orquídea", icon: "🏵️" },
  { id: "mix_berries", name: "Mix berries", icon: "🫐" },
  { id: "manzana_verde", name: "Manzana verde", icon: "🍏" },
  { id: "incienso", name: "Incienso", icon: "🕯️" },
  { id: "jengibre", name: "Jengibre", icon: "🫚" },
  { id: "canela", name: "Canela", icon: "🌶️" },
  { id: "pino", name: "Pino", icon: "🌲" },
  { id: "lavanda", name: "Lavanda", icon: "💜" },
  { id: "geranio", name: "Geranio", icon: "🌸" },
  { id: "patchouli", name: "Patchouli", icon: "🍂" },
  { id: "mirra", name: "Mirra", icon: "🪔" },
  { id: "limon_persa", name: "Limón persa", icon: "🍋" },
  { id: "ylang_ylang", name: "Ylang Ylang", icon: "🌺" },
  { id: "cypress", name: "Cypress", icon: "🌳" },
  { id: "jazmin", name: "Jazmín", icon: "🌻" },
  { id: "melissa", name: "Melissa", icon: "🍃" },
  { id: "eucalipto", name: "Eucalipto", icon: "🌱" },
  { id: "bergamota", name: "Bergamota", icon: "🍊" },
  { id: "neroli", name: "Neroli", icon: "✨" },
  { id: "hierba_buena", name: "Hierba buena", icon: "🟢" },
];

const INCOMPAT = [
  ["vainilla_francesa", "citronella"],
  ["eucalipto", "patchouli"],
  ["pino", "mix_berries"],
  ["ylang_ylang", "eucalipto"],
  ["mirra", "manzana_verde"],
  ["neroli", "pino"],
];

const isCompat = (a: string, b: string) =>
  !INCOMPAT.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a)
  );

const QS = [
  {
    q: "¿Qué ambiente te hace sentir más en casa?",
    opts: [
      {
        label: "Bosque y tierra",
        desc: "Naturaleza profunda",
        icon: "🌿",
        ar: ["vetiver", "patchouli", "pino", "cypress", "sandalo"],
      },
      {
        label: "Dulce y cálido",
        desc: "Hogar acogedor",
        icon: "🕯️",
        ar: ["vainilla_francesa", "vainilla_amaderada", "canela", "jengibre"],
      },
      {
        label: "Floral y delicado",
        desc: "Jardín en flor",
        icon: "🌸",
        ar: ["lavanda", "geranio", "jazmin", "flor_de_azahar", "orquidea"],
      },
      {
        label: "Fresco y limpio",
        desc: "Brisa y claridad",
        icon: "💨",
        ar: ["te_blanco", "eucalipto", "hierba_buena", "melissa", "limon_persa"],
      },
    ],
  },
  {
    q: "¿Cuál es tu momento favorito del día?",
    opts: [
      {
        label: "Mañana tranquila",
        desc: "Café y calma",
        icon: "☀️",
        ar: ["te_blanco", "bergamota", "limon_persa", "neroli", "melissa"],
      },
      {
        label: "Tarde creativa",
        desc: "Energía y enfoque",
        icon: "🎨",
        ar: ["eucalipto", "manzana_verde", "mix_berries", "maracuya", "hierba_buena"],
      },
      {
        label: "Noche íntima",
        desc: "Velas y silencio",
        icon: "🌙",
        ar: ["ylang_ylang", "sandalo", "incienso", "mirra", "vainilla_francesa"],
      },
      {
        label: "Fin de semana",
        desc: "Relajación total",
        icon: "🛋️",
        ar: ["lavanda", "vainilla_amaderada", "canela", "patchouli", "geranio"],
      },
    ],
  },
  {
    q: "¿Qué sensación buscas en un aroma?",
    opts: [
      {
        label: "Calidez y abrazo",
        desc: "Que te envuelva",
        icon: "🤗",
        ar: ["sandalo", "vainilla_francesa", "canela", "vetiver", "patchouli"],
      },
      {
        label: "Frescura y energía",
        desc: "Que despeje la mente",
        icon: "⚡",
        ar: ["eucalipto", "limon_persa", "hierba_buena", "bergamota", "melissa"],
      },
      {
        label: "Romance y misterio",
        desc: "Sensual y profundo",
        icon: "🌹",
        ar: ["ylang_ylang", "jazmin", "orquidea", "mirra", "incienso"],
      },
      {
        label: "Paz y equilibrio",
        desc: "Suave y sereno",
        icon: "🧘",
        ar: ["lavanda", "te_blanco", "neroli", "flor_de_azahar", "melissa"],
      },
    ],
  },
  {
    q: "¿En qué lugar te gusta más relajarte?",
    opts: [
      {
        label: "El baño",
        desc: "Ducha larga, calma total",
        icon: "🛁",
        ar: ["eucalipto", "lavanda", "te_blanco", "bergamota", "neroli"],
      },
      {
        label: "El dormitorio",
        desc: "Silencio y descanso",
        icon: "🛏️",
        ar: ["sandalo", "ylang_ylang", "vainilla_francesa", "mirra", "lavanda"],
      },
      {
        label: "La sala",
        desc: "Sofá y buena compañía",
        icon: "🏡",
        ar: ["canela", "vainilla_amaderada", "pino", "cypress", "incienso"],
      },
      {
        label: "Al aire libre",
        desc: "Naturaleza y espacio",
        icon: "🌿",
        ar: ["melissa", "te_blanco", "bergamota", "limon_persa", "hierba_buena"],
      },
    ],
  },
  {
    q: "Si fueras un aroma, ¿cuál serías?",
    opts: [
      {
        label: "Dulce y tentador",
        desc: "Irresistible",
        icon: "🍯",
        ar: ["vainilla_francesa", "vainilla_amaderada", "jengibre", "canela", "mix_berries"],
      },
      {
        label: "Terroso y confiable",
        desc: "Firme y seguro",
        icon: "🪨",
        ar: ["vetiver", "patchouli", "sandalo", "cypress", "incienso"],
      },
      {
        label: "Ligero y juguetón",
        desc: "Espontáneo",
        icon: "🌬️",
        ar: ["maracuya", "manzana_verde", "bergamota", "limon_persa", "neroli"],
      },
      {
        label: "Floral e intenso",
        desc: "Apasionado",
        icon: "🌺",
        ar: ["ylang_ylang", "geranio", "jazmin", "orquidea", "flor_de_azahar"],
      },
    ],
  },
  {
    q: "¿Cómo se describirían como pareja?",
    opts: [
      {
        label: "Aventureros",
        desc: "Siempre explorando",
        icon: "🌍",
        ar: ["maracuya", "mix_berries", "manzana_verde", "pino", "cypress"],
      },
      {
        label: "Románticos",
        desc: "Detalles y momentos",
        icon: "💕",
        ar: ["jazmin", "orquidea", "ylang_ylang", "neroli", "flor_de_azahar"],
      },
      {
        label: "Hogareños",
        desc: "El hogar es su mundo",
        icon: "🏠",
        ar: ["vainilla_francesa", "canela", "sandalo", "incienso", "patchouli"],
      },
      {
        label: "Libres y frescos",
        desc: "Sin complicaciones",
        icon: "🌊",
        ar: ["eucalipto", "bergamota", "hierba_buena", "te_blanco", "melissa"],
      },
    ],
  },
];

const CATS: Record<string, string[]> = {
  Amaderados: ["vetiver", "sandalo", "pino", "cypress", "patchouli"],
  Florales: ["lavanda", "geranio", "jazmin", "flor_de_azahar", "orquidea", "ylang_ylang", "neroli"],
  Dulces: ["vainilla_francesa", "vainilla_amaderada", "canela", "jengibre"],
  Frescos: ["te_blanco", "eucalipto", "hierba_buena", "melissa", "limon_persa", "bergamota", "maracuya", "manzana_verde", "mix_berries"],
  Resinosos: ["incienso", "mirra"],
};

const CAT_DESC: Record<string, string> = {
  Amaderados: "los aromas profundos y cálidos de la tierra",
  Florales: "lo floral, delicado y sensorial",
  Dulces: "lo cálido y reconfortante",
  Frescos: "la frescura y la energía",
  Resinosos: "lo místico y profundo",
};

// Types
type Phase = "intro" | "names" | "quiz" | "message" | "result";

type Result = {
  aromas: string[];
  matchPct: number;
  wax: string;
  wick: string;
  jar: string;
  price: number;
  t1: string[];
  t2: string[];
  common: string[];
};

// Helper functions
function stepQP(step: number) {
  return { q: Math.floor(step / 2), p: (step % 2) + 1 };
}

function getScores(ans: Record<number, string[][]>) {
  const sc: Record<string, number> = {};
  AROMAS.forEach((a) => (sc[a.id] = 0));
  Object.values(ans).forEach((arList) => {
    if (!Array.isArray(arList)) return;
    arList.forEach((list) => {
      if (!Array.isArray(list)) return;
      list.forEach((id, i) => {
        if (id in sc) sc[id] += list.length - i;
      });
    });
  });
  return sc;
}

function topN(sc: Record<string, number>, n = 8): string[] {
  return Object.entries(sc)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id]) => id);
}

function mainCat(topIds: string[]) {
  let best = "";
  let bestN = 0;
  Object.entries(CATS).forEach(([c, ids]) => {
    const n = topIds.filter((id) => ids.includes(id)).length;
    if (n > bestN) {
      bestN = n;
      best = c;
    }
  });
  return best;
}

// Determines wax, wick, and jar from quiz answers
// Q indices (0-based): 0=ambiente, 1=momento, 2=sensación, 3=lugar, 4=personalidad, 5=pareja
// Option indices per question: see QS definition above
function buildConfig(selIdx: Record<number, (number | undefined)[]>, dominantCat: string) {
  const p1 = selIdx[1] || [];
  const p2 = selIdx[2] || [];

  // WAX — based on dominant aroma family
  let wax: string;
  let waxPrice: number;
  if (dominantCat === "Frescos") {
    wax = "Cera de Soya"; waxPrice = 0;
  } else if (dominantCat === "Florales" || dominantCat === "Dulces") {
    wax = "Cera de Coco"; waxPrice = 5;
  } else {
    // Amaderados, Resinosos, mixed
    wax = "Soya + Coco"; waxPrice = 2;
  }

  // WICK — wood wick for intimate/romantic couples, eco otherwise
  // Q2=2 → noche íntima, Q3=2 → romance y misterio, Q6=1 → románticos
  let romanticScore = 0;
  if (p1[1] === 2) romanticScore += 2;
  if (p2[1] === 2) romanticScore += 2;
  if (p1[2] === 2) romanticScore += 2;
  if (p2[2] === 2) romanticScore += 2;
  if (p1[5] === 1) romanticScore += 1;
  if (p2[5] === 1) romanticScore += 1;

  const wick = romanticScore >= 3 ? "Mecha de Madera" : "Mecha Eco";
  const wickPrice = romanticScore >= 3 ? 17 : 12;

  // JAR — ceramic for romantic/bedroom, amber for homey/sala, glass for outdoors/adventurous
  let ceramicScore = 0, amberScore = 0, glassScore = 0;

  if (p1[3] === 1) ceramicScore += 2; // dormitorio
  if (p2[3] === 1) ceramicScore += 2;
  if (p1[5] === 1) ceramicScore += 2; // románticos
  if (p2[5] === 1) ceramicScore += 2;

  if (p1[3] === 2) amberScore += 2; // sala
  if (p2[3] === 2) amberScore += 2;
  if (p1[5] === 2) amberScore += 2; // hogareños
  if (p2[5] === 2) amberScore += 2;

  if (p1[3] === 3) glassScore += 2; // al aire libre
  if (p2[3] === 3) glassScore += 2;
  if (p1[5] === 0) glassScore += 1; // aventureros
  if (p2[5] === 0) glassScore += 1;
  if (p1[5] === 3) glassScore += 1; // libres y frescos
  if (p2[5] === 3) glassScore += 1;

  let jar: string;
  let jarPrice: number;
  if (ceramicScore > 0 && ceramicScore >= amberScore && ceramicScore >= glassScore) {
    jar = "Frasco de Cerámica"; jarPrice = 18;
  } else if (glassScore > 0 && glassScore >= amberScore) {
    jar = "Frasco de Vidrio"; jarPrice = 10;
  } else {
    jar = "Frasco Ámbar"; jarPrice = 10;
  }

  return { wax, waxPrice, wick, wickPrice, jar, jarPrice };
}

function buildResult(ans: Record<number, string[][]>, selIdx: Record<number, (number | undefined)[]>): Result {
  const allAromas = AROMAS.reduce((acc, a) => ({ ...acc, [a.id]: 0 }), {} as Record<string, number>);

  const s1Correct: Record<string, number> = { ...allAromas };
  const s2Correct: Record<string, number> = { ...allAromas };

  ans[1]?.forEach((list) => {
    list.forEach((id, i) => {
      if (id in s1Correct) s1Correct[id] += list.length - i;
    });
  });

  ans[2]?.forEach((list) => {
    list.forEach((id, i) => {
      if (id in s2Correct) s2Correct[id] += list.length - i;
    });
  });

  const t1 = topN(s1Correct, 6);
  const t2 = topN(s2Correct, 6);
  const set1 = new Set(t1);
  const common = t2.filter((id) => set1.has(id));

  const filtered: string[] = [];
  for (const id of common.slice(0, 3)) {
    if (filtered.every((x) => isCompat(x, id))) filtered.push(id);
  }

  if (!filtered.length) {
    const comb: Record<string, number> = {};
    AROMAS.forEach((a) => {
      comb[a.id] = (s1Correct[a.id] || 0) + (s2Correct[a.id] || 0);
    });
    const best = Object.entries(comb)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);
    for (const id of best) {
      if (filtered.every((x) => isCompat(x, id))) filtered.push(id);
      if (filtered.length === 2) break;
    }
  }

  // Calcular compatibilidad de manera más positiva
  // Base: respuestas iguales + aromas comunes + categoría compartida
  const sameQ = selIdx[1].filter((v, i) => v !== undefined && v === selIdx[2][i]).length;
  const basePct = 60; // Mínimo nunca baja de 60%
  const commonBonus = common.length * 8; // +8% por cada aroma en común
  const sameQBono = sameQ * 5; // +5% por cada pregunta respondida igual
  const matchPct = Math.min(98, basePct + commonBonus + sameQBono);

  const dominantCat = mainCat([...t1, ...t2]);
  const config = buildConfig(selIdx, dominantCat);

  return {
    aromas: filtered,
    matchPct,
    wax: config.wax,
    wick: config.wick,
    jar: config.jar,
    price: 20 + (filtered.length - 1) * 5 + 3 + config.waxPrice + config.wickPrice + config.jarPrice,
    t1,
    t2,
    common,
  };
}

function getAroma(id: string) {
  const found = AROMAS.find((a) => a.id === id);
  return found || { id, name: id, icon: "🌿" };
}

function buildMessageLines(res: Result, selIdx: Record<number, (number | undefined)[]>, name1: string, name2: string) {
  const { t1, t2, common } = res;
  const c1 = mainCat(t1);
  const c2 = mainCat(t2);

  const sameQ = selIdx[1].filter((v, i) => v !== undefined && v === selIdx[2][i]).length;
  const lines: string[] = [];

  if (sameQ >= 5)
    lines.push(
      "Sus respuestas fueron casi idénticas — comparten una forma de sentir y vivir el mundo que pocas parejas tienen."
    );
  else if (sameQ >= 3)
    lines.push(
      `Tienen bastante en común: eligieron igual en ${sameQ} de las ${QS.length} preguntas. Hay una sintonía real entre los dos.`
    );
  else if (sameQ >= 1)
    lines.push(
      `Son distintos en muchas cosas, pero eso los complementa — encontramos ${sameQ} coincidencia${sameQ > 1 ? "s" : ""} clave entre ustedes.`
    );
  else
    lines.push("Sus perspectivas son bastante distintas, y eso los hace más interesantes el uno para el otro.");

  if (c1 === c2) {
    lines.push(
      `Los dos se inclinan naturalmente hacia ${CAT_DESC[c1]} — comparten una misma energía sensorial sin haberse puesto de acuerdo.`
    );
  } else {
    lines.push(
      `${name1} se inclina hacia ${CAT_DESC[c1]}, mientras ${name2} prefiere ${CAT_DESC[c2]}. Son distintos, y esa diferencia crea algo más rico juntos.`
    );
  }

  if (common.length >= 2) {
    const names = common
      .slice(0, 2)
      .map((id) => {
        const a = getAroma(id);
        return `${a.icon} ${a.name}`;
      })
      .join(" y ");
    lines.push(`Hay aromas que ambos eligieron de forma independiente: ${names}. Eso no es casualidad — es lo que tienen en común en el fondo.`);
  } else if (common.length === 1) {
    const a = getAroma(common[0]);
    lines.push(`Encontramos un aroma en común: ${a.icon} ${a.name}. Es pequeño, pero dice mucho de lo que comparten.`);
  } else {
    lines.push("Sus aromas favoritos no se repiten — pero eso significa que juntos pueden crear algo que ninguno elegiría solo.");
  }

  lines.push("Juntos forman algo que ninguno formaría solo.");
  return lines;
}

function buildWALink(res: Result) {
  const arList = res.aromas.map((id) => getAroma(id).name).join(", ");
  const msg = `Hola! Acabo de hacer el test de pareja en Maritana y quisiera pedir esta vela personalizada para nosotros.\n\nAromas: ${arList}\nCera: ${res.wax}\nMecha: ${res.wick}\nFrasco: ${res.jar}\nPrecio: S/ ${res.price}\n\nMe pueden ayudar a pedirla?`;
  return `https://wa.me/51999132002?text=${encodeURIComponent(msg)}`;
}

// Main Component
export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Record<number, string[][]>>({ 1: [], 2: [] });
  const [selIdx, setSelIdx] = useState<Record<number, (number | undefined)[]>>({ 1: [], 2: [] });
  const [result, setResult] = useState<Result | null>(null);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const totalSteps = QS.length * 2;
  const { q, p } = stepQP(step);
  const isLastStep = step === totalSteps - 1;
  const selI = selIdx[p]?.[q];
  const selClass = p === 1 ? "sel-p1" : "sel-p2";
  const btnClass = p === 1 ? "btn-p1" : "btn-p2";
  const bannerClass = p === 1 ? "turn-p1" : "turn-p2";
  const whoClass = p === 1 ? "turn-who-p1" : "turn-who-p2";
  const hintClass = p === 1 ? "turn-hint-p1" : "turn-hint-p2";
  const bgClass = p === 1 ? "bg-cream" : "bg-peach";

  const pct = Math.round((step / totalSteps) * 100);

  const startQuiz = () => {
    setPhase("names");
  };

  const startNames = () => {
    setPhase("quiz");
    setStep(0);
  };

  const pick = (i: number) => {
    setAns((prev) => ({
      ...prev,
      [p]: prev[p].map((arr, idx) => (idx === q ? QS[q].opts[i].ar : arr)),
    }));
    setSelIdx((prev) => ({
      ...prev,
      [p]: prev[p].map((v, idx) => (idx === q ? i : v)),
    }));
  };

  const goFwd = () => {
    if (selI === undefined) return;
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      const res = buildResult(ans, selIdx);
      setResult(res);
      setPhase("message");
    }
  };

  const goBack = () => {
    if (phase === "message") {
      setPhase("quiz");
      setStep(QS.length * 2 - 1);
    } else if (phase === "result") {
      setPhase("message");
    } else if (phase === "names") {
      setPhase("intro");
    } else if (step > 0) {
      setStep((s) => s - 1);
    } else {
      setPhase("names");
    }
  };

  const goToResult = () => {
    setPhase("result");
  };

  useEffect(() => {
    if (phase === "result") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [phase]);

  const restart = () => {
    setPhase("intro");
    setStep(0);
    setAns({ 1: [], 2: [] });
    setSelIdx({ 1: [], 2: [] });
    setResult(null);
    setName1("");
    setName2("");
    setEmail("");
    setEmailStatus("");
  };

  const sendEmail = async () => {
    if (!email || !email.includes("@")) {
      setEmailStatus("Ingresa un correo válido.");
      return;
    }
    if (!result) return;

    setEmailLoading(true);
    setEmailStatus("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          result,
          selIdx,
          names: { name1, name2 },
          messages: buildMessageLines(result, selIdx, name1, name2),
        }),
      });

      if (res.ok) {
        setEmailStatus("¡Listo! Revisa tu correo.");
      } else {
        setEmailStatus("Error al enviar. Intenta de nuevo.");
      }
    } catch {
      setEmailStatus("Error de conexión. Intenta de nuevo.");
    } finally {
      setEmailLoading(false);
    }
  };

  // Initialize arrays on mount
  useEffect(() => {
    if (phase === "quiz" && selIdx[1].length === 0) {
      setSelIdx({
        1: new Array(QS.length).fill(undefined),
        2: new Array(QS.length).fill(undefined),
      });
      setAns({
        1: new Array(QS.length).fill([]),
        2: new Array(QS.length).fill([]),
      });
    }
  }, [phase]);

  // Render intro
  if (phase === "intro") {
    return (
      <div className="screen bg-cream fade">
        <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
          <Image src="/images/maritana_logo_nobg.png" alt="Maritana" width={200} height={50} style={{ height: 50, width: "auto", marginBottom: 8 }} />
          <div style={{ fontSize: 44, margin: "2rem 0 1rem" }}>🕯️</div>
          <div
            style={{
              fontFamily: "var(--font-prata), serif",
              fontSize: 24,
              color: "#3D3D3D",
              marginBottom: 14,
              lineHeight: 1.4,
            }}
          >
            ¿Cuál es el aroma<br />de su amor?
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#666",
              lineHeight: 1.75,
              marginBottom: 8,
              padding: "0 0.5rem",
            }}
          >
            Respondan juntos, pregunta por pregunta. Primero una persona, luego la otra. Al final
            descubren su compatibilidad como pareja y cómo se complementan aromáticamente.
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#aaa",
              marginBottom: "2.5rem",
              padding: "0 0.5rem",
            }}
          >
            Y también tendrán una sugerencia de vela personalizada que les encantará a los dos.
          </div>
          <button
            className="btn-next btn-p1"
            style={{ width: "100%", padding: 15, fontSize: 15, borderRadius: 10 }}
            onClick={startQuiz}
          >
            Comenzar
          </button>
        </div>
      </div>
    );
  }

  // Render names
  if (phase === "names") {
    const canContinue = name1.trim().length > 0 && name2.trim().length > 0;
    return (
      <div className="screen bg-cream fade">
        <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
          <Image src="/images/maritana_logo_nobg.png" alt="Maritana" width={200} height={50} style={{ height: 50, width: "auto", display: "block", margin: "0 auto 8px" }} />
          <div style={{ fontSize: 36, margin: "1.5rem 0 0.75rem" }}>💑</div>
          <div
            style={{
              fontFamily: "var(--font-prata), serif",
              fontSize: 22,
              color: "#3D3D3D",
              marginBottom: 10,
              lineHeight: 1.4,
            }}
          >
            ¿Cómo se llaman?
          </div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: "1.75rem", padding: "0 0.5rem" }}>
            Así podemos hablarles por su nombre durante el test.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: "1.5rem", textAlign: "left" }}>
            <div>
              <label style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#aaa", display: "block", marginBottom: 6 }}>
                Persona 1
              </label>
              <input
                className="name-input"
                type="text"
                placeholder="Nombre..."
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canContinue && startNames()}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#aaa", display: "block", marginBottom: 6 }}>
                Persona 2
              </label>
              <input
                className="name-input"
                type="text"
                placeholder="Nombre..."
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canContinue && startNames()}
              />
            </div>
          </div>
          <button
            className="btn-next btn-p1"
            style={{ width: "100%", padding: 15, fontSize: 15, borderRadius: 10 }}
            disabled={!canContinue}
            onClick={startNames}
          >
            Comenzar test →
          </button>
          <button className="btn-back" style={{ width: "100%", marginTop: 10 }} onClick={() => setPhase("intro")}>
            ← Atrás
          </button>
        </div>
      </div>
    );
  }

  // Render quiz
  if (phase === "quiz") {
    return (
      <div className={`screen ${bgClass} fade`}>
        <div className="card" style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <Image src="/images/maritana_logo_nobg.png" alt="Maritana" width={240} height={60} style={{ height: 60, width: "auto", display: "block", margin: "0 auto" }} />
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
          </div>
          <div className={`turn-banner ${bannerClass}`}>
            <div className={`turn-who ${whoClass}`}>
              {p === 1 ? `👤 ${name1} — es tu turno` : `👤 ${name2} — es tu turno`}
            </div>
            <div className={`turn-hint ${hintClass}`}>
              {p === 1 ? (
                <>
                  Elige la opción que más te representa a <strong>ti</strong>. {name2} responderá esta misma pregunta después.
                </>
              ) : (
                <>
                  Ahora responde <strong>tú</strong>, {name2}. Elige sin ver lo que eligió {name1}.
                </>
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#bbb",
              marginBottom: 8,
            }}
          >
            Pregunta {q + 1} de {QS.length}
          </div>
          <div className="q-text">{QS[q].q}</div>
          <div className="opts">
            {QS[q].opts.map((opt, i) => (
              <button
                key={i}
                className={`opt ${selI === i ? selClass : ""}`}
                onClick={() => pick(i)}
              >
                <span className="opt-icon">{opt.icon}</span>
                <span className="opt-lbl">{opt.label}</span>
                <span className="opt-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
          <div className="nav">
            <button className="btn-back" onClick={goBack}>
              ← Atrás
            </button>
            <button
              className={`btn-next ${btnClass}`}
              disabled={selI === undefined}
              onClick={goFwd}
            >
              {isLastStep
                ? "Ver resultado 🕯️"
                : p === 1
                ? `Listo, pásale a ${name2} →`
                : "Siguiente pregunta →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render message
  if (phase === "message" && result) {
    const lines = buildMessageLines(result, selIdx, name1, name2);
    return (
      <div className="screen bg-cream fade">
        <div className="card" style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <Image src="/images/maritana_logo_nobg.png" alt="Maritana" width={160} height={40} style={{ height: 40, width: "auto" }} />
          </div>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🌿</div>
            <div
              style={{
                fontFamily: "var(--font-prata), serif",
                fontSize: 22,
                color: "#3D3D3D",
                lineHeight: 1.4,
              }}
            >
              Lo que encontramos<br />en {name1} y {name2}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: "2rem" }}>
            {lines.map((l, i) => (
              <div
                key={i}
                style={{
                  background: "#f9f7f3",
                  borderLeft: "3px solid #c0dd97",
                  borderRadius: "0 10px 10px 0",
                  padding: "13px 16px",
                  fontSize: 14,
                  color: "#3D3D3D",
                  lineHeight: 1.65,
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <button
            className="btn-next btn-green"
            style={{ width: "100%", padding: 15, fontSize: 14, borderRadius: 10 }}
            onClick={goToResult}
          >
            Revelar compatibilidad aromática 🕯️
          </button>
        </div>
      </div>
    );
  }

  // Render result
  if (phase === "result" && result) {
    const aList = result.aromas.map((id) => getAroma(id));
    const waUrl = buildWALink(result);

    return (
      <div className="screen bg-cream fade">
        <div className="card" style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <Image src="/images/maritana_logo_nobg.png" alt="Maritana" width={240} height={60} style={{ height: 60, width: "auto", display: "block", margin: "0 auto 8px" }} />
            <div className="logo-sub">su vela de pareja</div>
          </div>

          <ResultAnimation result={result} />

          <hr className="divider" />
          <div
            style={{
              fontFamily: "var(--font-prata), serif",
              fontSize: 19,
              color: "#3D3D3D",
              marginBottom: 6,
            }}
          >
            Su vela perfecta
          </div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: "1.25rem", lineHeight: 1.6 }}>
            Una mezcla creada con los aromas que representan a {name1} y {name2} juntos.
          </div>

          <div className="section-label">Aromas</div>
          <div className="chips-row">
            {aList.map((a) => (
              <span key={a.id} className="chip chip-aroma">
                {a.icon} {a.name}
              </span>
            ))}
          </div>

          <div className="section-label">Configuración base</div>
          <div className="chips-row">
            <span className="chip chip-cfg">🌱 {result.wax}</span>
            <span className="chip chip-cfg">🔥 {result.wick}</span>
            <span className="chip chip-cfg">🫙 {result.jar}</span>
          </div>

          <div className="price-row">
            <span className="price-label">Precio</span>
            <span className="price-val">S/ {result.price}</span>
          </div>

          <hr className="divider" />
          <a href={waUrl} target="_blank" className="cta-wa">
            Pedir por WhatsApp
          </a>
          <hr className="divider" />

          <div
            style={{
              fontFamily: "var(--font-prata), serif",
              fontSize: 15,
              color: "#3D3D3D",
              marginBottom: 6,
            }}
          >
            Guarda tu resultado
          </div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 12, lineHeight: 1.5 }}>
            Recibe los detalles de su vela en tu correo.
          </div>

          <div className="email-form">
            <input
              type="email"
              placeholder="tu@correo.com"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="email-btn"
              onClick={sendEmail}
              disabled={emailLoading}
            >
              {emailLoading ? "Enviando..." : "Enviar"}
            </button>
          </div>
          <div
            className="email-status"
            style={{ color: emailStatus.includes("¡Listo") ? "#407645" : "#c0392b" }}
          >
            {emailStatus}
          </div>

          <button className="cta-restart" onClick={restart}>
            Hacer el test de nuevo
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// Animated result component
function ResultAnimation({ result }: { result: Result }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let c = 0;
    const target = result.matchPct;
    const tick = () => {
      c = Math.min(c + 2, target);
      setPct(c);
      if (c < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [result.matchPct]);

  return (
    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      <div
        style={{ fontSize: 52, fontWeight: 500, color: "#407645", lineHeight: 1 }}
      >
        {pct}%
      </div>
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#aaa",
          marginTop: 4,
        }}
      >
        compatibilidad aromática
      </div>
      <div className="match-bar-wrap" style={{ marginTop: 12 }}>
        <div className="match-bar-fill" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}
