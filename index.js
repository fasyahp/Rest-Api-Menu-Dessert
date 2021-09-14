const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes")

mongoose
	//.connect("mongodb://localhost:27017/dbFasya", { useNewUrlParser: true })

	//.connect("mongodb+srv://fasyahp:1234@cluster0.jkzm3.mongodb.net/dbFasya?retryWrites=true&w=majority", { useNewUrlParser: true })
	.connect("mongodb+srv://fasyahp:1234@cluster0.jkzm3.mongodb.net/db_makanan?retryWrites=true&w=majority",{useNewUrlParser:true})
	//.connect("mongodb+srv://latihan:1234@cluster0.84qjy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser:true})
	.then(() => {
		const app = express()
		app.use(express.json()) // new
		app.use("/MenuDessert", routes)

		app.listen(5000, () => {
			console.log("Server has started!")
		})
	})