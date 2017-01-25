let path  = require( 'path');
let mime = require('mime');
let crypto = require('crypto');
let fs = require('fs');


let multer  = require( 'multer');

exports.imageStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "../public/img/products"));
    },
    filename: function (req, file, callback) {
        crypto.pseudoRandomBytes(8, function (err, raw) {
            callback(null, (req.body.id || '') + '-' + raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});


exports.docsStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
        let size = file.size;
        callback(null, path.join(__dirname, "../public/docs"));
    },
    filename: function (req, file, callback) {
        crypto.pseudoRandomBytes(8, function (err, raw) {
            callback(null, (req.body.id || '') + '-' + raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});

exports.add_images = function(req,res,next) {
	if (!req.files){
		return res.status(500).json({ errMsg: "Invalid Form Data"});
	}
	let images = req.files.map((item)=>{ return '/api/img/products/'+item.filename;});        
	let delfiles = JSON.parse(req.body.del_images || "[]") || [];
	if( delfiles && delfiles.length){
		delfiles.forEach( (file) => fs.unlink(`./public/${file.trim().replace(/^\/api\//,'')}`, (err) => { err&&console.log(err);}));
	}
	Products.ProductModel.findOneAndUpdate(
		{_id: req.params.id},
		{$pushAll: { images}}
		, { multi: true , upsert: false, setDefaultsOnInsert: true,  returnNewDocument : false, runValidators: true }
	)
	.exec()
	.then( (images)=> { return res.json(images);})
	.catch(function(err){
		console.log(err);
		return res.status(500).json({
				errMsg:"Invalid Data"
		});
	});
}

 exports.add_docs = function(req,res,next) {
	if (!req.files){            
		return res.status(500).json({ errMsg: "Invalid Form Data"});
	}
	let docs = [];
	for (let file of req.files){
		docs.push({ 
			desc: file.filename,
			size: Math.ceil(file.size/1024),
			filetype: mime.extension(file.mimetype),
			src: '/api/docs/'+file.filename  
		});
	}
	let delDocs = JSON.parse(req.body.del_docs || "[]") || [];
	if( delDocs && delDocs.length){
		delDocs.forEach( (file) => fs.unlink(`./public/${file.src.trim().replace(/^\/api\//,'')}`, (err) => { err&&console.log(err);}));
	}        
	Products.ProductModel.findOneAndUpdate(
		{_id: req.params.id},
		{ $pushAll:{docs}}
		, { multi: true , upsert: false, setDefaultsOnInsert: true,  returnNewDocument : false, runValidators: true }
	)
	.exec()
	.then( (docs)=> { return res.json(docs);})
	.catch(function(err){
		console.log(err);
		return res.status(500).json({
				errMsg:"Invalid Data"
		});
	});
}