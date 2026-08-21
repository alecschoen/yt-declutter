# Chrome Web Store listing — copy-paste content

Everything below maps 1:1 to a field in the developer dashboard
(https://chrome.google.com/webstore/devconsole).

## Store listing tab

**Name** (comes from the manifest in the uploaded zip)

> Declutter for YouTube

**Summary** (132 chars max — this is the manifest `description`; edit both together)

> Hides Shorts everywhere and opens your Subscriptions feed instead of the algorithmic homepage. No data collected.

**Description**

> Take back control of YouTube with two simple switches:
>
> HIDE ALL SHORTS
> Removes Shorts everywhere they appear: the shelf on the home and
> subscriptions feeds, individual tiles in grids and search results, the
> Shorts links in both sidebars, and the Shorts tab on channel pages. Hiding
> is done with pure CSS, so it keeps working while you scroll and navigate —
> no flicker, no performance cost.
>
> HOMEPAGE → SUBSCRIPTIONS
> Opening youtube.com lands you on your Subscriptions feed instead of the
> algorithmic recommendation feed. The redirect happens before the page
> loads, so you never even see the home feed. Clicking the YouTube logo or
> "Home" goes to Subscriptions too — without interrupting the miniplayer.
> Every other page (videos, search, playlists, channels) is untouched.
>
> Both features can be toggled independently on the options page, and your
> settings sync across your Chrome profiles.
>
> PRIVACY
> No data is collected, stored, or transmitted — there is no analytics, no
> tracking, and no remote code. The extension runs only on youtube.com.
> Source code: https://github.com/alecschoen/yt-declutter

**Category**: Social & Communication (alternative: Workflow & Planning)

**Language**: English

**Screenshot**: upload `screenshot-1280x800.png` from this folder.
(Optionally add a real 1280×800 screenshot of YouTube with the extension
active — crop a browser window to exactly 1280×800.)

## Privacy practices tab

**Single purpose description**

> Declutters YouTube by hiding Shorts and redirecting the homepage to the
> user's Subscriptions feed.

**Permission justifications**

- `storage`:
  > Persists the user's two on/off settings (hide Shorts, redirect homepage)
  > via chrome.storage.sync so they survive restarts and sync across the
  > user's own Chrome profiles. No other data is stored.

- `declarativeNetRequest`:
  > Provides the single static redirect rule that sends the exact YouTube
  > root path (youtube.com/) to youtube.com/feed/subscriptions before page
  > load, and lets the options toggle enable/disable that rule. No request
  > data is read (declarativeNetRequestFeedback is not requested).

- Host permission (`*://www.youtube.com/*`, `*://youtube.com/*`):
  > Required by Chrome for declarativeNetRequest redirect actions to apply on
  > youtube.com. The extension runs exclusively on YouTube and touches no
  > other site.

**Remote code**: No, I am not using remote code.
(All JS/CSS is packaged in the extension; nothing is fetched or eval'd.)

**Data usage**: tick NO boxes in "What user data do you plan to collect?" —
the extension collects nothing. Then certify the three disclosures
(no sale of data / no unrelated use / no creditworthiness use).

## Account tab (one-time)

- Add and verify a contact email (required before you can submit).
- Optionally verify your GitHub Pages/site later for a "verified publisher"
  badge — not required.

## After submitting

- Review usually takes 1–3 days; you'll get an email either way.
- Common rejection for this kind of extension is trademark branding — already
  mitigated: the name follows the "… for YouTube" convention, and the icon
  (indigo/coral) is distinct from YouTube's red/white play button.
- New versions: bump `"version"` in manifest.json, run `./pack.sh`, upload the
  new zip on the item's "Package" page.
