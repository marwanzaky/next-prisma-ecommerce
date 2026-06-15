# MERN e-commerce
<div style="display: flex;">
  <img width="45%" height="auto" alt="mamolio vercel app_ (2)" src="https://github.com/user-attachments/assets/17d26b41-f219-408f-b9b4-f31e3f4e9477" />
  <img width="25%" height="auto" alt="mamolio vercel app_(iPhone 12 Pro) (3)" src="https://github.com/user-attachments/assets/8dd401b3-50cf-4b6d-96e3-c33647c41fab" />
  <img width="25%" height="auto" alt="mamolio vercel app_(iPhone 12 Pro) (5)" src="https://github.com/user-attachments/assets/60de2a88-7182-40fd-bafa-40350438afca" />
</div>


## about
the website project is a modern ecommerce store built from the ground up to deliver speed, security, and scalability. designed with nextjs 16, tailwind 4, nestjs, and postgresql.

- stable demo: https://mamolio.store
- beta demo (supporting product variants): https://v2.mamolio.store

<div>
  <img src="https://img.shields.io/badge/-TypeScript-2c3e50.svg?logo=typescript&style=flat">
  <img src="https://img.shields.io/badge/-Next.js-2c3e50.svg?logo=next.js&style=flat">
  <img src="https://img.shields.io/badge/-React-2c3e50.svg?logo=react&style=flat">
  <img src="https://img.shields.io/badge/-Redux-2c3e50.svg?logo=redux&style=flat">
  <img src="https://img.shields.io/badge/-Tailwind CSS-2c3e50.svg?logo=tailwindcss&style=flat">
  <img src="https://img.shields.io/badge/-Shadcn-2c3e50.svg?logo=shadcnui&style=flat">
  <img src="https://img.shields.io/badge/-PWA-2c3e50.svg?logo=pwa&style=flat">
  <img src="https://img.shields.io/badge/-Nest.js-2c3e50.svg?logo=nestjs&style=flat">
  <img src="https://img.shields.io/badge/-Node.js-2c3e50.svg?logo=node.js&style=flat">
  <img src="https://img.shields.io/badge/-PostgreSQL-2c3e50.svg?logo=postgresql&style=flat">
  <img src="https://img.shields.io/badge/-Prisma-2c3e50.svg?logo=prisma&style=flat">
  <img src="https://img.shields.io/badge/-Cloudinary-2c3e50.svg?logo=cloudinary&style=flat">
  <img src="https://img.shields.io/badge/-Google Analytics 4-2c3e50.svg?logo=google-analytics&style=flat">
  <img src="https://img.shields.io/badge/-Stripe-2c3e50.svg?logo=stripe&style=flat">
  <img src="https://img.shields.io/badge/-Swagger-2c3e50.svg?logo=swagger&style=flat">
  <img src="https://img.shields.io/badge/-JWT-2c3e50.svg?logo=JSON%20web%20tokens&style=flat">
  <img src="https://img.shields.io/badge/-Docker-2c3e50.svg?logo=docker&style=flat">
</div>

