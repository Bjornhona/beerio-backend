const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const axios = require('axios');

router.get('/', (req, res, next) => {
  axios.get('https://api.brewerydb.com/v2/beers?key=1ff4f5a771c204dd18912e145d2e13ac')
    .then((result) => {
      console.log(result);
      result = result.data.data.filter((item) => {
        return item.hasOwnProperty("labels")
      })
      return res.json(result)
      // if (!error && result.statusCode === 200) {
        
      //   return res.json(result);
      // }
    })
    .catch((error) => {
      console.log(error);
    })
})

router.get('/id', (req, res, next) => {
  const id = req.params.id;
  axios.get(`https://api.brewerydb.com/v2/beer/${id}?key=1ff4f5a771c204dd18912e145d2e13ac`)
    .then((result) => {
      console.log(result);
      //return res.json(result)
    })
    .catch((error) => {
      console.log(error);
    })
})

module.exports = router;