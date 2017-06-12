# scaling-parakeet
# author: vivek singh

                                                  Steps to create SPA application
I can divide this application in 2 parts.
  1.	Node Server 
  2.	Client

To configure the node JS server, below are the steps.

1.	Install node js
2.	Install express-generator by using command: npm install -g express-generator
3.	Create an express project : C:\node>express imdbServer, imdbServer is my project name
4.	C:\xampp\imdbServer>npm install to install dependencies
5.	Now as I am going to use the imdb api keys to get the data, install the imdb api module : npm install –save imdb-api.
6.	Configure the app.js file according to the requirement, in my case I have require my data provider app and configure one route url to     expose the route for the client.
7.	In imdbDataProvider use this exposed route to get the search query and passed the data back to the client.

To configure the client application below are the steps.

1.	Create client project.
2.	Create one framework to load all the applications, in my case now I have only two applications to load.
    a.	imdbDataPresenter : used to render the data
    b.	imdbDataProvider. Used to get the data from the server based on the query provided by the app imdbDataPresenter.
3.	In this client application there are some framework files
    a.	Framework.js : to start the framework structure.
    b.	ApplicationManager : load all the applications
    c.	ResourceLoader: load all the resources i.e js files, css files.
    d.	templateManager: to load and create the template object because I have used Handlebar templating to handle rendering of data.
4.	To run the application on local I have used Apache server.

