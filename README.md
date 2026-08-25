# Gràcia Digital Sanctuary

Build a comprehensive, modern, highly interactive, and lightning-fast ("1000 km/h" performance) full-stack web application for "Paróquia San Juan de Gracia" (Barcelona).
Tech Stack: React, Vite, React Router DOM, Tailwind CSS, shadcn-ui, Framer Motion, and prepare logic for Supabase (Auth/DB) and Stripe.
Language: Portuguese (UI).

GLOBAL DESIGN & VIBE:
- Elegant, Catholic, and modernist aesthetic (inspired by Catalan modernism). Colors: White, soft grays, deep gold (#D4AF37), and peaceful blue.
- Use Framer Motion for page transitions and smooth scroll reveals (fade-in-up).
- Responsive, mobile-first approach using lucide-react icons.

GLOBAL HEADER & "AO VIVO" (LIVE) ALERT:
- Sticky Navbar with blurred glassmorphism.
- CRITICAL FEATURE: A dynamic "🔴 AO VIVO" (LIVE) pulsing badge in the header. When active (based on global state), it should display the text "🔴 AO VIVO - Missa em [Idioma]" (e.g., Catalão, Castelhano, Português). Clicking it redirects to `/ao-vivo`.

ROUTING STRUCTURE (React Router):
1. `/` (Home)
2. `/historia` (History)
3. `/galeria` (Gallery)
4. `/agendamento` (Tours & Confessions)
5. `/doacoes` (Stripe Donations)
6. `/ao-vivo` (Live Stream)
7. `/contato` (Contact)
8. `/admin-auth` (Hidden Login)
9. `/dashboard` (Protected Admin Area)

--- PAGE DETAILS ---

1. HOME PAGE (`/`):
- Hero Section: Large placeholder image of the church interior, title "Paróquia Sant Joan de Vila de Gràcia", and a "Ver Horários" CTA button.
- A Cruz do Papa (Historical Artifact): A special, elegant section highlighting the pale stone Crucifix that was next to the Pope in Barcelona. Design this section to reflect the stunning trencadís mosaic arches above it. Use rich typography.
- Horários (Cards):
  * Abertura: Seg-Sáb 11h-13h & 16h-20h | Dom/Feriados 10h-14h.
  * Missas: Seg-Sáb 19h (Catalão) | Dom/Feriados 11h (Catalão) & 13h (Bilíngue).
- News/Actualitat: Grid of events. Rule: If an event date is in the past, apply `grayscale opacity-60` to the card.
- Download Section: "Accedeix al Full Parroquial" PDF download button.
- Google Reviews: Horizontal auto-scrolling carousel of 5-star mocked reviews.

2. HISTÓRIA (`/historia`):
- A dedicated page telling the rich history of the church, known as a hidden gem of Gràcia ("Barcelona Secreta").
- Highlight the "Capilla del Santísimo", designed by Francesc Berenguer i Mestres.
- Include a section mentioning the guide Albert and the volunteer initiative to open this architectural treasure. 

3. GALERIA (`/galeria`):
- Beautiful masonry image grid showcasing the church. Hover effects (`hover:scale-105`).

4. DOADORES / STRIPE (`/doacoes`):
- A modern UI to "Apoie nossos projetos / Dízimos e Ofertas".
- Preset buttons (e.g., 10€, 20€, 50€).
- CRITICAL FEATURE: A custom amount input field (starting from 1€) where users can freely type any exact number they want to donate (e.g., 5, 100, 150).
- "Doar com Stripe" button with a loading spinner state.

5. AGENDAMENTOS (`/agendamento`):
- Split into two booking modules using shadcn Calendar:
  * MODULE A: Guided Tour with Albert. Available Morning (11:00-13:00). Duration selector: 15 min, 30 min, 1 hour.
  * MODULE B: Confessions with Padre Adilson. 10-minute slots. Include a dropdown/Select for Language preference: "Catalão", "Castelhano", "Português".

6. AO VIVO (`/ao-vivo`):
- A dedicated page for live masses.
- Large responsive video player placeholder (ready for a YouTube/Twitch iframe embed).
- Below the video, a dynamic title showing the current mass and language.

7. CONTATO & FOOTER:
- Info: info@santjoandegracia.cat | T. (+34) 932 37 73 59 | Carrer de la Santa Creu 2, 08024 Barcelona.
- Interactive: `mailto:`, `tel:`, and address linking to Google Maps. Embed Google Maps iframe.
- EASTER EGG & HIDDEN ADMIN (CRITICAL):
  * Center text: "© 2026 Todos os direitos reservados". 
  * Make ONLY the "©" symbol a hidden `<Link>` that routes directly to `/admin-auth`. 
  * STRICT RULE FOR "©": It must have ZERO hover effects. Use `cursor-default` so the mouse pointer does NOT change to a hand. No color change, no underline. It must be completely undetectable visually.
  * Signature: "By Sr.Mendes". Wrap in a group. On `hover`, trigger a beautiful golden glowing halo effect (auréola) above the text and a soft saintly light radial glow behind it using Tailwind pseudo-elements (`before:`, `after:`). Must link to `https://www.linkedin.com/in/sr-mendes` (target="_blank").

8. AUTH & ADMIN DASHBOARD (`/dashboard`):
- Login Page (`/admin-auth`): "Login with Google" button (mocked Supabase OAuth).
- Role-Based Access Control (RBAC): Mocked user state. If `user.email === 'hisrmendes@gmail.com'`, grant full "Super Admin" privileges.
- Dashboard Features:
  1. Live Stream Controller: A master switch to toggle the site's "Live Mode" ON/OFF. Inputs to paste the stream URL and select the broadcast language.
  2. Overview: Faturamento (Invoicing/Donation stats from Stripe).
  3. Weekly Calendar (Booksy-style): Visual grid showing Albert's tours and Padre Adilson's confessions.
  4. Content Management: Publish News, update PDF, manage Gallery.
  5. Team Management (Super Admin only): Add employees to make publications.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cia-sanctuary-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/41359794-be13-4768-b301-41f035579d60).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
