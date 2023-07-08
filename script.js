let tbody = document.getElementById("tbody");
let table = document.getElementById("table");
let form = document.getElementById("form");
let modal = document.getElementById("modal");

let match_current = {};

const divTimeAzul = document.querySelectorAll(
  ".wrapper .time-inputs:nth-child(1) "
);

const timeAzul = {
  jogadores: [],
};

const timeVermelho = {
  jogadores: [],
};

document.getElementById("save-players").addEventListener("click", () => {
  const timeAzulInputs = document.querySelectorAll(
    ".wrapper .time-inputs:nth-child(1) input"
  );
  const timeVermelhoInputs = document.querySelectorAll(
    ".wrapper .time-inputs:nth-child(2) input"
  );
  // Iterando sobre os inputs do time azul e adicionando as informações aos objetos
  timeAzulInputs.forEach(function (input, index) {
    const nomeInput = input.getAttribute("name");
    const telInput = timeAzulInputs[index + 1];

    const jogador = criarJogador(input.value, telInput?.value);

    if (nomeInput.includes("jogador_nome")) {
      if (
        jogador.nome != "" &&
        jogador.telefone != "" &&
        timeAzul.jogadores.length <= 4
      ) {
        timeAzul.jogadores.push(jogador);
      }
    }
  });

  // Iterando sobre os inputs do time vermelho e adicionando as informações aos objetos
  timeVermelhoInputs.forEach(function (input, index) {
    const nomeInput = input.getAttribute("name");
    const telInput = timeVermelhoInputs[index + 1];

    const jogador = criarJogador(input.value, telInput?.value);

    if (nomeInput.includes("jogador_nome")) {
      if (
        jogador.nome != "" &&
        jogador.telefone != "" &&
        timeVermelho.jogadores.length <= 4
      ) {
        timeVermelho.jogadores.push(jogador);
      }
    }
  });

  const time_azul = timeAzul.jogadores.map(item => {
    item.confirmado = item?.confirmado == true
    return item
  })
  const time_vermelho = timeVermelho.jogadores.map(item => {
    item.confirmado = item?.confirmado == true
    return item
  })


  // Exemplo de uso: exibindo as informações dos times no console
  // console.log("Time Azul:", timeAzul);
  // console.log("Time Vermelho:", timeVermelho);
  adicionarJogadoresPartida({
    timeAzul: time_azul,
    timeVermelho: time_vermelho,
  });
  // console.log("match_current:", match_current);
});

async function adicionarJogadoresPartida(jogadores) {
  console.log("jogadores =>", jogadores);
  return await fetch(
    `http://localhost:3333/matches/${match_current.id}/attendance`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jogadores),
    }
  )
    .then((response) => response.json())
    .then((response) => {
      tbody.innerHTML = "";
      NotificationSucess("Adicionado jogadores com sucesso!");
      window.location.reload(true);
      // resetModalPlayer()
      // renderMatches();
      // remover essas duas buceta de coluand e time

      document.getElementById("modal-presenca").style.display = "none";
      // return response;
    })
    .catch((err) => {
      console.error("houve um erro ao adicionar", err);
    });
}

document.getElementById("close-modal-players").addEventListener("click", () => {
  resetModalPlayer();
  document.getElementById("modal-presenca").style.display = "none";
});

function resetModalPlayer() {
  const divTimeBlueImg = document.querySelector(
    ".time-inputs:nth-child(1) img"
  );
  const divBlue = document.querySelector(".time-inputs:nth-child(1)");
  divBlue.innerHTML = "";
  divBlue.appendChild(divTimeBlueImg);

  const divTimeRedImg = document.querySelector(".time-inputs:nth-child(2) img");
  const divTimeRed = document.querySelector(".time-inputs:nth-child(2)");
  divTimeRed.innerHTML = "";
  divTimeRed.appendChild(divTimeRedImg);

  document.getElementById("modal-presenca-h2").innerHTML =
    "Lista de presença do grupo: ";
}

