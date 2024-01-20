This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Pixel Arcade

This is a web app that allows you to play many different games in your browser, inspired by classic arcade games.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## With Docker

```
docker build -t pixel-arcade-docker .

docker run -p 3000:3000 pixel-arcade-docker 
```

## Prisma development setup
With a PostgreSQL database setup, run the following to install and/or setup Prisma

To install:
```
npm install prisma @prisma/client

npx prisma init
```
Setup: 

- Add url in .env with this format: postgres://{username}:{password}@{hostname}:{port}/{database-name}
- ```npx prisma db pull``` to pull schema from database at url
- ```npx prisma generate``` to generate Prisma client from schema
- More info: https://vercel.com/guides/nextjs-prisma-postgres


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.