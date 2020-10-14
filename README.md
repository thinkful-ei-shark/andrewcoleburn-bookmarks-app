This app was created as the final project for the asynchronous web apps curriculum in Thinkful's Engineering Immersion Program, Cohort 45. 

This app uses Thinkful's API. All data is wiped every 24 hours. Currently, this app only accesses one API endpoint, so all bookmarks created by all users on a given day will be accessible. 

Live App is here: https://thinkful-ei-shark.github.io/andrewcoleburn-bookmarks-app/

User Stories Completed: 

As a user:

- I can add bookmarks to my bookmark list. Bookmarks contain:

    - title
    - url link
    - description
    - rating (1-5)
    - I can see a list of my bookmarks when I first open the app

- All bookmarks in the list default to a "condensed" view showing only title and rating
I can click on a bookmark to display the "detailed" view

- Detailed view expands to additionally display description and a "Visit Site" link

- I can remove bookmarks from my bookmark list

- I receive appropriate feedback when I cannot submit a bookmark

- Check all validations in the API documentation (e.g. title and url field required)

- I can select from a dropdown (a <select> element) a "minimum rating" to filter the list by all bookmarks rated at or above the chosen selection