## 🛠 stack
- **core**: [nextjs 16.2](https://nextjs.org) + [react 19.2](https://react.dev) + [ts 6.0](https://typescriptlang.org)
- **ui**: [tailwind 4.2](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **redux**: [redux-toolkit](https://redux-toolkit.js.org)
- **auth**: [jwt](https://www.jwt.io) + [google-oauth-2.0](https://developers.google.com/identity/protocols/oauth2)
- **storage**: [cloudinary](https://cloudinary.com)
- **analytics**: [vercel](https://vercel.com/docs/analytics) + [google-analytics-4](https://developers.google.com/analytics)
- **db**: [prisma](https://www.prisma.io/) ([postgresql](https://www.postgresql.org/)) + [supabase](https://supabase.com/)
- **forms**: [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev)
- **tables**: [tanstack-table](https://tanstack.com/table)
- **payments**: [stripe](https://stripe.com)
- **api**: [nestjs](https://nestjs.com) + [swagger](https://swagger.io)

## key features
- **product variants**: option-based variants with selections, inventory, pricing, skus, and images.
- **seller dashboard**: create, edit, and delete products from /store/products.
- **product discovery**: product listing, search, filtering, sorting, categories, and pricing filters.
- **product details**: variant-aware product pages with image galleries, reviews, ratings, and structured metadata.
- **authentication**: email/password auth, jwt sessions, google oauth, email verification, password reset.
- **cart and checkout**: variant-based cart items and Stripe checkout sessions.
- **favorites and reviews**: customer favorites, product reviews, average ratings, and rating distribution.
- **seo: dynamic metadata**, JSON-LD product data, sitemap generation, and semantic page structure.
- **internationalization**: localized routes under /[lang] with translated product text support.
- **pwa support**: installable frontend with web app manifest.

## previews
<table>
  <tr>
    <td width="50%" valign="top">
      <strong>dynamic product variants</strong>
      <br />
      <span>dynamic variant matrix that instantly updates pricing, descriptions, stock levels, and media carousels based on selected options.</span>
      <br /><br />
      <video width="100%" src="https://github.com/user-attachments/assets/835b486d-1d11-4a22-86f1-e19b9ad56fec" muted autoplay loop controls></video>
    </td>
    <td width="50%" valign="top">
      <strong>product discovery</strong>
      <br />
      <span>search, filter, sort, and browse products across responsive layouts.</span>
      <br /><br />
      <video width="100%" src="https://github.com/user-attachments/assets/80ae5ddf-923e-4df0-9e4b-327ba1d03115" muted autoplay loop controls></video>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>seller dashboard</strong>
      <br />
      <span>manage products from the store dashboard with create, edit, and delete actions.</span>
      <br /><br />
      <video width="100%" src="https://github.com/user-attachments/assets/f38d3f09-470a-4a83-95fe-19032a9932e4" muted autoplay loop controls></video>
    </td>
    <td width="50%" valign="top">
      <strong>product editor</strong>
      <br />
      <span>create rich product listings with descriptions, media, pricing, and variants.</span>
      <br /><br />
      <video width="100%" src="https://github.com/user-attachments/assets/e6ebfc1d-54fc-4fa6-8c2e-091e393675ed" muted autoplay loop controls></video>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>cart & checkout flow</strong>
      <br />
      <span>dynamic variant selection, localized multi-currency pricing, and secure end-to-end payment processing via stripe sandbox.</span>
      <br /><br />
      <video width="100%" src="https://github.com/user-attachments/assets/7c229770-9e00-468c-8ad0-269a6907689d" muted autoplay loop controls></video>
    </td>
    <td width="50%" valign="top">
      <strong>ai internationalization</strong>
      <br />
      <span>automated multi-language localization translating product titles, descriptions, and reviews into en, fr, and ar using LLMs.</span>
      <br /><br />
      <video width="100%" src="https://github.com/user-attachments/assets/0cf2f33e-42ed-4e67-89a9-bc84196f7d52" muted autoplay loop controls></video>
    </td>
  </tr>
</table>

## pages
- home: `/`
- products: `/products`
- product: `/products/:id`
- cart: `/cart`
- favorites: `/favorites`
- store: `/store/products`
- signin: `/signin`
- signup: `/signup`
- contact: `/contact`
- account: `/account`

## structure

```txt
.
├── api/                  # nestjs backend
├── web/                  # nextjs frontend
├── packages/database/    # prisma schema, generated client, shared db types
├── packages/types/       # shared typescript types
├── packages/ui/          # shared ui package
├── packages/eslint-config/
└── packages/typescript-config/
```

## apis
- **products**: product crud, variants, reviews, filtering, and product detail data.
- **carts**: variant-based cart items.
- **payments**: stripe checkout session creation.
- **auth**: signup, login, google oauth, email verification, password reset.
- **users**: profile and password management.
- **categories**: public and admin category apis.
- **favorites**: saved product management.
- **uploads**: media upload support.
- **contact** messages: Contact form and admin message handling.
- **chat**: ai-assisted chat endpoint.

## contact

have questions, feedback, or want to collaborate? feel free to reach out!

- **email**: marouaneezzaky@gmail.com
