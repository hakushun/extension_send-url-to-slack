/**
 * token
 */
const token = "";
/**
 * payload
 */
const payload = {
  channel: "",
  username: "",
  icon: "",
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

async function sentToSlack({ title, url }) {
  await fetch("https://api.slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ ...payload, text: `${title}\n${url}` }),
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
    await sentToSlack({ title, url });
  } catch (error) {
    window.alert("Something wrong");
    throw new Error(error);
  }
});
