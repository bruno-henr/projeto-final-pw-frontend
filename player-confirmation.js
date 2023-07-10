const modalConfirmation = document.getElementById("modal-confirmar-presenca");
const buttonCloseModalConfirmation = document.getElementById(
  "close-modal-players-confirm"
);

buttonCloseModalConfirmation.addEventListener("click", () => {
  document.getElementById("modal-confirmar-presenca").style.display = "none";
  resetModalConfirmation();
});

document.getElementById("confirm-players").addEventListener("click", () => {
  const timeAzulInputs = document.querySelectorAll(
    "#modal-confirmar-presenca .wrapper .time-inputs-confirm:nth-child(1) input"
  );
  const timeVermelhoInputs = document.querySelectorAll(
    "#modal-confirmar-presenca .wrapper .time-inputs-confirm:nth-child(2) input"
  );

  let timeAzul = [];
  let timeRed = [];

  timeAzulInputs.forEach(function (input, index) {
    const nomeInput = input.getAttribute("name");
    if (nomeInput?.includes("jogador_nome")) {
      const nameInput = input.value;
      const telInput = timeAzulInputs[index + 1];
      const confirmationInput = timeAzulInputs[index + 2].checked;
      timeAzul.push({
        nome: nameInput,
        telefone: telInput?.value,
        confirmado: confirmationInput,
      });
    }
  });

  timeVermelhoInputs.forEach(function (input, index) {
    const nomeInput = input.getAttribute("name");
    if (nomeInput?.includes("jogador_nome")) {
      const nameInput = input.value;

      const telInput = timeVermelhoInputs[index + 1];
      const confirmationInput = timeVermelhoInputs[index + 2].checked;
      timeRed.push({
        nome: nameInput,
        telefone: telInput?.value,
        confirmado: confirmationInput,
      });
    }
  });

  //   console.log({ timeAzul, timeRed });

  confirmationPlayers({
    timeAzul,
    timeVermelho: timeRed,
  });
});

async function confirmationPlayers(players) {
  console.log("f confirmation", match_current);
  return await fetch(
    `http://localhost:3333/matches/${match_current.id}/attendance`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(players),
    }
  )
    .then((response) => response.json())
    .then((response) => {
        modalConfirmation.style.display = "none";
        NotificationSucess("Jogadores confirmados");
        resetModalConfirmation();
    });
}

function resetModalConfirmation() {
  const img_blue = document.querySelector(
    "#modal-confirmar-presenca .wrapper .time-inputs-confirm:nth-child(1) img"
  );
  const divBlue = document.querySelector(
    "#modal-confirmar-presenca .wrapper .time-inputs-confirm:nth-child(1)"
  );
  divBlue.innerHTML = "";
  divBlue.appendChild(img_blue);

  const img_red = document.querySelector(
    "#modal-confirmar-presenca .wrapper .time-inputs-confirm:nth-child(2) img"
  );
  const divRed = document.querySelector(
    "#modal-confirmar-presenca .wrapper .time-inputs-confirm:nth-child(2)"
  );
  divRed.innerHTML = "";
  divRed.appendChild(img_red);

  tbody.innerHTML = ""
  renderMatches()
}


