window.onload = () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 1000);
};

const timesDiv = document.getElementById("times");
const form = document.getElementById("form");
const msg = document.getElementById("msg");
const summary = document.getElementById("summary");

let selectedTime = null;

function generateTimes() {
  timesDiv.innerHTML = "";
  for (let i = 9; i <= 18; i++) {
    let btn = document.createElement("button");
    btn.type = "button";
    btn.innerText = `${i}:00`;

    btn.onclick = () => {
      document.querySelectorAll("#times button").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedTime = btn.innerText;
      updateSummary();
    };

    timesDiv.appendChild(btn);
  }
}

generateTimes();

function updateSummary() {
  const date = document.getElementById("date").value;
  summary.innerText = `Resumo: ${date} às ${selectedTime || ""}`;
}

form.onsubmit = (e) => {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const reason = document.getElementById("reason").value;

  if (!date || !selectedTime || !name || !email || !reason) {
    msg.innerText = "Preencha tudo.";
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    msg.innerText = "Data inválida.";
    return;
  }

  let data = JSON.parse(localStorage.getItem("agendamentos") || "[]");

  data.push({
    date, time: selectedTime, name, email, phone, reason, status: "pendente"
  });

  localStorage.setItem("agendamentos", JSON.stringify(data));

  msg.innerText = "Agendado com sucesso!";
  form.reset();
};

document.getElementById("adminBtn").onclick = () => {
  document.getElementById("adminPanel").classList.toggle("hidden");
  loadAdmin();
};

function loadAdmin() {
  let data = JSON.parse(localStorage.getItem("agendamentos") || "[]");
  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach((item, i) => {
    let div = document.createElement("div");
    div.innerHTML = `
      ${item.date} ${item.time} - ${item.name} (${item.status})
      <button onclick="confirm(${i})">✔</button>
      <button onclick="removeItem(${i})">✖</button>
    `;
    list.appendChild(div);
  });
}

function confirm(i) {
  let data = JSON.parse(localStorage.getItem("agendamentos"));
  data[i].status = "confirmado";
  localStorage.setItem("agendamentos", JSON.stringify(data));
  loadAdmin();
}

function removeItem(i) {
  let data = JSON.parse(localStorage.getItem("agendamentos"));
  data.splice(i, 1);
  localStorage.setItem("agendamentos", JSON.stringify(data));
  loadAdmin();
}
