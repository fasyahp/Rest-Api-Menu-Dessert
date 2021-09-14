const mongoose = require("mongoose")

const schema = mongoose.Schema({
	nama: String,
	harga: String,
	url_gambar: String,
})

module.exports = mongoose.model("makanan", schema)