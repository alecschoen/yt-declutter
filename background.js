// yt-declutter — service worker.
// Single responsibility: keep the "redirect_home" static declarativeNetRequest
// ruleset's enabled state in sync with the stored "redirectHome" setting.
// (The Shorts toggle never touches this worker; it's handled entirely by the
// content script's class toggle.)

const RULESET_ID = "redirect_home";

async function syncRedirectRuleset() {
  // Default: enabled until the user says otherwise.
  const { redirectHome = true } = await chrome.storage.sync.get("redirectHome");
  await chrome.declarativeNetRequest.updateEnabledRulesets(
    redirectHome
      ? { enableRulesetIds: [RULESET_ID] }
      : { disableRulesetIds: [RULESET_ID] }
  );
}

// On install: align the ruleset (enabled by default in the manifest) with any
// setting that may already exist in sync storage from another machine.
chrome.runtime.onInstalled.addListener(syncRedirectRuleset);

// On browser startup: catch settings that were synced while Chrome was closed.
// (The enabled state itself persists across restarts; this is just a re-check.)
chrome.runtime.onStartup.addListener(syncRedirectRuleset);

// Live toggle from the options page (or a synced change from another machine).
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.redirectHome) {
    syncRedirectRuleset();
  }
});
