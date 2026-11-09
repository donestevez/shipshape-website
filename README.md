# Shipshape Handyman website

A one-page site. There's nothing to install and no build step.

## Preview it
Double-click `index.html`. It opens in your web browser.
After you edit anything, save the file and refresh the browser.

## Change your details
Edit **`site-config.js`** in Notepad or any text editor. It holds everything:
phone, email, towns, services, About text, guarantee, search title and description, and photos.

- Anything in `[square brackets]` is a placeholder. Replace it before publishing. The form won't send until `formEndpoint` is filled in.
- Leave `phone: ""` empty to hide the call buttons. Add a number and tap-to-call buttons appear automatically.

## Add project photos
1. Put photos in `assets/photos/`. JPG is fine; around 1600px wide keeps the page fast.
2. In `site-config.js`, add them to `projects`:
   ```js
   projects: [
     { image: "assets/photos/back-door.jpg",
       caption: "Rehung a back door that wouldn't latch and replaced the trim." }
   ]
   ```
The "Recent work" section and its menu link appear automatically once a photo is listed.

## How estimate requests work
The form sends requests straight to your inbox through [Formspree](https://formspree.io). Customers never leave the page.

**Connect it (one time, about 5 minutes):**
1. Sign up at formspree.io using your **estimates@** business address. Requests are delivered there.
2. Create a new form. Copy its endpoint, which looks like `https://formspree.io/f/xyzabcd`.
3. Paste it into `formEndpoint` in `site-config.js`.
4. Publish the site, then send yourself a test request. Formspree asks you to confirm the first one by email.

What customers see:
- **Sent:** "Got it, thanks!" appears only after Formspree confirms it received the request.
- **Failed** (offline, timeout, or a server problem): a clear message appears, everything they typed stays in the form so they can try again, and your phone and email are offered as a backup.
- What they type is also saved in their browser until the request goes through, so a reload doesn't lose it.

Each request arrives as an email with the subject "Estimate request: Name (Town)". If the customer gave an email address, you can just hit Reply.

## Publish
Upload the whole folder (`index.html`, `site-config.js`, `main.js`, `styles.css`, `assets/`) to any static host,
such as Netlify (drag-and-drop), Cloudflare Pages, or GitHub Pages.

## Files
- `site-config.js`: your business details (the only file you need to edit)
- `index.html`: page structure
- `styles.css`: colors and layout (colors are at the top under `:root`)
- `main.js`: fills the page from your config and runs the estimate form
- `assets/`: logo, footer logo, icon, and photos
