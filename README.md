# **Technologies Used**
+ Javascript
+ Node.js
+ Express
+ AWS S3 buckets

# **Installation**
npm install
npm run server

# **Development Process**
I started this project by catalouging all of the required specifications given to us by General Assembly. I then set out with first creating the HTML skeleton for user login forms and the necessary navigation menu options for all of the various actions a user is able to make.

After the layout was created I set out by creating the code logic for user authorization and menu navigation. Once the user auth menu was fully functional I then set up the API calls that logged the user data for CRUD to a resource. Now that I could interact with resources from my frontend to backend I then integrated AWS S3 buckets to store file uploads in a cloud based service.

# Unsolved problems
I wanted to integrate third party APIs to allow the user to access their profile pictures from other sites such as GitHub, Facebook, and Instagram. 

### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |

### Uploads

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST | `/create-uploads`             | `users#create`    |
| GET | `/uploads`             | `users#show`    |
| GET | `/uploads/:id` | `users#show:id`  |
| DELETE | `/uploads/:id`        | `users#delete`   |
| PATCH | `/uploads/:id`        | `users#update`   |


# Wireframes
Website wireframe https://imgur.com/yoQYH7L
ERD https://imgur.com/a/dDpEiZH

# User Stories
User can sign in/out/up/out and change password
User can upload, update, show, and delete file uploads.

