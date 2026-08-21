// yt-declutter — SPA-navigation companion to the declarativeNetRequest rule.
//
// The DNR ruleset only sees real page loads. Clicking the YouTube logo (or
// the "Home" sidebar entry) is client-side router navigation — no network
// request — so it would land on the recommendation feed. This script catches
// those clicks before YouTube's router does and goes to Subscriptions instead.
//
// Registered on window in the capture phase at document_start, so it runs
// ahead of any handler YouTube installs. Honors the same "redirectHome"
// setting as the ruleset.

let redirectHome = true;

chrome.storage.sync.get({ redirectHome: true }, (settings) => {
  redirectHome = settings.redirectHome;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.redirectHome) {
    redirectHome = changes.redirectHome.newValue;
  }
});

window.addEventListener(
  "click",
  (event) => {
    if (!redirectHome) return;

    // Only plain left-clicks: modified/middle clicks open a new tab, which is
    // a real page load and is already handled by the DNR redirect rule.
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    // composedPath instead of event.target so links inside shadow DOM are
    // still found.
    const anchor = event
      .composedPath()
      .find((node) => node instanceof HTMLAnchorElement && node.href);
    if (!anchor) return;

    // Same policy as rules.json: same-origin, exact root path only.
    if (anchor.origin !== location.origin || anchor.pathname !== "/") return;
    if (anchor.target && anchor.target !== "_self") return;

    event.preventDefault();
    event.stopImmediatePropagation();
    goToSubscriptions();
  },
  true
);

// Navigate to the Subscriptions feed, staying inside YouTube's SPA router if
// at all possible. A full page load (location.assign) would tear down the
// miniplayer and other in-page state, so it's only the last resort.
//
// Content scripts run in an isolated world and can't call YouTube's internal
// navigation API — but the page already contains real Subscriptions links
// wired to the router (in the sidebar), so we forward our click to one of
// those and let YouTube do its own in-app transition.
function goToSubscriptions() {
  const routerLink = document.querySelector(
    [
      // Full (expanded/drawer) guide sidebar
      'ytd-guide-entry-renderer a[href="/feed/subscriptions"]',
      // Collapsed mini sidebar
      'ytd-mini-guide-entry-renderer a[href="/feed/subscriptions"]',
      // Any other router-wired YouTube link as a catch-all
      'a.yt-simple-endpoint[href="/feed/subscriptions"]',
    ].join(", ")
  );

  if (routerLink) {
    // Synthetic click; re-enters our own listener above but is ignored there
    // (pathname is not "/"). YouTube's handler performs SPA navigation.
    routerLink.click();
  } else {
    // No router link in the DOM (e.g. guide not rendered yet): full load.
    location.assign("/feed/subscriptions");
  }
}
