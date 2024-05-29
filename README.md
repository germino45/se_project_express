# WTWR (What to Wear?): Back End

This project focuses on the development of a server for the WTWR application. This project uses Mongoose, a JavaScript object-oriented programming library commonly used to connect MongoDB and Node.js. This project allows for the creation and storage of both users and clothing items created through a server that allows for API calls.

## Cloud Deployment and Hosting

Domain Name — https://wtwr.elephantass.com

Users can now put the website above into the address bar of their browser to access this site. Users can signup, login, add cards and see other users' cards.

### Technologies

Database — a storage of organized data with multiple ways of access.

Server — a constantly running computer that runs special programs that proccess incoming request and sends responses to them.

API/(Application Programming Interface) — Allows users to interact with application though the use of request which the application the returns responses which affect what the user sees.

Middleware — Currently, the middleware was used to authorize users through a hardcoded ID (this will be fixed later on). Middleware is commonly used to write request processing code in a seperate module to declutter routes. It is aslo a good place to move code that will need to be repeated often.

Routes — Routes allow for API calls to made through the application without having all the code in one place. Specifically in this project, the routes were broken up even further into two seperate routes. One route for clothing items and one for users.

Schemas/Models — Schemas set a predetermined structure containing properties such as name or imageURL that describes what a database document should look like. Models are then used to create the document itself. Models allow the reading, addition/deletetion or update of documents.

Postman — Postman is a tool used to test APIs.

MongoDB — a commonly used database that it NoSQL or a database that doesnt use relational tables.

Mongoose — used to allow for Javascript objects to work with database documents.
