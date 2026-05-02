# Welcome to News2You!📰

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## What does it do and how do I use it?

This app is designed as a personalized, filterable news feed that allows the user to search, filter, and save news articles according to their preference. The inspiration for the app derives from the often overwhelming feeling that one gets when visiting modern news websites. We attempted to create a more curated way to experience world events. 

After creating a user account, navigate to the the **Preferences** page and select your preference parameters. 

To narrow down the types of articles that show up in your feed, users can select from 7 preferences (business, entertainment, general, health, science, sports, and technology). 

Selecting one of these fields will pull down articles that are tagged according to the selected topic. 

For a more focused search, users can add keywords to their search (such as "gas prices") and specify the source of the news article (NPR, etc.). After setting keywords and sources, users can save or alter their preferences and the data will persist between sessions.

After selecting preferences, the user will be directed to their **Feed** which will show their filtered news preferences. On the feed, users can select articles that they want to save to read later. This data will also persist between sessions. 

**Note** Nothing will show up in your feed if you haven't set any preferences! Make sure you do that first!

## Where does the news come from?

News2You pulls an API feed from [NewsAPI.org](newsapi.org). This API was selected because of the filtering options for keywords, sources, and categories.

## How does it work?

The News2You stack sits on a MongoDB database hosted on [MongoDB Atlas](mongodb.com) using the aforementioned NewsAPI. 

The frontend uses Next.js as a page router as well as react 18. Some CSS styling has been applied though the alloted development timeframe did not allow for comprehensive styling. As such, the app layout follows very simple layout/design conventions. *Every effort has been made to minimize changes to the provided starter files.*

The backend of News2You uses Next.js API routes. Session and authorization management are through iron-session with bcrypt password hashing. 

## Project Structure

- components/
  - header/  ...site header with login/logout
  - nav/     ...main navigation bar
- controllers/
  - cont_article.js   ...saved article handler functions
  - preferences.js    ...preferences handler functions
- db/
 - models/
   - user.js  ...user schema
   - preference.js  ...preference schema
   - model_articles.js  ...saved article schema
 - connection.js        ...MongoDB connection
 - auth.js              ...login logic
 - user.js              ...user creation
 - preference.js        ...preference queries
 - dbArticles.js        ...saved article queries
- hooks/
 - useLogout.js         ...logout hook
 - usePreferences.js    ...preferences state management
- pages/
 - api/
   - auth/[action].js   ...login, logout, signup
   - feed.js            ...fetches news from NewsAPI
   - preferences/       ....GET and POST preferences
   - saved/             ...GET, POST, PUT, DELETE saved articles
 - index.jsx            ...home page
 - login.jsx            ...login page
 - signup.jsx           ...signup page
 - feed.jsx             ...news feed page
 - preferences.jsx      ...user preferences page
 - saved.jsx            ...saved articles page

## Want to contribute?
If you are interested in contributing to this project, please be advised that you will need a **.env** file in the root directory using the following three variables:

- MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
- IRON_PASS=<random_string_at_least_32_characters>
- NEWS_API_KEY=<your_newsapi_key>

## Run this app locally
Running this app locally requires [Docker](docker.com).

Run **npm run dev** to start the local MongoDB container and the Next.js server. 

The app will run at (http://localhost:3000).

**Note:** a MongoDB Atlas connection string is necessary for persistent data across sessions.
