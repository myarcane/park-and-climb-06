# park-and-climb-06

I moved this little heroku project in https://github.com/myarcane/my-portfolio using netlify serverless functions instead of heroku. The running app simply renamed "my crags" is accessible [here](https://florian.mailliet.me/mycrags)

## Initial need

The main climbing guide book of the Alpes Maritimes region called "the V4" uses UTM gps coordinates (e.g 32T 84609 41273) to either indicate the geolocation of the crag or the geolocation of the parking of the crag.
These type of coordinates are not practical at all because basic tools like google maps are simply not able to understand them.

## Solution

Here comes this small `Node.js` app to the rescue 🚀 :

-   Providing a tool to convert UTM coordinates into a decimal degree format (DD) fully understandable by google maps
-   It also records the results of the conversion for futur use by providing directly the google maps link associated with the parking of the crag.

## Technical stack

-   [parse-coords](https://www.npmjs.com/package/parse-coords) package to handle the conversion
-   Github and [@octokit/rest](https://www.npmjs.com/package/@octokit/rest) package to easily store the parking crags list
-   Deployed on Heroku
