# Backend

1. Using 
   1. Node.js, MongoDB, JWT
   2. Framework: Express.js
   3. Library: Mongoose (ORM), express-validator, BcrypyJS
2. Routes:
   1. Index Routes (/) 
      1. Primarily used for authentication related tasks
      2. /loging
      3. /register
      4. /logout
      5. /
         1. Getting user data
   2. Post Routes (/p)
      1. To handle post related tasks
      2. POST /
      3. GET  /
         1. get posts feed
      4. GET  /s
         1. will search a field across all the titles of the post 
   3. Comment Routes (/c)
      1. Almost similar to post routes
3. Middleware:
   1. Auth:
      1. Checks jwt inside the cookie and validate it for each request
   2. Validate:
      1. Through 400 (Bad request) error if any express-validator condition fails


# Frontend:

