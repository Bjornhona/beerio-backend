const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/user');

router.get('/', (req, res, next) => {
  axios.get('https://api.brewerydb.com/v2/beers?key=1ff4f5a771c204dd18912e145d2e13ac')
    .then((result) => {
      result = result.data.data.filter((item) => {
        return item.hasOwnProperty("labels");
      })
      return res.json(result)
      // if (!error && result.statusCode === 200) {
        
      //   return res.json(result);
      // }
    })
    .catch((error) => {
    })
})

router.get('/favorites', (req, res, next) => {
  console.log('Favorites går');
  const userId = req.session.currentUser._id;

  User.findById(userId)
    .then((user) => {
      console.log(user.favorites)
      return res.status(200).json(user.favorites);
    })
    .catch((error) => {
      next(error);
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  axios.get(`https://api.brewerydb.com/v2/beer/${id}?key=1ff4f5a771c204dd18912e145d2e13ac`)
    .then((result) => {
      const data = result.data.data;
      return res.status(200).json(data)
    })
    .catch((error) => {
      next(error);
    })
})


router.put('/', (req, res, next) => {
  const { id, name, isOrganic, icon } = req.body;
  const userId = req.session.currentUser._id;

  User.findById(userId)
    .then((user) => {
      const fav = user.favorites.find(favorite => {
        return favorite.id === id;
      });
      const position = user.favorites.indexOf(fav);
      if (position < 0) {
        user.favorites.push({ id, name, isOrganic, icon });
      } else {
        user.favorites.splice(position, 1)
      }
      user.save()
      .then((user) => {
        res.status(200).json({ message: 'update' });
      })
      .catch(next)
    })
    .catch(next)
})

// router.put('/webdevs/:id', (req, res, next) => {
//   const { id } = req.params;
//   const webdevToUpdate = {
//     title: req.body.title,
//     text: req.body.text,
//     image: req.body.image || '',
//   };

//   WebDev.findByIdAndUpdate(id, webdevToUpdate, (err) => {
//     if (err) {
//       next(err);
//     } else {
//       res.status(200).json({ message: 'updated' });
//     }
//   });
// });

module.exports = router;