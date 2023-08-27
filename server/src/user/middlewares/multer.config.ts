import { diskStorage } from 'multer';
import { extname } from 'path';
import { UnauthorizedException } from '@nestjs/common';

// Multer is a popular middleware used for handling file uploads in Node.js applications.
// this code sets up Multer to handle file uploads with specific constraints (file size, allowed extensions) and customizes the storage location and filenames of the uploaded files. 
export const MulterConfig = {
	limits: {
		fileSize: 1024 * 1024 * 8,
	},
	fileFilter: (req, file, callback) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return callback(new UnauthorizedException('Only image files are allowed!'), false);
		}
		callback(null, true);
	},
	storage: diskStorage({
		destination: (req, file, callback) => {
			callback(null, './storage/uploads');
		},
		filename: (req, file, callback) => {
			const name = file.originalname.split('.')[0];
			const fileExtName = extname(file.originalname);
			const randomName = Array(4)
				.fill(null)
				.map(() => Math.round(Math.random() * 16).toString(16))
				.join('');
			callback(null, `${name}-${randomName}${fileExtName}`);
		},
	}),
};