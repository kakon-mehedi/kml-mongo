import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
	name: {
		type: String,
		max: 10,
		min: 5,
		required: true,
	},

	age: {
		type: Number,
		min: 18,
		required: true,
	},

	status: {
		type: String,
		enum: ['approve', 'pending', 'rejected'],
		required: true,
	},
});

export const User = mongoose.model('User', userSchema);
