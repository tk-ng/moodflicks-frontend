import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3001/";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

export class Api {
	// the token for interactive with the API will be stored here.
	static token;

	static async request(url, data = {}, method = "get") {
		// console.debug("API Call:", url, data, method);

		const headers = { Authorization: `Bearer ${Api.token}` };
		const params = method === "get" ? data : {};

		try {
			return (
				await axios({
					url,
					method,
					baseURL,
					data,
					params,
					headers,
					allowAbsoluteUrls: false,
				})
			).data;
		} catch (err) {
			console.error("API Error:", err.response);
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	// Individual API routes

	static async getUser(username) {
		let res = await this.request(`/users/${username}`);
		return res.user;
	}

	static async saveChanges({ username, data }) {
		let res = await this.request(
			`/users/${username}`,
			{ username, data },
			"patch"
		);
		return res.user;
	}

	static async deleteUser(username) {
		let res = await this.request(`/users/${username}`, {}, "delete");
		return res.user;
	}

	static async login(data) {
		let res = await this.request("auth/token", data, "post");
		return res.token;
	}

	static async signup(data) {
		let res = await this.request("auth/register", data, "post");
		return res.token;
	}

	static async getTrendingMovies() {
		let res = await this.request("/movies");
		return res.movies;
	}

	static async searchMovie(keyword) {
		let res = await this.request(`/movies/search/?keyword=${keyword}`);
		return res.movies;
	}

	static async getMovieDetail(id) {
		let res = await this.request(`/movies/${id}`);
		return res.movie;
	}

	static async getMovieCredits(id) {
		let res = await this.request(`/movies/${id}/credits`);
		return res.credits;
	}

	static async getActivities() {
		let res = await this.request(`/moods/activities`);
		return res.activities;
	}

	static async searchMood(keyword) {
		let res = await this.request(`/moods/search/?keyword=${keyword}`);
		return res.moods;
	}

	static async getMoods() {
		let res = await this.request(`/moods`);
		return res.moods;
	}

	static async getMoodsByUser(username) {
		let res = await this.request(`/users/${username}/moods`);
		return res.moods;
	}

	static async getMood(id) {
		let res = await this.request(`/moods/${id}`);
		return res.mood;
	}

	static async getMoviesByMood(id) {
		let res = await this.request(`/moods/${id}/movies`);
		return res.movies;
	}

	static async getMoodsByMovie(id) {
		let res = await this.request(`/movies/${id}/moods`);
		return res.moods;
	}

	static async getSimilarMoods(id) {
		let res = await this.request(`/moods/${id}/similar`);
		return res.moods;
	}

	static async getRecommendedMoviesByMood(id) {
		let res = await this.request(`/moods/${id}/recommended`);
		return res.movies;
	}

	static async createMood({ mood, username }) {
		let res = await this.request(`/moods`, { mood, username }, "post");
		return res.mood;
	}

	// needs username to verify in backend
	static async saveMoodChanges({ id, name, username }) {
		let res = await this.request(`/moods/${id}`, { name, username }, "patch");
		return res.message;
	}

	// needs username to verify in backend
	static async addMovieToMood({ moodId, movieId, username }) {
		const movies = await this.getMoviesByMood(moodId);

		if (movies.length) {
			const movieIds = movies.map((m) => m.id);
			if (movieIds.includes(movieId)) return null;
		}

		let res = await this.request(
			`/moods/${moodId}/movies/${movieId}`,
			{ username },
			"post"
		);
		return res.movieMood;
	}

	// needs username to verify in backend
	static async removeMovieFromMood({ moodId, movieId, username }) {
		let res = await this.request(
			`/moods/${moodId}/movies/${movieId}`,
			{ username },
			"delete"
		);
		return res.message;
	}

	// needs username to verify in backend
	static async deleteMood({ id, username }) {
		let res = await this.request(`/moods/${id}`, { username }, "delete");
		return res.message;
	}

	static async voteMood({ moodId, voteType, username }) {
		let res = await this.request(
			`/moods/${moodId}/vote/${voteType}`,
			{ username },
			"post"
		);
		return res.message;
	}
}
