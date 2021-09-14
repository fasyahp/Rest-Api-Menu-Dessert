const express = require("express")
const Makanan = require("./models/Makanan")
const Minuman = require("./models/Minuman")
const Auth = require("./models/Auth")
const router = express.Router()
var path = require('path');
var jwt = require('jsonwebtoken');

var cors = require('cors')
router.use(cors())
//===========================================

// function untuk mengecek token
function isAuthenticated(req, res, next) {
	var token = req.header('auth-token'); //req.body.token || req.query.token || req.headers.authorization; // mengambil token di antara request
	if (token) { //jika ada token
		jwt.verify(token, 'jwtsecret', function (err, decoded) { //jwt melakukan verify
			if (err) { // apa bila ada error
				res.json({ message: 'Failed to authenticate token' }); // jwt melakukan respon
			} else { // apa bila tidak error
				req.decoded = decoded; // menyimpan decoded ke req.decoded
				next(); //melajutkan proses
			}
		});
	} else { // apa bila tidak ada token
		return res.status(403).send({ message: 'No token provided.' }); // melkukan respon kalau token tidak ada
	}
}


// Router Untuk SPA page ====
router.get("/", async (req, res) => {

	res.sendFile(path.join(__dirname + '/view/index.html'));
})

router.get("/admin", async (req, res) => {

	res.sendFile(path.join(__dirname + '/view/admin_dashboard.html'));

})

router.get("/login", async (req, res) => {

	res.sendFile(path.join(__dirname + '/view/login.html'));

})

// Router Untuk Authentication dan Token ====

// authentication login

router.post("/login_auth", async (req,res) => {
	const user = await Auth.findOne({username: req.body.username, pass: req.body.pass})
	if(!user) return res.status(400).json({
		status: res.statusCode,
		message: 'Gagal Login!'
	})
	else
	var token = jwt.sign({username: req.body.username}, 'jwtsecret', {algorithm: 'HS256'})
	return res.status(200).json({
		token : token,
		username:req.body.username,
		status: res.statusCode,
		status: res.statusCode,
		message: 'Sukses Login!'
	})
})

// function untuk refresh token
router.post("/refresh_token", async (req, res) => {
	var last_username=req.body.username;
	var last_token=req.body.last_token;

	jwt.verify(last_token, 'jwtsecret', function(err, decoded){ //jwt melakukan verify
		if (err) { // apa bila ada error
		  res.json({message: 'Failed to authenticate token'}); // jwt melakukan respon
		 
		}else { // apa bila tidak error
		  req.decoded = decoded; // menyimpan decoded ke req.decoded

		 // terbitkan token baru
		  var token = jwt.sign({last_username}, 'jwtsecret', {algorithm: 'HS256', expiresIn:'20s'});
		  return res.status(200).json({  
			  token:token,
			  status: res.statusCode,
			  message: 'Token Baru!'
		  })
		}
	})
})


//Function cek apa boleh akses halaman
router.post("/cek_page", async (req, res) => {
	var old_token= req.body.old_token ;
	jwt.verify(old_token, 'jwtsecret', function(err, decoded){ //jwt melakukan verify
		if (err) { // apa bila ada error
		 // res.json({message: 'Halaman Tidak Diijinkan Diakses'}); // jwt melakukan respon
			 return res.status(200).json({
			message: 'not_ok'
		})
		}else { 
			return res.status(200).json({
				message: 'ok'
			})
			 
		}
		
		})
	
	})


// Router Untuk Minuman ====

// Get all posts

router.get("/MenuMinumanadmin", isAuthenticated, async (req, res, next) => {

	const MenuMinuman = await Minuman.find()
	res.send(MenuMinuman)
})

router.get("/MenuMinuman", async (req, res) => {

	const MenuMinuman = await Minuman.find()
	res.send(MenuMinuman)
})



// posting data

router.post("/MenuMinuman", async (req, res) => {
	const MenuMinuman = new Minuman({
		nama: req.body.nama,
		harga: req.body.harga,
		url_gambar: req.body.url_gambar

	})
	await MenuMinuman.save()
	res.send(MenuMinuman)
})

// update salah satu data di database  


router.patch("/MenuMinuman/:id", async (req, res) => {
	try {
		const MenuMinuman = await Minuman.findOne({ _id: req.params.id })

		if (req.body.nama) {
			MenuMinuman.nama = req.body.nama
		}

		if (req.body.harga) {
			MenuMinuman.harga = req.body.harga
		}

		if (req.body.url_gambar) {
			MenuMinuman.url_gambar = req.body.url_gambar
		}

		await MenuMinuman.save()
		res.send(MenuMinuman)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

// delete
router.delete("/MenuMinuman/:id", async (req, res) => {
	try {
		await Minuman.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

// ambil satu data

router.get("/MenuMinuman/:id", async (req, res) => {
	try {
		const MenuMinuman = await Minuman.findOne({ _id: req.params.id })
		res.send(MenuMinuman)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})





//========= Router Untuk Makanan ====
// Get all posts

router.get("/MenuMakananadmin", isAuthenticated, async (req, res, next) => {

	const MenuMakanan = await Makanan.find()
	res.send(MenuMakanan)
})

router.get("/MenuMakanan", async (req, res) => {

	const MenuMakanan = await Makanan.find()
	res.send(MenuMakanan)
})


// posting data

router.post("/MenuMakanan", async (req, res) => {
	const MenuMakanan = new Makanan({
		nama: req.body.nama,
		harga: req.body.harga,
		url_gambar: req.body.url_gambar
	})
	await MenuMakanan.save()
	res.send(MenuMakanan)
})



// update salah satu data di database  
router.patch("/MenuMakanan/:id", async (req, res) => {
	try {
		const MenuMakanan = await Makanan.findOne({ _id: req.params.id })

		if (req.body.nama) {
			MenuMakanan.nama = req.body.nama
		}

		if (req.body.harga) {
			MenuMakanan.harga = req.body.harga
		}

		if (req.body.url_gambar) {
			MenuMakanan.url_gambar = req.body.url_gambar
		}

		await MenuMakanan.save()
		res.send(MenuMakanan)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})


router.delete("/MenuMakanan/:id", async (req, res) => {
	try {
		await Makanan.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})


router.get("/MenuMakanan/:id", async (req, res) => {
	try {
		const MenuMakanan = await Makanan.findOne({ _id: req.params.id })
		res.send(MenuMakanan)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

module.exports = router