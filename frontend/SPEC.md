# Tongyuanfang H5 Spec

## Global
- H5 mobile layout: width 375px design, height 812px baseline, pages can scroll longer.
- Use relative assets path under /public/assets/**.
- Global language switch CN/EN affects:
  - PDF opened by Read Book
  - Chatbot answer language (force output language)
  - Suggested questions list language (two question banks)

## Pages
### 1) Cover
- Center building is looping GIF.
- Button "Get Started" enters Home.

### 2) Home
- Read Book:
  - If lang=CN open Chinese PDF, if lang=EN open English PDF.
  - Book icon has breathing animation.
- Click "What happened during this era?" -> enter Chat page.
- Bottom navigation has 4 entries: Overview, History, Architecture, Voices.
  - Each entry opens Detail page with different content.
- "What happened during this era?" has looping typewriter animation (character-by-character).

### 3) Detail
- Top-left back returns to Home.
- Top carousel with several images.
- Tabs in design may vary (3/4/5), but implement fixed 4 pages based on Home categories to reduce errors:
  - Overview / History / Architecture / Voices
- Bottom content is editable.
- "AskMe" and chatbot entry have breathing animation, click enters Chat.
- If user enters Chat from Detail, back in Chat returns to this Detail.

### 4) Chat
- Top fixed region:
  - Priest greeting bubble text + priest model area is fixed.
- Message bubbles:
  - Bubble is image background, not vector.
  - If text exceeds bubble size, bubble container must expand to contain text (no text overflow outside).
- Suggested questions:
  - Total 20 questions per language bank.
  - Randomly show 2 items each time (CN bank for CN, EN bank for EN).
- Language forcing logic:
  - When lang=EN: regardless user input language, bot replies in English.
  - When lang=CN: regardless user input language, bot replies in Chinese.
  - Past messages can remain old language; only new replies follow current forced language.
- Session:
  - No login. Closing webpage clears context.

## Backend (Python)
- Provide /api/chat endpoint.
- Accept lang + user message + session id.
- Return reply text.
- Store conversation context in memory with TTL; if session disappears, context clears.