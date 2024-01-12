import { runUserOperations } from './controllers/user.controller.js';
import { connectDB } from './db.js';


connectDB()
	.then(() => {
		console.log('Database connected successfully');
	})
	.catch((err) => {
		console.log(err);
	});

// Import Models Operations
runUserOperations();






