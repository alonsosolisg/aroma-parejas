import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Result = {
  aromas: string[];
  matchPct: number;
  wax: string;
  wick: string;
  jar: string;
  price: number;
};

type QuizData = {
  email: string;
  result: Result;
  selIdx: Record<number, (number | undefined)[]>;
  names?: { name1: string; name2: string };
};

const AROMAS_MAP: Record<string, { name: string; icon: string }> = {
  vetiver: { name: "Vetiver", icon: "🌾" },
  sandalo: { name: "Sándalo", icon: "🪵" },
  vainilla_francesa: { name: "Vainilla francesa", icon: "🍨" },
  vainilla_amaderada: { name: "Vainilla amaderada", icon: "🍦" },
  te_blanco: { name: "Té blanco", icon: "🫖" },
  maracuya: { name: "Maracuyá", icon: "🥭" },
  flor_de_azahar: { name: "Flor de azahar", icon: "🌼" },
  orquidea: { name: "Orquídea", icon: "🏵️" },
  mix_berries: { name: "Mix berries", icon: "🫐" },
  manzana_verde: { name: "Manzana verde", icon: "🍏" },
  incienso: { name: "Incienso", icon: "🕯️" },
  jengibre: { name: "Jengibre", icon: "🫚" },
  canela: { name: "Canela", icon: "🌶️" },
  pino: { name: "Pino", icon: "🌲" },
  lavanda: { name: "Lavanda", icon: "💜" },
  geranio: { name: "Geranio", icon: "🌸" },
  patchouli: { name: "Patchouli", icon: "🍂" },
  mirra: { name: "Mirra", icon: "🪔" },
  limon_persa: { name: "Limón persa", icon: "🍋" },
  ylang_ylang: { name: "Ylang Ylang", icon: "🌺" },
  cypress: { name: "Cypress", icon: "🌳" },
  jazmin: { name: "Jazmín", icon: "🌻" },
  melissa: { name: "Melissa", icon: "🍃" },
  eucalipto: { name: "Eucalipto", icon: "🌱" },
  bergamota: { name: "Bergamota", icon: "🍊" },
  neroli: { name: "Neroli", icon: "✨" },
  hierba_buena: { name: "Hierba buena", icon: "🟢" },
};

const QS = [
  { q: "¿Qué ambiente te hace sentir más en casa?" },
  { q: "¿Cuál es tu momento favorito del día?" },
  { q: "¿Qué sensación buscas en un aroma?" },
  { q: "¿En qué lugar te gusta más relajarte?" },
  { q: "Si fueras un aroma, ¿cuál serías?" },
  { q: "¿Cómo se describirían como pareja?" },
];

const OPT_LABELS = [
  ["Bosque y tierra", "Dulce y cálido", "Floral y delicado", "Fresco y limpio"],
  ["Mañana tranquila", "Tarde creativa", "Noche íntima", "Fin de semana"],
  ["Calidez y abrazo", "Frescura y energía", "Romance y misterio", "Paz y equilibrio"],
  ["El baño", "El dormitorio", "La sala", "Al aire libre"],
  ["Dulce y tentador", "Terroso y confiable", "Ligero y juguetón", "Floral e intenso"],
  ["Aventureros", "Románticos", "Hogareños", "Libres y frescos"],
];

function getAroma(id: string) {
  return AROMAS_MAP[id] || { name: id, icon: "🌿" };
}

function buildWALink(res: Result) {
  const arList = res.aromas.map((id) => getAroma(id).name).join(", ");
  const msg = `Hola! Acabo de hacer el test de pareja en Maritana y quisiera pedir esta vela personalizada para nosotros.\n\nAromas: ${arList}\nCera: ${res.wax}\nMecha: ${res.wick}\nFrasco: ${res.jar}\nPrecio: S/ ${res.price}\n\nMe pueden ayudar a pedirla?`;
  return `https://wa.me/51999132002?text=${encodeURIComponent(msg)}`;
}

