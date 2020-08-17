const connection = require('../config/database');

const createNewUser = (user) => {
	return new Promise(async (resolve, reject) => {
		try {

			const { name, email, password, createdAt, paid, profileImageUrl } = user;
			const query = `INSERT INTO tb_user (name, email, password, created_at, paid, profile_image_url) VALUES
				('${name}', '${email}', '${password}', '${createdAt}', ${paid}, '${profileImageUrl}')
			`;

			connection.query(query, (error, results) => {
				if (error) {
					return reject(error);
				} else {
					return resolve(results);
				}			
			});

		} catch (error) {
			return reject(error);
		}
	});
}

const findUserByEmail = (email) => {
	return new Promise(async (resolve, reject) => {
		try {

			const query = `SELECT id_user, name, email, password, paid FROM tb_user WHERE email = '${email}' LIMIT 1`;

			connection.query(query, (error, results) => {
				if (error) {
					return reject(error);
				} else {
					return resolve(results);
				}
			});

		} catch (error) {
			return reject(error);
		}
	});
}

const setUserAsPaid = (email) => {
	return new Promise(async (resolve, reject) => {
		try {

			const query = `UPDATE tb_user SET paid = true WHERE email = '${email}' LIMIT 1`;

			connection.query(query, (error, results) => {
				if (error) {
					return reject(error);
				} else {
					return resolve(results);
				}
			});

		} catch (error) {
			return reject(error);
		}
	});
}

module.exports = { findUserByEmail, createNewUser, setUserAsPaid }