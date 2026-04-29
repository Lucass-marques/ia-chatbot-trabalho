const API_KEY = "sk-c041ec42a7bb45efba5ef96bf2e4ed15";

const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const button = document.getElementById("sendBtn");

let historico = [
{ role: "system", content: "Você é um assistente útil e direto." }
];

function addMessage(text, classe) {
const div = document.createElement("div");
div.className = "msg " + classe;
div.innerText = text;
chat.appendChild(div);
chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
const texto = input.value.trim();
if (!texto) return;

addMessage(texto, "user");
historico.push({ role: "user", content: texto });

input.value = "";

try {
const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Authorization": "Bearer " + API_KEY,
"Content-Type": "application/json"
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: historico
})
});

```
const data = await response.json();
const resposta = data.choices[0].message.content;

addMessage(resposta, "bot");
historico.push({ role: "assistant", content: resposta });
```

} catch (error) {
addMessage("Erro ao conectar com a IA.", "bot");
}
}

button.addEventListener("click", sendMessage);

input.addEventListener("keypress", function(e) {
if (e.key === "Enter") {
sendMessage();
}
});
