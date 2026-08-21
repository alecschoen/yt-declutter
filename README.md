# YT Declutter

A tiny Manifest V3 Chrome extension that:

1. **Hides all YouTube Shorts** — shelves, grid/search tiles, the sidebar
   entries, and the Shorts tab on channel pages. Done with pure CSS gated on a
   single class, so it survives infinite scroll and SPA navigation with zero
   DOM watching.
2. **Redirects the homepage** (`youtube.com/`, exact root path only) to
   `youtube.com/feed/subscriptions`, using a `declarativeNetRequest` static
   ruleset — the redirect happens at the network layer, before any of the home
   feed renders. `/watch`, `/results`, `/feed/*`, `/@handle`, etc. are untouched.
   Clicking the YouTube logo or the "Home" sidebar entry is client-side (SPA)
   navigation with no network request, so DNR can't intercept it; a small
   click handler (`content/redirect-home.js`) catches plain left-clicks on
   root-path links and forwards them to an existing Subscriptions link in the
   sidebar, so YouTube performs its own in-app transition (the miniplayer and
   other page state survive). Only if no such link exists in the DOM yet does
   it fall back to a full page load. Modified/middle clicks open a new tab — a
   real page load — and are handled by the DNR rule.

Both features can be toggled on the options page and persist via
`chrome.storage.sync`.

No build step, no dependencies. Plain HTML/CSS/JS.

## Load unpacked

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** (toggle, top right).
3. Click **Load unpacked** and select this `yt-declutter` folder.
4. Reload any open YouTube tabs once.

To open the options: click the extension's entry on `chrome://extensions` →
**Details** → **Extension options** (or right-click the toolbar icon →
**Options**).

Note: `manifest.json` contains `//` comments justifying each permission.
Chrome's extension manifest parser accepts these; if you run the file through
a strict JSON tool, strip the comments first.

## Packing for distribution

```bash
./pack.sh
```

Produces `dist/yt-declutter-v<version>.zip` — the upload format for the
Chrome Web Store / Edge Add-ons, with the manifest's `//` comments stripped so
strict JSON validators accept it. Note that modern Chrome refuses self-packed
`.crx` files outside the Web Store, so for direct installs the options are
load-unpacked (above) or unzipping this archive and loading that folder.

## File map

| File | Purpose |
| --- | --- |
| `manifest.json` | Permissions (each justified in a comment) and wiring |
| `rules.json` | The single redirect rule (root path → `/feed/subscriptions`) |
| `content/hide-shorts.css` | All Shorts-hiding selectors, grouped by target |
| `content/toggle.js` | Adds/removes the gating class on `<html>` per the setting |
| `content/redirect-home.js` | Sends logo/Home (SPA) clicks to Subscriptions |
| `background.js` | Enables/disables the redirect ruleset when the setting changes |
| `options/` | The two-checkbox options page |

## Troubleshooting: Shorts came back

YouTube renames its custom elements every so often. When a Shorts shelf or
tile reappears, it takes about two minutes to fix:

1. Open the YouTube page where the Shorts are showing, right-click the
   offending shelf/tile and choose **Inspect**.
2. In the Elements panel, walk **up** the tree from the highlighted node until
   you find the outermost element that wraps *just that one shelf or tile* —
   it's usually a custom element with a name like `ytd-…-renderer` or
   `…-view-model`. That tag name is what you need.
   - Tip: hover each ancestor and watch the page highlight to see exactly
     what it covers. You want the element whose highlight covers the Shorts
     item and nothing else.
   - Sanity check: Shorts thumbnails link to `/shorts/<id>`, so somewhere
     inside that wrapper there should be an `<a href="/shorts/…">`.
3. Open `content/hide-shorts.css`, find the group comment that matches what
   broke (shelf / tile / sidebar / channel tab), and add a selector to that
   group following the existing pattern:

   ```css
   html.yt-declutter-hide-shorts new-element-name:has(a[href^="/shorts/"]),
   ```

   Anchoring on `:has(a[href^="/shorts/"])` rather than the element name alone
   keeps the rule safe — if the element is also used for normal videos, only
   the Shorts instances get hidden.
4. Go to `chrome://extensions`, hit the reload (circular arrow) button on
   YT Declutter, then refresh the YouTube tab.

Known weak spot: the **channel-page Shorts tab** has no `/shorts/` link in
today's markup, so it's matched by `yt-tab-shape[tab-title="Shorts"]` — a
YouTube attribute that carries the *localized* label. If your YouTube UI
language isn't English, change `"Shorts"` in that selector to whatever the tab
is called in your language (in most languages it's still "Shorts").

## Permissions summary

- `storage` — persist the two checkboxes via `chrome.storage.sync`.
- `declarativeNetRequest` — ship and toggle the static redirect ruleset.
- Host permissions on `youtube.com` only — required for the redirect action to
  apply there; the content script's access comes from its own `matches` entry.
