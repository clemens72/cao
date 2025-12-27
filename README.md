# Current Console Commands
npx prisma generate
npm run build
npx prisma migrate dev --name init
npm run dev

## OLD Instructions to Launch App with Docker

1. # Clone github repository to local folder /app
    - "git clone https://github.com/clemens72/cao app"

2. # Change working directory to /app
    - "cd app"

3. # Open up a new file in nano editor called '.env'
    - "nano .env"

4. # Copy over everything from .env (environment variables.)
    - Currently DATABASE_URL and three Clerk variables

5. # To save and close nano, 'CTRL + X' and 'Y'

6. # Begin building app container and db container from docker compoose file
    - "docker compose up --build"
    

7. # In a new terminal, run the prisma migration and prisma db seed
    # Using "docker ps" you can view and copy the name of the app container
    - docker exec -it [instance_id] sh -c "npx prisma migrate dev --name init && npx prisma db seed"
    - docker exec -it [instance_id] sh -c "npx prisma db seed"

# Installing Docker on Debian Linux: https://docs.docker.com/engine/install/debian/