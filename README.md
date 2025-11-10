# CRUD API
Implementation task from rs-school to learn `node:http` and make simple CRUD appliaction .
### Run project
1. rename file .env.example -> .env
2. run command `npm install` from folder repo
3. run server in **modes**
    1. in development mode `npm run start:dev`
    2. in production mode `npm run start:prod`
    3. in cluster mode `npm run start:multi`
4. Example to check running application. Open Postman, select POST method, write `http://localhost:4000/api/users`, select *Body(raw,JSON)* and insert
    ```
    {
        "age": 30,
        "username": "Alex",
        "hobbies": ["Programming","Gym"]
    }
    ```
    In output get created user with `id`.