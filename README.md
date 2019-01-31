Simple web server printing messages at given time

Startup:

1. Rename `server/config/config.example.json` to `server/config/config.json`.
Feel free to change any values there according to your preferences.
2. Start server with `npm start` command

To create a message send POST request to `/api/messages/echoAtTime`
with 'message' and 'time' parameters in the body. Time should be in `YYYY-MM-DD HH:mm:ss:SSS` format.

Message will be stored and printed to server console at given time in the future.
If supplied time is equal or earlier than current server time - message will be printed immediately.
