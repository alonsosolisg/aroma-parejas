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
  messages?: string[];
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
    const { email, result, selIdx, names, messages }: QuizData = await request.json();
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
          `<span style="display:inline-block;background:#eaf3de;color:#27500a;border:1px solid #c0dd97;border-radius:99px;padding:6px 16px;font-size:13px;font-weight:500;margin:3px 3px 3px 0">${a.icon} ${a.name}</span>`
      )
      .join("");

    const messagesHtml = (messages || [])
      .map(
        (msg) =>
          `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px">
            <tr>
              <td width="4" style="background:#c0dd97;border-radius:3px;font-size:0">&nbsp;</td>
              <td style="padding:11px 14px;background:#f9f7f3;font-size:13px;color:#3D3D3D;line-height:1.65;border-radius:0 8px 8px 0">${msg}</td>
            </tr>
          </table>`
      )
      .join("");

    const barPct = result.matchPct;
    const barRemainder = 100 - barPct;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#F7F5F1;font-family:Helvetica,Arial,sans-serif;color:#3D3D3D">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F1;padding:32px 16px">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:540px">

          <!-- LOGO -->
          <tr>
            <td style="background:#fff;padding:24px 40px;text-align:center;border-radius:16px 16px 0 0;border:1px solid #e4e0d8;border-bottom:none">
              <img src="https://personaliza.maritana.pe/images/maritana_logo_nobg.png" alt="Maritana" style="height:68px;width:auto;display:block;margin:0 auto"/>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td style="background:#407645;padding:26px 40px;text-align:center;border-left:1px solid #3a6a3d;border-right:1px solid #3a6a3d">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:23px;color:#fff;line-height:1.35;letter-spacing:0.02em">El aroma de ${n1} &amp; ${n2}</div>
              <div style="font-size:11px;color:#c0dd97;margin-top:8px;letter-spacing:0.1em;text-transform:uppercase">Test de pareja &middot; Maritana</div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#fff;padding:36px 40px;border:1px solid #e4e0d8;border-top:none;border-bottom:none">

              <!-- MESSAGES -->
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#b0a898;margin-bottom:14px">Lo que encontramos en ustedes</div>
              ${messagesHtml}

              <!-- DIVIDER -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0"><tr><td style="border-top:1px solid #ece9e1;font-size:0">&nbsp;</td></tr></table>

              <!-- COMPATIBILITY -->
              <div style="text-align:center;margin-bottom:28px">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#b0a898;margin-bottom:10px">Compatibilidad aromática</div>
                <div style="font-size:58px;font-weight:700;color:#407645;line-height:1;letter-spacing:-0.02em">${barPct}%</div>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-radius:99px;background:#eef5e8;height:8px">
                  <tr>
                    <td width="${barPct}%" style="background:#407645;border-radius:99px;height:8px;font-size:0">&nbsp;</td>
                    <td width="${barRemainder}%" style="font-size:0">&nbsp;</td>
                  </tr>
                </table>
              </div>

              <!-- DIVIDER -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px"><tr><td style="border-top:1px solid #ece9e1;font-size:0">&nbsp;</td></tr></table>

              <!-- AROMAS -->
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#b0a898;margin-bottom:12px">Sus aromas en común</div>
              <div style="margin-bottom:28px">${aromasHtml}</div>

              <!-- DIVIDER -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px"><tr><td style="border-top:1px solid #ece9e1;font-size:0">&nbsp;</td></tr></table>

              <!-- CONFIG -->
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#b0a898;margin-bottom:14px">Su vela perfecta</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px">
                <tr>
                  <td style="font-size:13px;color:#888;padding:8px 0;border-bottom:1px solid #f0ece4">🌱 Cera</td>
                  <td style="font-size:13px;color:#3D3D3D;font-weight:500;text-align:right;padding:8px 0;border-bottom:1px solid #f0ece4">${result.wax}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#888;padding:8px 0;border-bottom:1px solid #f0ece4">🔥 Mecha</td>
                  <td style="font-size:13px;color:#3D3D3D;font-weight:500;text-align:right;padding:8px 0;border-bottom:1px solid #f0ece4">${result.wick}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#888;padding:8px 0">🫙 Frasco</td>
                  <td style="font-size:13px;color:#3D3D3D;font-weight:500;text-align:right;padding:8px 0">${result.jar}</td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ec;border-radius:10px">
                <tr>
                  <td style="padding:14px 18px;font-size:13px;color:#888">Precio estimado</td>
                  <td style="padding:14px 18px;font-size:20px;font-weight:700;color:#3D3D3D;text-align:right">S/ ${result.price}</td>
                </tr>
              </table>

              <!-- DIVIDER -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0"><tr><td style="border-top:1px solid #ece9e1;font-size:0">&nbsp;</td></tr></table>

              <!-- CTAs -->
              <a href="${waUrl}" style="display:block;background:#25D366;color:#fff;text-decoration:none;border-radius:10px;padding:16px;font-size:15px;font-weight:600;text-align:center;margin-bottom:10px">Pedir por WhatsApp</a>
              <a href="https://maritana.pe/" style="display:block;background:#fff;color:#407645;text-decoration:none;border:1.5px solid #407645;border-radius:10px;padding:14px;font-size:14px;font-weight:500;text-align:center">Ver catálogo en maritana.pe</a>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f5f3ef;padding:20px 40px;text-align:center;border:1px solid #e4e0d8;border-top:none;border-radius:0 0 16px 16px">
              <div style="font-size:11px;color:#b0a898;line-height:1.8">
                Resultado generado en el test de pareja de<br>
                <strong style="color:#407645">maritana</strong>
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
      subject: `El aroma de ${n1} & ${n2} — maritana`,
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
