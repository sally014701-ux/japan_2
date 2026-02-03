require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = "sally014701@gmail.com";

app.use(cors());
app.use(express.json());

if (!RESEND_API_KEY) {
  console.warn("RESEND_API_KEY가 설정되지 않았습니다. .env 파일에 키를 추가하세요.");
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

app.use(express.static(path.join(__dirname, "..")));

app.post("/api/contact", async (req, res) => {
  const { name, phone, email } = req.body || {};

  const nameTrim = typeof name === "string" ? name.trim() : "";
  const phoneTrim = typeof phone === "string" ? phone.trim() : "";
  const emailTrim = typeof email === "string" ? email.trim() : "";

  if (!nameTrim || !phoneTrim || !emailTrim) {
    return res.status(400).json({
      message: "이름, 전화번호, 이메일을 모두 입력해 주세요.",
    });
  }

  if (!resend) {
    return res.status(503).json({
      message: "메일 발송이 설정되지 않았습니다. RESEND_API_KEY를 확인해 주세요.",
    });
  }

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
      from: "일본어 퀴즈 <onboarding@resend.dev>",
      to: [TO_EMAIL],
      subject: `[연락하기] ${escapeHtml(nameTrim)}님`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({
        message: "메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      });
    }

    res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact send error:", err);
    res.status(500).json({
      message: "메일 발송 중 오류가 발생했습니다.",
    });
  }
});

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

app.listen(PORT, () => {
  console.log(`서버: http://localhost:${PORT}`);
  console.log(`연락 메일 수신: ${TO_EMAIL}`);
});
