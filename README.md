# MERN e-commerce
<div style="display: flex;">
  <img width="45%" height="auto" alt="mamolio vercel app_ (2)" src="https://github.com/user-attachments/assets/573e662d-5d05-4ee3-b488-78d22209c746" />
  <img width="25%" height="auto" alt="mamolio vercel app_(iPhone 12 Pro) (3)" src="https://github.com/user-attachments/assets/a89e900c-ae8a-4e53-a370-7934cb944a54" />
  <img width="25%" height="auto" alt="mamolio vercel app_(iPhone 12 Pro) (5)" src="https://github.com/user-attachments/assets/85d44382-d6ff-4a64-8be9-20418566c77d" />
</div>


## about

[Website](https://mamolio.store) project is a modern ecommerce store built from the ground up to deliver speed, security, and scalability. Designed with Next.js 16, Tailwind CSS 4, NestJS, and MongoDB.

<div>
  <img src="https://img.shields.io/badge/-TypeScript-2c3e50.svg?logo=typescript&style=flat">
  <img src="https://img.shields.io/badge/-Next.js-2c3e50.svg?logo=next.js&style=flat">
  <img src="https://img.shields.io/badge/-React.js-2c3e50.svg?logo=react&style=flat">
  <img src="https://img.shields.io/badge/-Redux-2c3e50.svg?logo=redux&style=flat">
  <img src="https://img.shields.io/badge/-Tailwind CSS-2c3e50.svg?logo=tailwindcss&style=flat">
  <img src="https://img.shields.io/badge/-Shadcn-2c3e50.svg?logo=shadcnui&style=flat">
  <img src="https://img.shields.io/badge/-PWA-2c3e50.svg?logo=pwa&style=flat">
  <img src="https://img.shields.io/badge/-Nest.js-2c3e50.svg?logo=nestjs&style=flat">
  <img src="https://img.shields.io/badge/-Node.js-2c3e50.svg?logo=node.js&style=flat">
  <img src="https://img.shields.io/badge/-MongoDB-2c3e50.svg?logo=mongodb&style=flat">
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
- **db**: [mongodb](https://www.mongodb.com/) + [mongoose](https://mongoosejs.com)
- **forms**: [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev)
- **tables**: [tanstack-table](https://tanstack.com/table)
- **payments**: [stripe](https://stripe.com)
- **api**: [nestjs](https://nestjs.com) + [swagger](https://swagger.io)

## Features
- SEO friendly
  - Dynamic product metadata
  - Dynamic product structured data
  - Dynamic sitemap.xml
- Lightweight and instant load
- High-quality code and a very structured codebase
- Sign in/Sign up with email and password (JWT), or with Google (OAuth 2.0)
- Easily customize design with shadcn [create](https://ui.shadcn.com/create). Copy the preset and use the command `npx shadcn@latest init --preset [CODE]` in `/web` directory
- Full-stack Monorepo
  - `/web` for front-end
  - `/api` for back-end
  - `/shared` for shared typescript files
- Progressive Web Apps (PWA) support
- Response on mobile, tablets, and desktop
- Lighthouse scores
  - **Semantic HTML:** Correct heading hierarchy and ARIA landmarks.
  - **Optimized Core Web Vitals:** Near-instant page loads and minimal layout shift.
  - **Search Engine Optimized:** Dynamic JSON-LD structured data, automated sitemaps, and optimized metadata for every product page.
<img width="1024" height="188" alt="googlechrome github io_lighthouse_viewer_ (1)" src="https://github.com/user-attachments/assets/d77d59af-024a-4ed0-a1f8-59a0233ecb42" />
<img width="1304" height="278" alt="www google com_search_q=mamolio oq=mamolio gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MgYIAhBFGDwyBggDEEUYPDIICAQQRRgnGDsyBggFEEUYOzIGCAYQRRg7MgYIBxBFGEHSAQgxOTY2ajBqN6gCALACAA sourceid=chrome ie=UTF-8" src="https://github.com/user-attachments/assets/6f3ada84-47c5-42b0-af2d-cafec1003b7c" />

## Available Pages
- Home: `/`
- Products: `/products`
- Product: `/products/:id`
- Cart: `/cart`
- Favorites: `/favorites`
- Store: `/store/products`
- Signin: `/signin`
- Signup: `/signup`
- Contact: `/contact`
- Account: `/account`

## 📂 Project Structure
```
├── api/          # NestJS Backend
├── web/          # Next.js Frontend
└── shared/       # Shared TypeScript interfaces
```

## Features
### 🔎 Search & Filtering `/products`
- Search products by name/keyword
- Filter by category, price, or other attributes
- Sorting options (price, newest, etc.)
<img width="60%" height="auto" alt="mamolio store_products_sort=relevancy minPrice=299 maxPrice=1299 rating=3" src="https://github.com/user-attachments/assets/4936b492-a564-4477-85a9-40d1a42d9946" />
<img width="35%" height="auto" alt="mamolio store_products_sort=relevancy" src="https://github.com/user-attachments/assets/745505ee-2018-4538-b355-c295927dfda9" />

### Form Validation
<img width="auto" height="512" alt="mamolio store_signup (2)" src="https://github.com/user-attachments/assets/b4305f17-acd7-48d1-82cb-b6d343fd2329" />

### 🛍️ Store `/store/products`
- Create, edit, and delete products
- Rich WYSIWYG editor with support for images, formatting, and YouTube Shorts embeds.
<img width="60%" height="auto" alt="mamolio store_store_products" src="https://github.com/user-attachments/assets/44b16563-6378-4053-a5ea-2e955a72cb9a" />
<img width="35%" height="auto" alt="mamolio store_store_products_67746fbf537e5b283bd1352a" src="https://github.com/user-attachments/assets/999dd4ea-b5ac-426b-9d4c-31d61ec56d5e" />

## Contact

Have questions, feedback, or want to collaborate? Feel free to reach out!

- Email: marouaneezzaky@gmail.com
