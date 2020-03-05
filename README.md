## Mapify (working lazy title)

After spending a long time solo backpacking, I thought it would be neat to have a site that displayed both where I've been, as well as showing some of my favorite pictures.  I decided to spin up a React project partly to get experience using some technologies I had missed out on.

This app relies on image metadata and (currently) custom JSON info files written by the user.  It is displayed using react-leafly.

I originally wanted to use the data from Google Timelines to get a very accurate map of everywhere the user has been, but aggregating that data was difficult, and it seems a little invasive.  It will probably be removed in the future.

## Starting the app

In the project directory, you can run:

### `npm install`
### `npm start`

Note this also requires setup to format your data, (downloading location data from google, selecting images, tweaking the settings in the python script, and running two scripts), that I am not going into detail on, as this will probably change soon!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
