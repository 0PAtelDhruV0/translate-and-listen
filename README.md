# Translate & Listen — French → English 🇫🇷 → 🇺🇸

A responsive French-to-English translation and reading web application, modeled after the approved three-column UI. Designed for iPad Safari and desktop Chrome/Edge/Safari. **No server, build step, account, or API key is needed for basic use** after you publish it as a static site.

## What works

- French → English translation, broken into aligned sentences.
- Speak French or English using your device's installed voices. Adjust speed, volume, and French voice.
- Follow along with blue sentence highlights on both languages; word-level highlight when the browser supplies speech-boundary events.
- Tap any French or English word to open its translation/grammar note (for common French words), a pronunciation button, and both sentences for context. Unknown words use an online lookup.
- Sample paragraph usable immediately without a network request.
- Import plain text, Markdown, CSV. Import text-based PDF or DOCX through dynamically loaded browser libraries (online).
- Conversation example, saved local history, local word cache, bilingual TXT export, theme switching, optional PWA installation.
- Works responsively in iPad landscape and portrait, plus Windows browsers.

## Get it on your iPad with GitHub Pages

**You can use just an iPad** for these steps if you upload the files with Safari; a Windows computer may be easier.

1. Sign into [GitHub](https://github.com/) and choose **New repository**. Name it `translate-and-listen`, set it to **Public**, and create it.
2. Extract the ZIP in Files (iPad) or Explorer (Windows). In the GitHub repository, select **Add file → Upload files**.
3. Upload **all the files and folders inside** the extracted `TranslateAndListen-FR-EN` folder (especially `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, and the entire `icons/` folder). Do not upload only the ZIP. GitHub's web uploader may not accept folders on every browser; for `icons/`, create that folder in the repository or use GitHub Desktop / the Git command line.
4. Open **Settings → Pages → Build and deployment**, select **Deploy from a branch**. Choose branch `main` and folder `/ (root)`, then save.
5. Open `https://YOUR-GITHUB-USERNAME.github.io/translate-and-listen/` after GitHub Pages indicates it is published.
6. On iPad Safari, open the page → tap **Share** → **Add to Home Screen** → **Add**. It appears like an app on the Home Screen. If you edit the GitHub files later, reload the page to pick up changes.

*GitHub Pages does not run a translation backend: this edition calls the public MyMemory API from the browser.*

## Use on Windows

Double-click **`index.html`** to open the app in a browser, or use `start-windows.bat` if Python is installed to serve it locally at `http://localhost:8765`. **GitHub Pages is the preferred way** to use the same app on both iPad and Windows. The ZIP itself is ready for uploading to a Git repository.

## Everyday usage

1. Enter French text on the left and press **Translate & Generate Audio**. The result appears in the right panel and in the bilingual sentence rows.
2. Tap **▶** at the bottom to hear French. Switch **🇫🇷 French** → **🇺🇸 English** in the player to hear the translation. Playback uses built-in text-to-speech; the button does **not** create an MP3 file.
3. Tap a word to see its meaning and the surrounding French and English sentences. Tap the speaker inside the word card to hear that word. Tap elsewhere to close the card.
4. Use **Save**, **History**, **Export TXT**, and the **Documents** tab as needed.

## Limitations and privacy

- **Online translations:** New translations and unknown-word lookups require internet. MyMemory is a third-party free service with rate/usage limits and variable quality; long passages may fail when its limits are reached. We do **not** claim unlimited, fully offline translation. The included example, local history, previously cached translations, and installed-device TTS can work without a network once the app has loaded.
- **Translation privacy:** Text that you translate (and unknown words tapped) is sent to `https://api.mymemory.translated.net`. Do not paste secrets. Saved history and settings are stored in your browser's localStorage (not synchronized across devices).
- **Voice synchronization:** Current-sentence highlights start with each utterance. Word-level highlights require `SpeechSynthesisUtterance.onboundary`; browser/voice implementations vary. The progress bar gives an **estimated** time, not an audio sample-accurate duration. Pause resumes at the beginning of the current sentence.
- **Audio export:** Voice is synthesized by your device and cannot be saved as MP3 through the Web Speech API used here.
- **File formats:** TXT/MD/CSV files import locally. PDF and DOCX readers are downloaded from CDN when needed; scanned-image PDFs require OCR and aren't supported. Input is limited to 12,000 characters per translation; split longer books into smaller pieces. The imported PDF is not sent as a file; extracted text is sent to MyMemory only when you press Translate.
- **Web tab:** Most websites disallow browser-side page fetching (CORS). Copy-paste if a URL cannot be imported.
- **iPad Safari:** iOS may not expose all installed voices or all word-boundary speech events, depending on version and voice. Tap Play directly to start audio in accordance with browser requirements.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Responsive interface |
| `styles.css` | Styling, light/dark modes, tablet and phone layouts |
| `app.js` | Translation, word explanations, speech, imports, history and UI behavior |
| `sw.js` | Offline cache for app shell |
| `manifest.webmanifest` | Home Screen installation metadata |
| `icons/` | PWA icons |
| `start-windows.bat` | Optional Windows local web server |
| `tests/` | Local smoke test instructions |

## Development / test locally

With Python installed:

```bash
python -m http.server 8765
# Visit http://localhost:8765
```

No `npm install` or special build command is needed. To deploy an update, replace files in your GitHub repository and allow GitHub Pages to rebuild.

## Credits

Uses the public [MyMemory Translation API](https://mymemory.translated.net/doc/spec.php), the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), and optional on-demand libraries [PDF.js](https://mozilla.github.io/pdf.js/) and [Mammoth](https://github.com/mwilliamson/mammoth.js). This app's source is released under MIT.
