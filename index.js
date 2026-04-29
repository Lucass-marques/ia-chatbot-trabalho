const chat = document.getElementById("chat");
const input = document.getElementById("pergunta");
const displayName = document.getElementById("display-name");

let nomeUsuario = null;
let memoria = [];

function addMsg(texto, tipo) {
  const row = document.createElement("div");
  row.className = "msg-row " + (tipo === "user" ? "user-row" : "bot-row");
  row.innerHTML = '<div class="msg-bubble">' + texto + '</div>';
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

window.onload = () => {
  addMsg("👋 Olá! Qual é o seu nome?", "bot");
};

async function enviar() {
  const texto = input.value.trim();
  if (!texto) return;

  addMsg(texto, "user");
  input.value = "";

  // 👤 Captura nome
  if (!nomeUsuario) {
    nomeUsuario = texto;
    displayName.innerText = nomeUsuario;
    input.placeholder = "Digite sua dúvida...";

    addMsg(`Prazer, <b>${nomeUsuario}</b>! 😊<br>Como posso te ajudar?`, "bot");
    return;
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
Você é um assistente educacional especializado em Tecnologia da Informação (TI).

🚫 REGRAS IMPORTANTES:
- Responda APENAS perguntas relacionadas a TI, como:
  programação, redes, sistemas, banco de dados, inteligência artificial, tecnologia, computação, etc.
- Se a pergunta NÃO for sobre TI, responda EXATAMENTE assim:

"❌ Este assistente está configurado para responder apenas dúvidas relacionadas à área de Tecnologia da Informação (TI)."

- NÃO tente responder assuntos fora de TI
- NÃO improvise respostas fora do escopo

📘 FORMATO DAS RESPOSTAS:
- Seja direto
- Use emojis para organizar:
📘 conceito
⚙️ características
💻 exemplos
🚀 vantagens

- Use HTML simples: <b>, <ul>, <li>, <br>
`
          },

          ...memoria.slice(-6),

          {
            role: "user",
            content: texto
          }
        ]
      })
    });

    const data = await res.json();

    let resposta = data?.choices?.[0]?.message?.content || "Sem resposta.";

    addMsg(resposta, "bot");

    memoria.push(
      { role: "user", content: texto },
      { role: "assistant", content: resposta }
    );

    memoria = memoria.slice(-10);

  } catch (erro) {
    console.error(erro);
    addMsg("❌ Erro ao conectar com IA.", "bot");
  }
}

input.addEventListener("keypress", e => {
  if (e.key === "Enter") enviar();
});