function criarJogador(nome, telefone) {
  return {
    nome: nome,
    telefone: telefone,
  };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { titulo, local, date } = form.elements;
  console.log("form.elements =>", form.elements);

  let formData = {
    titulo: titulo.value,
    local: local.value,
    data: date.value.substring(0, date.value.indexOf("T")),
    hora: date.value.slice(-5),
  };
  createMatche(formData);
});

async function getMatches() {
  return await fetch("http://localhost:3333/matches")
    .then((response) => response.json())
    .then((response) => {
      return response;
    });
}

function NotificationSucess(message) {
  Toastify({
    text: message,
    duration: 1500,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      fontWeight: "bold",
      fontSize: "1.2rem",
      background: "#00b09b",
    },
    onClick: function () {},
  }).showToast();
}

async function createMatche(data) {
  console.log(data);
  return await fetch("http://localhost:3333/matches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      tbody.innerHTML = "";
      renderMatches();
      NotificationSucess("Partida criada com sucesso!");
      closeModal();
      form.reset();
      return response;
    })
    .catch((err) => {
      console.error("houve um erro ao adicionar", err);
    });
}

async function removeInput(data) {
  return await fetch(
    `http://localhost:3333/matches/${match_current.id}/attendance`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((response) => {
      console.log("response =>", response);
      NotificationSucess("Jogador removido.");
    });
}

function renderInputs(inputsTimeAzul, inputsTimeVermelho) {
  // Obtendo a referência para a div com a classe "time-inputs"
  console.log(inputsTimeAzul, inputsTimeVermelho);
  const divTimeInputs = document.querySelector(".time-inputs:nth-child(1)");
  const divTimeInputs2 = document.querySelector(".time-inputs:nth-child(2)");

  inputsTimeAzul?.forEach((input, index) => {
    console.log("input =>", input);
    // Criando a nova div
    const novaDiv = document.createElement("div");

    // Criando o label
    const label = document.createElement("label");
    label.textContent = "Jogador " + (index + 1);

    // Criando o input de nome
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.placeholder = "Nome";
    inputNome.name = "jogador_nome_" + (index + 1);
    inputNome.value = input.nome;

    // Criando o input de telefone
    const inputTelefone = document.createElement("input");
    inputTelefone.type = "text";
    inputTelefone.placeholder = "Telefone";
    inputTelefone.name = "jogador_telefone_" + (index + 1);
    inputTelefone.value = input.telefone;

    // Criando o botão de limpar
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.style.display = inputNome.value == "" ? "none" : "block";
    btnRemover.classList.add("btn-remove");
    btnRemover.addEventListener("click", async function () {
      await removeInput({
        player: inputNome.value,
        telefone: inputTelefone.value,
      });
      inputNome.value = "";
      inputTelefone.value = "";
    });

    // input switch
    // const divSwitchContainer = document.createElement("div");
    // divSwitchContainer.classList.add("container-switch");

    // const id_element = "check" + index + match_current.id.slice(-5);
    // const inputCheckbox = document.createElement("input");
    // inputCheckbox.type = "checkbox";
    // inputCheckbox.checked = false;
    // inputCheckbox.id = id_element;

    // const labelCheckbox = document.createElement("label");
    // labelCheckbox.htmlFor = id_element;
    // labelCheckbox.classList.add("button");

    // divSwitchContainer.appendChild(inputCheckbox);
    // divSwitchContainer.appendChild(labelCheckbox);

    const divActionsPlayer = document.createElement("div");
    divActionsPlayer.appendChild(btnRemover);
    // divActionsPlayer.appendChild(divSwitchContainer);

    // Adicionando os elementos à nova div
    novaDiv.appendChild(label);
    novaDiv.appendChild(inputNome);
    novaDiv.appendChild(inputTelefone);
    novaDiv.appendChild(divActionsPlayer);

    // Adicionando a nova div à div com a classe "time-inputs"
    divTimeInputs.appendChild(novaDiv);
  });

  if (inputsTimeAzul?.length != 5) {
    let dif = 5 - (inputsTimeAzul?.length ?? 0);
    for (let index = 5 - dif + 1; index <= 5; index++) {
      // Criando a nova div
      const novaDiv = document.createElement("div");

      // Criando o label
      const label = document.createElement("label");
      label.textContent = "Jogador " + index;

      // Criando o input de nome
      const inputNome = document.createElement("input");
      inputNome.type = "text";
      inputNome.placeholder = "Nome";
      inputNome.name = "jogador_nome_" + index;

      // Criando o input de telefone
      const inputTelefone = document.createElement("input");
      inputTelefone.type = "text";
      inputTelefone.placeholder = "Telefone";
      inputTelefone.name = "jogador_telefone_" + index;

      // Adicionando os elementos à nova div
      novaDiv.appendChild(label);
      novaDiv.appendChild(inputNome);
      novaDiv.appendChild(inputTelefone);

      // Adicionando a nova div à div com a classe "time-inputs"
      divTimeInputs.appendChild(novaDiv);
    }
  }
  // Vermelho
  inputsTimeVermelho?.forEach((input, index) => {
    // Criando a nova div
    const novaDiv = document.createElement("div");

    // Criando o label
    const label = document.createElement("label");
    label.textContent = "Jogador " + (index + 1);

    // Criando o input de nome
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.placeholder = "Nome";
    inputNome.name = "jogador_nome_" + (index + 1);
    inputNome.value = input.nome;

    // Criando o input de telefone
    const inputTelefone = document.createElement("input");
    inputTelefone.type = "text";
    inputTelefone.placeholder = "Telefone";
    inputTelefone.name = "jogador_telefone_" + (index + 1);
    inputTelefone.value = input.telefone;

    // Criando o botão de limpar
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";

    btnRemover.addEventListener("click", async function () {
      await removeInput({
        player: inputNome.value,
        telefone: inputTelefone.value,
      });
      inputNome.value = "";
      inputTelefone.value = "";
      btnRemover.parentNode.removeChild(btnRemover);
    });

    // Adicionando os elementos à nova div
    novaDiv.appendChild(label);
    novaDiv.appendChild(inputNome);
    novaDiv.appendChild(inputTelefone);
    novaDiv.appendChild(btnRemover);

    // Adicionando a nova div à div com a classe "time-inputs"
    divTimeInputs2.appendChild(novaDiv);
  });

  if (inputsTimeVermelho?.length != 5) {
    let dif = 5 - (inputsTimeVermelho?.length ?? 0);
    for (let index = 5 - dif + 1; index <= 5; index++) {
      // Criando a nova div
      const novaDiv = document.createElement("div");

      // Criando o label
      const label = document.createElement("label");
      label.textContent = "Jogador " + index;

      // Criando o input de nome
      const inputNome = document.createElement("input");
      inputNome.type = "text";
      inputNome.placeholder = "Nome";
      inputNome.name = "jogador_nome_" + index;

      // Criando o input de telefone
      const inputTelefone = document.createElement("input");
      inputTelefone.type = "text";
      inputTelefone.placeholder = "Telefone";
      inputTelefone.name = "jogador_telefone_" + index;

      // Adicionando os elementos à nova div
      novaDiv.appendChild(label);
      novaDiv.appendChild(inputNome);
      novaDiv.appendChild(inputTelefone);

      // Adicionando a nova div à div com a classe "time-inputs"
      divTimeInputs2.appendChild(novaDiv);
    }
  }
}

function handleButtonClick(match) {
  console.log("recebi =>", match);
  match_current = match;
  renderInputs(match.attendance.timeAzul, match.attendance.timeVermelho);

  document.getElementById("modal-presenca").style.display = "flex";
  document.getElementById("modal-presenca-h2").innerHTML += match.titulo;
}

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

document.getElementById("add-match")?.addEventListener("click", () => {
  openModal();
});

document.getElementById("close-modal").addEventListener("click", () => {
  form.reset();
  closeModal();
});

async function renderMatches() {
  let matches = await getMatches();
  console.log("matches =>", matches);
  if (matches.length) {
    for (var i = 0; i < matches.length; ++i) {
      let tr = tbody.insertRow();
      var td_group = tr.insertCell();
      var td_time = tr.insertCell();
      var td_data = tr.insertCell();
      var td_button = tr.insertCell();

      td_group.innerText = matches[i].titulo;
      td_time.innerText = matches[i].hora;
      td_data.innerText = matches[i].data;

      let divActions = document.createElement("div");
      divActions.classList.add("divActionsContainer");

      let button = document.createElement("button");
      let match = matches[i];
      button.onclick = () => {
        handleButtonClick(match);
      };
      button.innerText = "Gerenciar jogadores";

      let btnExcluirMatch = document.createElement("button");
      btnExcluirMatch.innerText = "Excluir";
      btnExcluirMatch.onclick = async () => {
        await removeMatch(match);
      };

      let btnConfirmar = document.createElement("button");
      btnConfirmar.innerText = "Confirmar jogadores";
      btnConfirmar.onclick = () => {
        confirmPlayersModalHandler(match);
      };

      divActions.appendChild(button);
      divActions.appendChild(btnExcluirMatch);
      divActions.appendChild(btnConfirmar);

      td_button.appendChild(divActions);
    }

    table.style.display = "block";
  }
}

document
  .getElementById("close-modal-players-confirm")
  .addEventListener("click", () => {
    document.getElementById("modal-confirmar-presenca").style.display = "none";
    // Limpar DOM
    // resetModalPlayer()
  });

async function removeMatch(match) {
  return await fetch(`http://localhost:3333/matches/${match.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("response =>", response);
      NotificationSucess("Partida excluida com sucesso.");
      window.location.reload();
    });
}
const buttons = document.querySelectorAll(".navigation-header .button-simple");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active-button"));
    button.classList.add("active-button");
  });
});

function renderPage(page) {
  buttons.forEach((item) => {
    const pageName = item.getAttribute("page");
    document.getElementById(pageName).style.display = "none";
  });
  document.getElementById(page).style.display = "flex";
}

function selectPage(page) {
  renderPage(page);
}

document.querySelectorAll("[page]").forEach((el) => {
  console.log(el);
});

window.onload = async () => {
  renderMatches();
  renderPage("main");
};

function confirmPlayersModalHandler(match) {
  console.log('confirm players =>', match);
  document.getElementById("modal-confirmar-presenca").style.display = "flex";
  const divTimeInputsBlue = document.querySelector(
    ".time-inputs-confirm:nth-child(1)"
  );
  const divTimeInputsRed = document.querySelector(
    ".time-inputs-confirm:nth-child(2)"
  );
  
  match?.attendance.timeAzul?.forEach((input, index) => {
    console.log("input =>", input);
    // Criando a nova div
    const novaDiv = document.createElement("div");

    // Criando o label
    const label = document.createElement("label");
    label.textContent = "Jogador " + (index + 1);

    // Criando o input de nome
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.placeholder = "Nome";
    inputNome.name = "jogador_nome_" + (index + 1);
    inputNome.value = input.nome;

    // Criando o input de telefone
    const inputTelefone = document.createElement("input");
    inputTelefone.type = "text";
    inputTelefone.placeholder = "Telefone";
    inputTelefone.name = "jogador_telefone_" + (index + 1);
    inputTelefone.value = input.telefone;

    // Criando o botão de limpar
    
    // input switch
    const divSwitchContainer = document.createElement("div");
    divSwitchContainer.classList.add("container-switch");

    const id_element = "check" + index + match.id.slice(-5);
    const inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.checked = input.confirmado;
    inputCheckbox.id = id_element;

    const labelCheckbox = document.createElement("label");
    labelCheckbox.htmlFor = id_element;
    labelCheckbox.classList.add("button");

    divSwitchContainer.appendChild(inputCheckbox);
    divSwitchContainer.appendChild(labelCheckbox);

    const divActionsPlayer = document.createElement("div");
    divActionsPlayer.appendChild(divSwitchContainer);
    // divActionsPlayer.appendChild(divSwitchContainer);

    // Adicionando os elementos à nova div
    novaDiv.appendChild(label);
    novaDiv.appendChild(inputNome);
    novaDiv.appendChild(inputTelefone);
    novaDiv.appendChild(divActionsPlayer);

    // Adicionando a nova div à div com a classe "time-inputs"
    divTimeInputsBlue.appendChild(novaDiv);
  });

  if (match?.attendance.timeAzul?.length != 5) {
    let dif = 5 - (match?.attendance.timeAzul?.length ?? 0);
    for (let index = 5 - dif + 1; index <= 5; index++) {
      // Criando a nova div
      const novaDiv = document.createElement("div");

      // Criando o label
      const label = document.createElement("label");
      label.textContent = "Jogador " + index;

      // Criando o input de nome
      const inputNome = document.createElement("input");
      inputNome.type = "text";
      inputNome.placeholder = "Nome";
      inputNome.name = "jogador_nome_" + index;

      // Criando o input de telefone
      const inputTelefone = document.createElement("input");
      inputTelefone.type = "text";
      inputTelefone.placeholder = "Telefone";
      inputTelefone.name = "jogador_telefone_" + index;

      // Adicionando os elementos à nova div
      novaDiv.appendChild(label);
      novaDiv.appendChild(inputNome);
      novaDiv.appendChild(inputTelefone);

      // Adicionando a nova div à div com a classe "time-inputs"
      divTimeInputsBlue.appendChild(novaDiv);
    }
  }
  // Vermelho
  match?.attendance.timeVermelho?.forEach((input, index) => {
    // Criando a nova div
    const novaDiv = document.createElement("div");

    // Criando o label
    const label = document.createElement("label");
    label.textContent = "Jogador " + (index + 1);

    // Criando o input de nome
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.placeholder = "Nome";
    inputNome.name = "jogador_nome_" + (index + 1);
    inputNome.value = input.nome;

    // Criando o input de telefone
    const inputTelefone = document.createElement("input");
    inputTelefone.type = "text";
    inputTelefone.placeholder = "Telefone";
    inputTelefone.name = "jogador_telefone_" + (index + 1);
    inputTelefone.value = input.telefone;

    // Criando o botão de limpar
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";

    btnRemover.addEventListener("click", async function () {
      await removeInput({
        player: inputNome.value,
        telefone: inputTelefone.value,
      });
      inputNome.value = "";
      inputTelefone.value = "";
      btnRemover.parentNode.removeChild(btnRemover);
    });

    // Adicionando os elementos à nova div
    novaDiv.appendChild(label);
    novaDiv.appendChild(inputNome);
    novaDiv.appendChild(inputTelefone);
    novaDiv.appendChild(btnRemover);

    // Adicionando a nova div à div com a classe "time-inputs"
    divTimeInputsRed.appendChild(novaDiv);
  });

  if (match?.attendance.timeVermelho?.length != 5) {
    let dif = 5 - (match?.attendance.timeVermelho?.length ?? 0);
    for (let index = 5 - dif + 1; index <= 5; index++) {
      // Criando a nova div
      const novaDiv = document.createElement("div");

      // Criando o label
      const label = document.createElement("label");
      label.textContent = "Jogador " + index;

      // Criando o input de nome
      const inputNome = document.createElement("input");
      inputNome.type = "text";
      inputNome.placeholder = "Nome";
      inputNome.name = "jogador_nome_" + index;

      // Criando o input de telefone
      const inputTelefone = document.createElement("input");
      inputTelefone.type = "text";
      inputTelefone.placeholder = "Telefone";
      inputTelefone.name = "jogador_telefone_" + index;

      // Adicionando os elementos à nova div
      novaDiv.appendChild(label);
      novaDiv.appendChild(inputNome);
      novaDiv.appendChild(inputTelefone);

      // Adicionando a nova div à div com a classe "time-inputs"
      divTimeInputsRed.appendChild(novaDiv);
    }
  }
}
