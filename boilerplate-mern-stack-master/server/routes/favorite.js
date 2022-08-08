const express = require('express');
const router = express.Router();
const { Favorite } = require('../models/Favorite')

router.post('/favoriteNumber', (req, res) => {
  //req.body.movieId // 좋아요 숫자가 얼마나 되는지, body : index.js에서 bodyParser있음. 그래서 body를 이용하여 movieId를 받아내는거임


  // mongoDB에서 favorite 숫자를 가져오기
  Favorite.find({"movieId" : req.body.movieId})
  .exec(( err, info ) => {
    if(err) return res.status(400).send(err) // error의 정보를 클라이언트에 보냄
    
    // 그 다음 프론트에 다시 숫자 정보를 보내주기    
    res.status(200).json({ success:true, favoriteNumber : info.length })
  })
}) // Favorite.js에서 post request를 하기 때문에

router.post('/favorited', (req, res) => {
 
  // 내가 이 영화를 Favorite 리스트에 넣었는지 정보를 DB에서 가져오기
  Favorite.find({"movieId" : req.body.movieId, "userFrom" : req.body.userFrom})
  .exec(( err, info ) => {
    if(err) return res.status(400).send(err) // error의 정보를 클라이언트에 보냄
    
    let result = false;
    if(info.length !== 0){
      result = true
    }
    
    res.status(200).json({ success:true, favorited : result })
  })
})



// favorite list
router.post('/removeFromFavorite', (req, res) => {
   // 정보들을 DB에 넣어줌
  Favorite.findOneAndDelete({movieId: req.body.movieId, userFrom: req.body.userFrom}) // 이거 지워줘라
  .exec((err, doc) => {
    if(err) return res.status(400).send(err)
    res.status(200).json({success:true, doc})
  })
})

router.post('/addToFavorite', (req, res) => {
  const favorite = new Favorite(req.body) // instance 생성
  favorite.save((err, doc) => {
    if(err) return res.status(400).send(err)
    return res.status(200).json({success: true, doc})
  })
})


router.post('/getFavoriteMovie', (req, res) => {

  Favorite.find({'userFrom': req.body.userFrom})
  .exec((err, favorites) => {
    if(err) return res.status(400).send(err)
    return res.status(200).json({success:true, favorites})
  })
})

// list에서 삭제
router.post('/removeFromFavorite', (req, res) => {

  Favorite.findOneAndDelete({movieId: req.body.movieId, userFrom: req.body.userFrom})
  .exec((err, result) =>{
    if(err) return res.status(400).send(err)
    return res.status(200).json({success:true, result})
  })
})
module.exports = router;