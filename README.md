# Setup

- Need to make `export` script using `export.example` with your IdentiKey username.  (Note: for some reason copying `export.example` directly doesn't seem to work so you need to made a new script with the same command).

- Need to run `npm install` in order to install all the developement dependencies.

- When ready to build there are several scripts in `package.json`.  Running `npm run build_final` will compile everything into `dist`, and then run the `export` script in order to upload everything to the Euclid server.