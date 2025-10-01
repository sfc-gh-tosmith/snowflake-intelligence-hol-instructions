const url = "https://ms5iwqbfij.execute-api.eu-west-2.amazonaws.com/metric";

function getDataOpsLiveInfo() {
  if (dataopslive !== undefined) {
    return dataopslive;
  }
  return {};
}

function getEnvLabel(dataopsInfo) {
  const host = dataopsInfo.CI_SERVER_HOST;

  switch (host) {
    case "app.dataops.live":
      return "production";
    case "app.qa.dataops.live":
      return "qa";
    default:
      return "development";
  }
}

function sendEvent(name, properties) {
  const dataopsInfo = getDataOpsLiveInfo();
  const body = JSON.stringify({
    event_name: name,
    event_source: "mkdocs-dataopslive-page",
    properties: {
      environment: getEnvLabel(dataopsInfo),
      currentUrl: window.location.href,
      userId: dataopsInfo.DATAOPS_CATALOG_CONSUMER_USER_ID,
      ...properties,
      ...dataopsInfo,
    },
  });
  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  console.log("sendEvent", name, body);
}

function ddeButtonClick(event) {
  const section = closestHeader(event.target);
  sendEvent("dataops-sc-homepage-dataops-develop-opened", { section });
}

function closestHeader(element) {
  let startingElement = element;
  let currentElement = element;
  let closestHeader = null;
  while (closestHeader === null) {
    while (currentElement !== null) {
      if (
        currentElement.tagName === "H3" ||
        currentElement.tagName === "H2" ||
        currentElement.tagName === "H1"
      ) {
        closestHeader = currentElement;
        break;
      }
      currentElement = currentElement.previousSibling;
    }
    if (startingElement === null) {
      break;
    }
    currentElement = startingElement.parentNode;
    startingElement = currentElement;
  }
  return closestHeader !== null ? closestHeader.textContent : "N/A";
}

function copyButtonClick(event) {
  const copyButton = event.target;
  const codeBlock = copyButton.closest(".highlight");
  const section = closestHeader(codeBlock);
  sendEvent("dataops-sc-homepage-code-copied", { section });
}

window.addEventListener("load", () => {
  const ddeButtons = document.getElementsByClassName("dde-button");
  for (let i = 0; i < ddeButtons.length; ++i) {
    ddeButtons[i].addEventListener("click", ddeButtonClick, false);
  }

  const copyButtons = document.getElementsByClassName("md-clipboard");
  for (let i = 0; i < copyButtons.length; ++i) {
    copyButtons[i].addEventListener("click", copyButtonClick, false);
  }

  // FIXME: DATAOPS-13272 Disabled for now as causes duplicate events when combined with the copyButtonClick event.
  // Log copy events
  // document.addEventListener("copy", (event) => {
  //   const selectedText = window.getSelection().toString();
  //   const section = closestHeader(event.target);
  //   sendEvent("dataops-sc-homepage-text-copied", {
  //     section,
  //     copiedText: selectedText,
  //   });
  // });
});
