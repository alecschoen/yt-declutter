// yt-declutter — options page.
// Only reads/writes chrome.storage.sync. The consumers react on their own:
//  - hideShorts  → content/toggle.js flips the <html> class in open tabs
//  - redirectHome → background.js enables/disables the DNR ruleset

const checkboxes = {
  hideShorts: document.getElementById("hideShorts"),
  redirectHome: document.getElementById("redirectHome"),
};

// Both features default to on.
chrome.storage.sync.get({ hideShorts: true, redirectHome: true }, (settings) => {
  for (const [key, box] of Object.entries(checkboxes)) {
    box.checked = settings[key];
  }
});

for (const [key, box] of Object.entries(checkboxes)) {
  box.addEventListener("change", () => {
    chrome.storage.sync.set({ [key]: box.checked });
  });
}
