const connection = require('../config/database');

const getPosts = (param) => {
	return new Promise(async (resolve, reject) => {
		try {

			var query = `SELECT tbu.name, tbp.title, tbp.description, tbp.created_at, tbp.is_video, tbp.media_url, tbp.media_name FROM tb_post AS tbp INNER JOIN tb_user AS tbu ON tbp.fk_id_user = tbu.id_user `;

			if (param) {
				query += `WHERE tbp.title LIKE '%${param}%'`;
			}

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

const createNewPost = (post) => {
	return new Promise(async (resolve, reject) => {
		try {

			const  { id, title, description, createdAt, isVideo, mediaUrl, mediaName } = post;
			const query = `INSERT INTO tb_post (fk_id_user, title, description, created_at, is_video, media_url, media_name)
				VALUES (${id}, '${title}', '${description}', '${createdAt}', ${isVideo}, '${mediaUrl}', '${mediaName}')
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

module.exports = { getPosts, createNewPost }