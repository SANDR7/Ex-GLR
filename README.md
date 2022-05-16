This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install
# then
npm run prepare
# then
npm run dev
```

Now you can start editing `/pages/index.tsx`

### Helpful commands

```bash
// format all files with prettier
npm run format
-------------
// check prettier format
npm run check
-------------
// analyze bundle size
npm run analyze
-------------
// view prisma studio
npm run db:view
-------------
// push database table models to remote server
npm run db:push
```

### Handy hash function in node

```bash
# Hash
node
# >
> require("crypto").randomBytes(64).toString('hex')
```
