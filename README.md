# ft_transcendence

ft_transcendence is the last project of the 42 Common Core.
It is a multiplayer web application that we developped as a team of 4 students in 3 months, with the following services :
- Authentication : handling hashed passwords, signup, signin, double auth and authentication with 42 API. Works with both JWT access and refresh token
- [Pong game](https://fr.wikipedia.org/wiki/Pong) allowing multiple games at the same time
- Chat : conversations, channels, channel management roles and actions (private/public, owner/admin/user, mute/kick/ban/invite) 
- User interface : update user infos, see game history, befriend or block other users

## Technical stack
- Frontend : ReactJs, Typescript, Material UI
- Backend : NestJs & Typescript
- Database : Postgresql via Prisma.io
- App deployment : Docker
- Other : socket.io for websockets (real-time game & conversations), Material UI for react components

## Run our project with docker
- A la racine du projet, construire les images docker et lancer les conteneurs docker avec la commande `docker compose up --build`
- Naviguer à l'adresse http://localhost:3000 : bienvenue sur notre page d'accueil !

## Documentation - TBC
- Please have a look at our wiki for exhaustive documentation of our project
https://github.com/42-team-transcendence/42_ft_transcendence/wiki

- Once all containers are up with `docker compose up --build`, visit http://localhost:3333/api to get the swagger docs of our API (en cours de construction)

