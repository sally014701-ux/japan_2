import { Resend } from "resend";

const TO_EMAIL = "sally014701@g.skku.edu";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse(
      { message: "요청 형식이 올바르지 않습니다." },
      400
    );
  }

  body = body || {};
  const nameTrim = typeof body.name === "string" ? body.name.trim() : "";
  const phoneTrim = typeof body.phone === "string" ? body.phone.trim() : "";
  const emailTrim = typeof body.email === "string" ? body.email.trim() : "";

  if (!nameTrim || !phoneTrim || !emailTrim) {
    return jsonResponse({
      message: "이름, 전화번호, 이메일을 모두 입력해 주세요.",
    }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return jsonResponse({
      message: "메일 발송이 설정되지 않았습니다. RESEND_API_KEY를 확인해 주세요.",
    }, 503);
  }

  const resend = new Resend(apiKey);
  const html = `
    <h2>일본어 퀴즈 사이트 · 연락하기</h2>
    <p><strong>이름:</strong> ${escapeHtml(nameTrim)}</p>
    <p><strong>전화번호:</strong> ${escapeHtml(phoneTrim)}</p>
    <p><strong>이메일:</strong> ${escapeHtml(emailTrim)}</p>
    <hr>
    <p style="color:#666;font-size:12px;">이 메일은 일본어 단어 퀴즈 사이트 연락 폼에서 발송되었습니다.</p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "Japan Quiz <onboarding@resend.dev>",
      to: [TO_EMAIL],
      subject: `[연락하기] ${escapeHtml(nameTrim)}님`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      const msg = error?.message || "메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      return jsonResponse({ message: msg }, 500);
    }

    return jsonResponse({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact send error:", err);
    const msg = err?.message || "메일 발송 중 오류가 발생했습니다.";
    return jsonResponse({ message: msg }, 500);
  }
}
