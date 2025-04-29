
### how to run dev mode

docker compose --profile dev up

### how to run prod mode

docker compose --profile prod up

## how to build this file?

### for dev mode

docker compose --profile dev up --build

### for prod mode

docker compose --profile prod up --build


## corre el seed 
docker compose run seed 

# como correr eso
1. git clone <repo>
2. cd <repo>
3. docker compose --profile dev up -d       # spin up db+api+web
4. docker compose run seed                  # load your FAQs