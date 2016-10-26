var express = require('express');
var router = express.Router();
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload',function(req,res){
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = "public/dist/img/upload";
  form.keepExtensions = true;
  form.maxFieldsSize = 2 * 1024 * 1024;
  form.maxFields = 1000;
  form.multiples = true;

  form.parse(req, function(err, fields, files) {
  });
  res.send({ code: 'ok' });
});

module.exports = router;
