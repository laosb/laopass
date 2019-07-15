# Laopass Server

## Usage

`yarn && yarn start`

For production deploy, you may want to use `pm2` or something to keep this up.

Also, be warned that this server doesn't verify / ratelimit registration. I recommend you shut down registration in `config.js` after your own account for personal use.

I didn't implement session expiration yet, and you'll need to delete all objects in `session` key to manually clear sessions.

Do back up db.json regularly.
