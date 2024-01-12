import { User } from '../models/user.model.js';

const demoUser1 = {
	name: 'kakon1',
	age: 19,
	status: 'pending',
};

const demoUser2 = {
	name: 'kakon2',
	age: 19,
	status: 'pending',
};

const params = {
	name: 'kakon',
};

export async function runUserOperations() {
	try {
		await getUsersWithParms();
	} catch (error) {
		console.log(error.message);
	}
}

async function createSingleUser(userPayload) {
	const user = await User.create(userPayload);
	console.log(user);
}

async function createMultipleUser(usersPayload) {
	const users = await User.create(usersPayload);
	console.log(users);
}

async function getUsers() {
	const users = await User.find();
	console.log(users);
}

async function getUserSkipSomeProperties() {
    // select all users but skip the value name and age 
    const users = await User.find().select('-name -age');

    // select all usrs but give only name and skip all other properties
    const users2 = await User.find().select('name');


}

async function getUsersWithLimit(limit) {
	const users = await User.find().limit(limit);
	console.log(users);
}

async function getUsersWithParms() {
	// find users where name == 'Kakon Mehedi' and age > 18
	const users = await User.find({
		name: 'Kakon Mehedi',
		age: { $gt: 18 },
	});

	// find users where name == age
	const users2 = await User.find({
		$expr: {
			$eq: ['$name', '$age'],
		},
	});

	// find users where name == age and status = pending or rejected
	const users3 = await User.find({
        $expr: { $eq: ['$name', '$age'] },
        $or: [{ status: 'pending' }, { status: 'rejected' }]
      });      

	console.log(user);
}

async function paginateUsersWithLimit() {
	const pageNumber = 1; // The page number you want to retrieve
	const pageSize = 10; // Number of documents per page

	const users = await User.find()
		.skip((pageNumber - 1) * pageSize)
		.limit(pageSize);

	const user = await User.where('name').eq('Kakon Mehedi').and('age').gt(18);
	console.log(user);
}

async function updateSingleUser(payload) {
	const user = await User.create(payload);
	console.log(user);
}

async function updateMulipleUser(payload) {
	const user = await User.create(payload);
	console.log(user);
}

async function deleteSingleUser(payload) {
	const user = await User.create(payload);
	console.log(user);
}
async function deleteMultipleUser(payload) {
	const user = await User.create(payload);
	console.log(user);
}