export async function POST(request: Request) {
  try {
    const { email, result, selIdx, names }: QuizData = await request.json();
    const n1 = names?.name1 || "Persona 1";
    const n2 = names?.name2 || "Persona 2";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: "Faltan datos del resultado" }, { status: 400 });
    }

    const INTERNAL_EMAIL = "maritanacontacto@gmail.com";

    // Create transporter using Gmail App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // --- Enviar email al cliente ---
    const aList: { name: string; icon: string }[] = result.aromas.map((id: string) => getAroma(id));
    const waUrl = buildWALink(result);
    const aromasHtml = aList
      .map(
        (a: { name: string; icon: string }) =>
          `<span style="display:inline-block;background:#eaf3de;color:#27500a;border:1px solid #c0dd97;border-radius:99px;padding:5px 14px;font-size:13px;font-weight:500;margin:3px">${a.icon} ${a.name}</span>`
      )
      .join("");

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
</head>
<body style="margin:0;padding:0;background:#FDFBF7;font-family:'Montserrat',Helvetica,Arial,sans-serif;color:#3D3D3D">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFBF7;padding:40px 20px">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#fff;border:1px solid #e4e0d8;border-radius:16px;overflow:hidden">
          <tr>
            <td style="background:#407645;padding:32px 40px;text-align:center">
              <div style="font-family:Georgia,serif;font-size:28px;letter-spacing:0.12em;color:#fff">maritana</div>
              <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c0dd97;margin-top:6px">velas artesanales</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px">
              <div style="font-family:Georgia,serif;font-size:22px;color:#3D3D3D;margin-bottom:8px;line-height:1.4">El aroma de su amor</div>
              <div style="font-size:13px;color:#888;margin-bottom:28px;line-height:1.6">Aquí están los resultados del test de pareja que realizaron juntos.</div>
              <div style="background:#f9f7f3;border-radius:12px;padding:20px 24px;margin-bottom:24px">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#aaa;margin-bottom:4px">Compatibilidad aromática</div>
                <div style="font-size:44px;font-weight:600;color:#407645;line-height:1">${result.matchPct}%</div>
              </div>
              <div style="margin-bottom:20px">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#aaa;margin-bottom:10px">Sus aromas en común</div>
                <div>${aromasHtml}</div>
              </div>
              <div style="border-top:1px solid #e8e4da;padding-top:18px;margin-bottom:24px">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#aaa;margin-bottom:10px">Configuración base</div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13px;color:#3D3D3D;padding:4px 0">🌱 Cera</td>
                    <td style="font-size:13px;color:#666;text-align:right;padding:4px 0">${result.wax}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#3D3D3D;padding:4px 0">🔥 Mecha</td>
                    <td style="font-size:13px;color:#666;text-align:right;padding:4px 0">${result.wick}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#3D3D3D;padding:4px 0">🫙 Frasco</td>
                    <td style="font-size:13px;color:#666;text-align:right;padding:4px 0">${result.jar}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;font-weight:600;color:#3D3D3D;padding-top:12px;border-top:1px solid #e8e4da">Precio</td>
                    <td style="font-size:18px;font-weight:600;color:#3D3D3D;text-align:right;padding-top:12px;border-top:1px solid #e8e4da">S/ ${result.price}</td>
                  </tr>
                </table>
              </div>
              <a href="${waUrl}" style="display:block;background:#25D366;color:#fff;text-decoration:none;border-radius:10px;padding:16px;font-size:15px;font-weight:500;text-align:center;margin-bottom:12px">Pedir por WhatsApp</a>
              <a href="https://personaliza.maritana.pe/" style="display:block;background:#fff;color:#407645;text-decoration:none;border:1.5px solid #407645;border-radius:10px;padding:14px;font-size:14px;font-weight:500;text-align:center">Personalizar en maritana.pe</a>
            </td>
          </tr>
          <tr>
            <td style="background:#f5f3ef;padding:20px 40px;text-align:center;border-top:1px solid #e8e4da">
              <div style="font-size:11px;color:#aaa;line-height:1.7">
                Resultado generado en el test de pareja de<br>
                <strong style="color:#407645">maritana velas artesanales</strong>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Maritana" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Su vela de pareja — maritana",
      html: htmlContent,
    });

    // --- Enviar email interno con las respuestas ---
    if (selIdx) {
      let respuestasHtml = "";

      for (let i = 0; i < QS.length; i++) {
        const p1Choice = selIdx[1]?.[i];
        const p2Choice = selIdx[2]?.[i];

        const p1Label = p1Choice !== undefined ? OPT_LABELS[i][p1Choice] : "-";
        const p2Label = p2Choice !== undefined ? OPT_LABELS[i][p2Choice] : "-";

        respuestasHtml += `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee;font-size:13px;color:#3D3D3D">${i + 1}. ${QS[i].q}</td>
          </tr>
          <tr>
            <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;">
              <strong>${n1}:</strong> ${p1Label}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;">
              <strong>${n2}:</strong> ${p2Label}
            </td>
          </tr>
        `;
      }

      const internalHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
</head>
<body style="margin:0;padding:0;background:#FDFBF7;font-family:'Montserrat',Helvetica,Arial,sans-serif;color:#3D3D3D">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFBF7;padding:40px 20px">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px;background:#fff;border:1px solid #e4e0d8;border-radius:16px;overflow:hidden">
          <tr>
            <td style="background:#B06A2A;padding:24px 40px;text-align:center">
              <div style="font-family:Georgia,serif;font-size:24px;letter-spacing:0.12em;color:#fff">NUEVO LEAD - TEST DE PAREJA</div>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 40px">
              <div style="font-size:14px;color:#666;margin-bottom:20px">
                <strong>Pareja:</strong> ${n1} &amp; ${n2}
              </div>
              <div style="font-size:14px;color:#666;margin-bottom:20px">
                <strong>Cliente:</strong> ${email}
              </div>
              <div style="font-size:14px;color:#666;margin-bottom:20px">
                <strong>Compatibilidad:</strong> ${result.matchPct}%
              </div>
              <div style="font-size:14px;color:#666;margin-bottom:20px">
                <strong>Aromas seleccionados:</strong> ${result.aromas.map((id) => getAroma(id).name).join(", ")}
              </div>
              <div style="font-size:14px;color:#666;margin-bottom:20px">
                <strong>Precio:</strong> S/ ${result.price}
              </div>
              <div style="font-size:14px;color:#666;margin-bottom:10px">
                <strong>Respuestas del test:</strong>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f7f3;border-radius:8px">
                ${respuestasHtml}
              </table>
              <div style="margin-top:20px">
                <a href="${waUrl}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;border-radius:8px;padding:12px 20px;font-size:14px;font-weight:500;">Ver en WhatsApp</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      await transporter.sendMail({
        from: `"Maritana" <${process.env.GMAIL_USER}>`,
        to: INTERNAL_EMAIL,
        subject: `Nuevo lead - ${n1} & ${n2} - Compatibilidad ${result.matchPct}% - ${email}`,
        html: internalHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Error al enviar el correo" },
      { status: 500 }
    );
  }
}
