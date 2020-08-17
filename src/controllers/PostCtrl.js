const PostProvider = require('../providers/PostProvider');

const getPosts = async (request, response) => {
	try {
		const posts = await PostProvider.getPosts(request.query.title || null);
		return response.status(200).json(posts);
	} catch (error) {
		return response.status(500).json({ message: 'Something went wrong!', error });
	}
}

const createNewPost = async (request, response) => {
	try {

		const { userId } = request.params;
		const { title, description, isVideo, mediaUrl, mediaName } = request.body;

		if (!title || !description) {
			return response.status(401).json({ message: 'Você precisa informar todos os campos' });
		}

		const post = { id: userId, title, description, createdAt: new Date().toISOString(), isVideo, mediaUrl, mediaName }

		await PostProvider.createNewPost(post);

		return response.status(200).json({ message: 'O novo post foi registrado' });

	} catch (error) {
		return response.status(500).json({ message: 'Something went wrong!', error });
	}
}

module.exports = { getPosts, createNewPost }