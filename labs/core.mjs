// VISHWAS PRODUCT LAB // Pure utility functions. No external dependencies.
export const VERSION = 1;
export const priorities = ["Low", "Medium", "High", "Critical"];
export const statuses = ["Open", "In progress", "Resolved"];

export function safeUrl(value) {
  try {
    const url = new URL(String(value).trim());
    return (url.protocol === "https:" || url.protocol === "http:") ? url.href : null;
  } catch {
    return null;
  }
}

export function normalizeTags(raw) {
  return [...new Set(String(raw || "").split(",")
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean))].slice(0, 8);
}

export function createTicket({ title, priority = "Medium", owner = "Unassigned" }, id = undefined) {
  const trimmed = String(title || "").trim();
  if (trimmed.length < 3 || trimmed.length > 120) {
    throw new Error("Ticket title must be 3 to 120 characters.");
  }
  return {
    id: id || ("VA-" + Math.random().toString(36).slice(2, 9).toUpperCase()),
    title: trimmed,
    priority: priorities.includes(priority) ? priority : "Medium",
    owner: String(owner || "Unassigned").trim().slice(0, 50) || "Unassigned",
    status: "Open",
    created: new Date().toISOString()
  };
}

export function filterTickets(tickets, { q = "", status = "All", priority = "All" } = {}) {
  const needle = String(q).trim().toLowerCase();
  return tickets.filter(ticket => {
    const search = (ticket.id + " " + ticket.title + " " + ticket.owner).toLowerCase();
    return search.includes(needle)
      && (status === "All" || ticket.status === status)
      && (priority === "All" || ticket.priority === priority);
  });
}

export function ticketStats(tickets) {
  return {
    total: tickets.length,
    open: tickets.filter(t => t.status === "Open").length,
    active: tickets.filter(t => t.status === "In progress").length,
    resolved: tickets.filter(t => t.status === "Resolved").length
  };
}

export function parseStored(raw, fallback = []) {
  if (raw == null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function addBookmark({ title, url, tags = "", notes = "" }, id = undefined) {
  const cleanUrl = safeUrl(url);
  if (!cleanUrl) throw new Error("Use a valid HTTP or HTTPS URL.");
  const label = String(title || "").trim();
  if (label.length < 2 || label.length > 100) throw new Error("Title must be 2 to 100 characters.");
  return {
    id: id || ("LINK-" + Math.random().toString(36).slice(2, 9).toUpperCase()),
    title: label,
    url: cleanUrl,
    tags: normalizeTags(tags),
    notes: String(notes || "").trim().slice(0, 280),
    favorite: false
  };
}

export function filterBookmarks(bookmarks, query = "") {
  const needle = String(query).trim().toLowerCase();
  return bookmarks.filter(bookmark =>
    [bookmark.title, bookmark.url, bookmark.notes, ...(bookmark.tags || [])]
      .join(" ").toLowerCase().includes(needle));
}

export function createQuote(text, author = "Original note", id = undefined) {
  const quote = String(text || "").trim();
  if (quote.length < 8 || quote.length > 320) throw new Error("Quote must be 8 to 320 characters.");
  return {
    id: id || ("Q-" + Math.random().toString(36).slice(2, 9).toUpperCase()),
    text: quote,
    author: String(author || "Original note").trim().slice(0, 80),
    saved: false
  };
}

export function pageItems(items, page, size = 12) {
  if (!Number.isSafeInteger(page) || page < 0 || !Number.isSafeInteger(size) || size < 1) return [];
  return items.slice(page * size, (page + 1) * size);
}

const scenarios = [
  ["Review a failed health-check job", "High", "Automation", "In progress"],
  ["Add keyboard navigation to project filters", "Medium", "Frontend", "Open"],
  ["Document backup and restore policy", "High", "Operations", "Open"],
  ["Improve empty state in support queue", "Low", "Design", "Resolved"],
  ["Review API input validation", "Critical", "Security", "In progress"],
  ["Repair notification email preview", "Medium", "Support", "Resolved"],
  ["Audit public error messages", "High", "Engineering", "Open"],
  ["Test responsive layout at 320px", "Low", "QA", "Resolved"]
];
export function demoTickets() {
  return scenarios.map((item, i) => ({
    id: "DEMO-" + String(i + 1).padStart(3, "0"),
    title: item[0], priority: item[1], owner: item[2], status: item[3],
    created: "2026-11-09T00:00:00.000Z"
  }));
}

export function demoBookmarks() {
  return [
    addBookmark({title:"Vishwas Aithal on GitHub",url:"https://github.com/vishwasaithalz",tags:"code,portfolio",notes:"Public project source"}, "DEMO-L1"),
    addBookmark({title:"Web Content Accessibility Guidelines",url:"https://www.w3.org/WAI/standards-guidelines/wcag/",tags:"design,reference",notes:"Accessibility reference"}, "DEMO-L2"),
    addBookmark({title:"MDN Web Docs",url:"https://developer.mozilla.org/",tags:"javascript,reference",notes:"Web platform documentation"}, "DEMO-L3")
  ];
}

export function demoQuotes() {
  return [
    createQuote("A good interface helps you think, not just click.", "Product Lab, original", "DEMO-Q1"),
    createQuote("Make the useful part work before adding the dramatic part.", "Product Lab, original", "DEMO-Q2"),
    createQuote("A prototype can start a conversation. A test can settle an argument.", "Product Lab, original", "DEMO-Q3"),
    createQuote("The wallpaper changed. The curiosity did not.", "Vishwas Aithal, original", "DEMO-Q4")
  ];
}

const feedTopics = [
  ["Input validation", "Security", "Validate URLs and text before saving records."],
  ["Keyboard support", "Accessibility", "Every essential action needs a keyboard path."],
  ["Status models", "Product", "Keep ticket states explicit and understandable."],
  ["Local storage", "Frontend", "Make data ownership and limitations clear."],
  ["Test fixtures", "Engineering", "Use realistic demo records and label them."],
  ["Readable errors", "UX", "Tell users how to fix invalid input."],
  ["Dependency hygiene", "DevOps", "Commit lockfiles, not node_modules."],
  ["Clear empty states", "Design", "A blank list should explain what to do next."]
];
export function demoFeed() {
  return Array.from({length: 96}, (_, i) => {
    const topic = feedTopics[i % feedTopics.length];
    return {id:i + 1, title:topic[0] + " / " + String(i + 1).padStart(3, "0"),
      category:topic[1], summary:topic[2]};
  });
}
