const divSwitchContainer = document.createElement("div");
    divSwitchContainer.classList.add("container-switch");
    
    const id_element = "check"+index+match_current.id.slice(-5)
    const inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.checked = false;
    inputCheckbox.id = id_element;

    const labelCheckbox = document.createElement("label");
    labelCheckbox.htmlFor = id_element;
    labelCheckbox.onclick = () => {
      toggleChecked(id_element);
    } 
    labelCheckbox.classList.add("button");

    divSwitchContainer.appendChild(inputCheckbox);
    divSwitchContainer.appendChild(labelCheckbox);