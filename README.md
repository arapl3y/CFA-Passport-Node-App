# Passport and MongoDB notes:

What is User Authentication?

* Overview 
    - Passport is authentication middleware for Node
    - Authenticates requests
    - Provides both Local and OAuth authentication options
    - Takes away heavy lifting of creating sessions, logging in/out etc.

* Passport Strategies: 
    - Individual modules that will interface with DB, checking if you’re allowed to login (authenticate requests), e.g Local strategy check if user name and pw have been set correctly, facebook strategy check if token matches FB token etc.
    - Selecting specific strategies for your specific case removes unnecessary dependencies

* Sessions explanation:
    - Cookies hold session information
    - Passport establishes persistent login session with req.login()


* MongoDB commands:
    - In mongo CLI:
        + show dbs (will show existing dbs)
        + use db_name (will switch to/create a db)
        + db.createCollection('collection_name') (will create a collection in your db)
        + show collections (will show all your collections)
        + db.collection_name.find() (will show all objects in collection)

    mongod error 48:
        - ps aux | grep mongod in terminal
        - if any previous mongod processes are running
        + kill -2 process_id

* Dev steps:
    - Requires Node, MongoDB, Passport 
    1. Create project folder
    2. npm init
    3. Install dependencies
    4. app.js -> add dependencies
    5. Run mongo, create database
    6. app.js -> init, routes, config, etc.
    7. Create routes folder, index.js and users.js
    8. index.js routes   
    9. Views, Layouts etc.
    10. users.js routes, validation etc.
    11. Models folder -> user.js
    12. user.js schema, methods etc.
