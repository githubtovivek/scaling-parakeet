var express = require('express');
var router = express.Router();
var omdb = require('imdb-api');
/* GET users listing. */
router.post('/getDataByName', function(req, res, next) {

  console.log(req.body.query);
      //imdb.get("Guardians of the Galaxy Vol. 2", {apiKey: "ae6969ba"}, function(things){
  //  console.log(things);
  //  res.send(200, things);
  //});
  res.send(200, Movies);
});

var Movies  = {
      "1" : {
            "name": "Fight Club",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date":"1999"
      },
      "2" : {
            "name": "Seven",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date": "1995"
      },
      "3" : {
            "name": "Troy",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date": "2004"
      },
      "4" : {
            "name": "Fury",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date": "2014"
      },
      "5" : {
            "name": "Snatch",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date":"2000"
      },
      "6" : {
            "name": "World Wae Z",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date": "2013"
      },
      "7" : {
            "name": "By The Sea",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date": "2015"
      },
      "8" : {
            "name": "12 Monkeys",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date": "1995"
      },
      "9" : {
            "name": "The Maxican",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date": "2001"
      },
      "10" : {
            "name": "Kalifornia",
            "imgURL":"/apps/IMDBDataPresenter/images/brad pitt.jpg",
            "release-date": "1993"
            }
};

module.exports = router;
