window.addEventListener("load", () => {
  const codeBlocks = document.getElementsByClassName("collapse-code");
  for (let i = 0; i < codeBlocks.length; ++i) {
    const codeBlock = codeBlocks.item(i);
    codeBlock.classList.add("collapsed");
    const footer = document.createElement("div");
    footer.classList.add("code-footer");

    const expandButton = document.createElement("button");
    expandButton.classList.add("expand");
    const collapseButton = document.createElement("button");
    collapseButton.classList.add("collapse");

    expandButton.onclick = () => {
      codeBlock.classList.remove("collapsed");
      footer.style.display = "none";
      expandButton.style.display = "none";
      collapseButton.style.display = "block";
    };

    collapseButton.onclick = () => {
      codeBlock.classList.add("collapsed");
      footer.style.display = "block";
      expandButton.style.display = "block";
      collapseButton.style.display = "none";
    };

    codeBlock.getElementsByTagName("pre")[0].appendChild(expandButton);
    codeBlock.getElementsByTagName("pre")[0].appendChild(collapseButton);
    codeBlock.appendChild(footer);
  }
});
