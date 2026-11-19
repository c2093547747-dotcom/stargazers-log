const list = document.querySelector("#repository-list");
const status = document.querySelector("#list-status");
const count = document.querySelector("#repository-count");

function formatDate(dateString) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${dateString}T00:00:00Z`));
}

function createRepositoryItem(event, index) {
  const { repository, starredAt } = event;
  const item = document.createElement("li");
  item.className = "repository-item";
  item.style.animationDelay = `${index * 55}ms`;

  const main = document.createElement("div");
  main.className = "repository-main";

  const link = document.createElement("a");
  link.className = "repository-link";
  link.href = repository.url;
  link.textContent = repository.name;
  link.target = "_blank";
  link.rel = "noreferrer";

  const owner = document.createElement("span");
  owner.className = "repository-owner";
  owner.textContent = ` / ${repository.owner}`;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;

  const meta = document.createElement("div");
  meta.className = "repository-meta";

  const language = document.createElement("span");
  language.className = "repository-language";
  language.textContent = repository.language;

  const date = document.createElement("time");
  date.dateTime = starredAt;
  date.textContent = `Starred ${formatDate(starredAt)}`;

  main.append(link, owner, description);
  meta.append(language, date);
  item.append(main, meta);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    const starredEvents = events
      .filter((event) => event.type === "starred" && event.repository)
      .sort((first, second) => second.starredAt.localeCompare(first.starredAt));

    list.replaceChildren(
      ...starredEvents.map((event, index) => createRepositoryItem(event, index))
    );
    count.textContent = `${starredEvents.length} ${starredEvents.length === 1 ? "repository" : "repositories"}`;
    status.hidden = true;
  } catch (error) {
    status.dataset.state = "error";
    status.textContent = "Repositories could not be loaded. Please try again later.";
    console.error("Could not load starred repositories:", error);
  }
}

loadRepositories();