const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
		unique: true,
	},
	token: { type: String, required: true },
	expireAt: { type: Date, default: new Date(), expires: 900 },
});

module.exports = mongoose.model("Token", tokenSchema);