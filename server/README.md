# Laopass Server

## Usage

`yarn && yarn start`

For production deploy, you may want to use `pm2` or something to keep this up. Take the following snippet for your deployment reference.

```sh
pm2 start --name=laopass yarn -- start -l tcp://127.0.0.1:10001
```

Laopass Server uses `micro` for requests so take a look at https://github.com/zeit/micro#command-line to learn more about its options.

Also, be warned that this server doesn't verify / ratelimit registration. I recommend you shut down registration in `config.js` after your own account for personal use.

I didn't implement session expiration yet, and you'll need to delete all objects in `session` key to manually clear sessions.

Do back up db.json regularly.
