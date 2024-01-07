# Alumni API 
### CRUD API

Repo contains nodeJS apps which implement the API with and without a UI. The api endpoints use PassportJS with the details stored in a MongooseDB. The app also utilizes express sessions to prevent the user accessing certain pages without logging in and also openeing up access to other content if authorized

Using the PassportJS Mongoose strategy, the password is securely hashed and stored on mongoose. The passport is stored only in a salted hashed form to prevent leaks or security issues. The password update endpoint creates a new alumni object with the same data and a different password and is hashed as a new entry with the same alumniID and the older object is removed



<img width="960" alt="Screenshot 2024-01-07 222140" src="https://github.com/arunnats/csea-task/assets/118368673/d60d4c45-5a4f-4a5c-80fc-c45db57bf077" >
Salted and Hashed storage of details


The app with the UI makes certain changes to the nature of the api endpoints from the specified request type in the document in order to serve the data correctly with POST and GET requests. The app without the UI adheres to the specifications and also adds a logout endpoint to unauthenticate the session.

## Alumni Management App - UI

### Login page 
<img width="960" alt="Screenshot 2024-01-07 210742" src="https://github.com/arunnats/csea-task/assets/118368673/33752544-6954-4e9b-a5f2-ed3f0207ee6a">

### Register page
<img width="960" alt="Screenshot 2024-01-07 210756" src="https://github.com/arunnats/csea-task/assets/118368673/2f4ed0af-c90a-48f2-9673-7b5f8440a81a" >

### Dashboard page with dynamically generated input fields
<img width="960" alt="Screenshot 2024-01-07 215335" src="https://github.com/arunnats/csea-task/assets/118368673/8d6db864-1b4d-484a-9487-86d1f25668f3" >

## Alumni Management App - API endpoints (Without UI)

### Create endpoint - POST /api/alumni/register'
<img width="960" alt="Screenshot 2024-01-07 222430" src="https://github.com/arunnats/csea-task/assets/118368673/c50f361a-3589-4df7-98f3-f43bc960b2c2" >

### Read endpoint - GET  /api/alumni/login
<img width="960" alt="Screenshot 2024-01-07 222501" src="https://github.com/arunnats/csea-task/assets/118368673/ff8665f9-b4a5-468c-b05c-7832b39e1eb5">

### Update endpoint - PUT /api/alumni/update/:alumniID
<img width="960" alt="Screenshot 2024-01-07 222530" src="https://github.com/arunnats/csea-task/assets/118368673/8b878110-b6ba-412c-98ab-4ede1af2950a" >

### Delete endpoint - DELETE /api/alumni/delete/:alumniID
<img width="960" alt="Screenshot 2024-01-07 222721" src="https://github.com/arunnats/csea-task/assets/118368673/6a7d57d5-42b2-49c4-98aa-5c0009810405">

### All Alumni endpoint - GET /api/alumni/all
<img width="960" alt="Screenshot 2024-01-07 222558" src="https://github.com/arunnats/csea-task/assets/118368673/ea911e20-fd60-4374-a520-362c6c7fb1f0" >

### Change password endpoint -  POST /api/alumni/resetpass
<img width="960" alt="Screenshot 2024-01-07 222656" src="https://github.com/arunnats/csea-task/assets/118368673/0f78d07c-ff09-4c5d-8368-d24e12c09b8d" >

