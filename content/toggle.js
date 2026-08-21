// yt-declutter — toggles the class that gates every rule in hide-shorts.css.
// Runs once at document_start (plus a storage listener); all actual hiding is
// done by CSS, so there is no DOM watching and no per-scroll work.

const CLASS_NAME = "yt-declutter-hide-shorts";

function apply(hideShorts) {
  document.documentElement.classList.toggle(CLASS_NAME, Boolean(hideShorts));
}

// Default: enabled until the user says otherwise.
chrome.storage.sync.get({ hideShorts: true }, ({ hideShorts }) => {
  apply(hideShorts);
});

// React immediately when the option is flipped, without a page reload.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.hideShorts) {
    apply(changes.hideShorts.newValue);
  }
});
