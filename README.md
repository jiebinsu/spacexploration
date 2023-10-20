# 🧑‍🚀 SpaceXploration 🚀

- NextJS
- React
- Prismane UI as Base
- Tailwind CSS
- Jest
- Playwright E2E Tests

## Getting Started

**Setup Environment**

```
nvm use
npm ci
```

**Running Unit Tests**

```
npm run test
```

**Running in Development Mode**

```
npm run dev
```

**Running in Production Mode**

```
npm run build
npm run start
```

**Running E2E UI tests**

This will require the app already being started, suggestion is to run in production mode.

```
npm run test:e2e
```

**Package Health**

```
npm audit
npm outdated
```

## Assumptions/Reasonings

* Assumed `/rockets` and `/launchpads` were separate microservices and could return much more data and therefore making queries for each id rather than querying all and caching.

* Use of NextJS to build fast and assumed this was a microfrontend which would we could future develop into SSR and/or make better use of RSCs.

* Use of Prismane UI to build fast without having to deal with CSS resets, theming etc...

* No Figma designs provided so CSS styling is roughly based from image and certain styling decisions made as image did not fit criteria.

## Future Improvements

* Depending on the use case - either convert to a serverless microfrontend app or introduce tRPC and separate the FE and BE

* Use something like Preact to reduce bundle size

* Server Side Rendered React / React Server Components

* Use of storybook for components and views

* Implement retries

* More thorough testing

* Revisit logging

* Local server caching

* Implement a search or infinite scroll for the launches
