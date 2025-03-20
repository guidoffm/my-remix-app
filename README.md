# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite) for details on supported features.

## Development

Run the Vite dev server:

```shellscript

dapr run --app-id elysia1 -- npm run dev

npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### Dapr config

At the moment the uses 2 bindings and 2 states.

The bindings are used for 

- sending SMTP email
- storing binary data for user uploaded files

The states are used for

- user database
- storing meta data for user uploaded files

For the states we need a state provider that supports the query interface. Currently PostgreSQL v1, 
MongoDB, Redis and CosmosDB are supported.

