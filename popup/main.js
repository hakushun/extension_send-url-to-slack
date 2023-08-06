/**
 * payload
 * @see https://api.slack.com/methods/chat.postMessage
 */
const payload = {
  token: "",
  channel: "",
  username: "",
  icon_url: "",
};

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getTitleAndUrl() {
  const tab = await getCurrentTab();
  return {
    title: tab.title,
    url: tab.url,
  };
}

function insertTitleAndUrl({ title, url }) {
  const titleEl = document.getElementById("title");
  const urlEl = document.getElementById("url");
  titleEl.innerText = title;
  urlEl.innerText = url;
}

async function sentToSlack({ payload, title, url }) {
  const formData = new FormData();
  Object.entries(payload).map(([key, value]) => formData.set(key, value));
  formData.set("text", `${title}\n${url}`);
  await fetch("https://api.slack.com/api/chat.postMessage", {
    method: "POST",
    body: formData,
  });
}

window.addEventListener("load", async () => {
  try {
    const { title, url } = await getTitleAndUrl();
    insertTitleAndUrl({ title, url });
  } catch (error) {
    window.alert("Something wrong");
    throw new Error(error);
  }
});

document.getElementById("send").addEventListener("click", async () => {
  try {
    const { title, url } = await getTitleAndUrl();
    await sentToSlack({ payload, title, url });
  } catch (error) {
    window.alert("Something wrong");
    throw new Error(error);
  }
});
