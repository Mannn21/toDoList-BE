import { Prisma, PrismaClient } from "@prisma/client";
import response from "../utils/response.js";
import { getPromiseData } from "../utils/getPromiseData.js";
import { searchCategoryById } from "../utils/getCategoryById.js";
import { searchUserById } from "../utils/getUserById.js";

const prisma = new PrismaClient();

const getActivities = async (req, res) => {
	try {
		const search = await prisma.activities.findMany();
		if (search.length < 1) {
			return response(404, "No data activity", null, "Not found", res);
		}
		if (search) {
			const data = await getPromiseData(search);
			return response(200, "Get Activities Success", data, "Ok", res);
		}
	} catch (err) {
		if (err.code === "ECONNREFUSED") {
			return response(
				500,
				"Connection refused, please try again later",
				null,
				"Internal server error",
				res
			);
		}
		return response(
			500,
			"Database query error",
			null,
			"Internal server error",
			res
		);
	}
};

const getActivitiesByUser = async (req, res) => {
	try {
		const { userId } = req.body;
		if (!userId) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		if (userId) {
			try {
				const search = await prisma.activities.findMany({
					where: {
						user_id: userId,
					},
				});
				if (!search) {
					return response(404, "No datas activity", null, "Not found", res);
				}
				if (search.length < 1) {
					return response(404, "No datas activity", null, "Not found", res);
				}
				if (search.length >= 1) {
					const data = await getPromiseData(search);
					return response(200, "Get Activities Success", data, "Ok", res);
				}
			} catch (err) {
				return response(500, err, null, "Internal server error", res);
			}
		}
	} catch (err) {
		if (err.code === "ECONNREFUSED") {
			return response(
				500,
				"Connection refused, please try again later",
				null,
				"Internal server error",
				res
			);
		}
		return response(
			500,
			"Database query error",
			null,
			"Internal server error",
			res
		);
	}
};

const getActivitiesByQuery = async (req, res) => {
	try {
		const { userId, category, status, date, createdAt } = req.body;
		if (!userId) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		if (userId) {
			try {
				const searchUser = searchUserById(userId)
				if (!searchUser) {
					return response(404, "No datas users", null, "Not found", res);
				}
				if (searchUser) {
					const statusStr = status !== undefined;
					try {
						if (userId && statusStr && !category && !date && !createdAt) {
							const searchByStatus = await prisma.activities.findMany({
								where: {
									user_id: searchUser.id,
									completed: status,
								},
							});
							if (searchByStatus.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (searchByStatus.length >= 1) {
								const data = await getPromiseData(searchByStatus);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && category && !statusStr && !date && !createdAt) {
							const searchCategory = searchCategoryById(category);
							const searchByCategory = await prisma.activities.findMany({
								where: {
									user_id: searchUser.id,
									category_id: searchCategory.id,
								},
							});
							if (searchByCategory.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (searchByCategory.length >= 1) {
								const data = await getPromiseData(searchByCategory);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && date && !statusStr && !category && !createdAt) {
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND DATE(date) = ${date}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && createdAt && !category && !date && !statusStr) {
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND DATE(createdAt) = ${createdAt}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && category && date && !statusStr && !createdAt) {
							const searchCategory = searchCategoryById(category);
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND DATE(date) = ${date} AND category_id = ${searchCategory.id}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && category && createdAt && !statusStr && !date) {
							const searchCategory = searchCategoryById(category);
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND DATE(createdAt) = ${createdAt} AND category_id = ${searchCategory.id}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && statusStr && category && !date && !createdAt) {
							const searchCategory = searchCategoryById(category);
							const search = await prisma.activities.findMany({
								where: {
									user_id: searchUser.id,
									category_id: searchCategory.id,
									completed: status,
								},
							});
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && statusStr && createdAt && !date && !category) {
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND DATE(createdAt) = ${createdAt} AND completed = ${status}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && statusStr && date && !createdAt && !category) {
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND DATE(date) = ${date} AND completed = ${status}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && date && createdAt && !statusStr && !category) {
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND DATE(date) = ${date} AND DATE(createdAt) = ${createdAt}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && statusStr && category && createdAt && !date) {
							const searchCategory = searchCategoryById(category);
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND category_id = ${searchCategory.id} AND DATE(createdAt) = ${createdAt} AND completed = ${status}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && statusStr && category && date && !createdAt) {
							const searchCategory = searchCategoryById(category);
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND category_id = ${searchCategory.id} AND DATE(date) = ${date} AND completed = ${status}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && statusStr && createdAt && date && !category) {
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND DATE(createdAt) = ${createdAt} AND DATE(date) = ${date} AND completed = ${status}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && category && createdAt && date && !statusStr) {
							const searchCategory = searchCategoryById(category);
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND category_id = ${searchCategory.id} AND DATE(date) = ${date} AND DATE(createdAt) = ${createdAt}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
						if (userId && statusStr && category && date && createdAt) {
							const searchCategory = searchCategoryById(category);
							const search = await prisma.$queryRaw(Prisma.sql`
								SELECT * FROM Activities WHERE user_id = ${userId} AND category_id = ${searchCategory.id} AND DATE(date) = ${date} AND completed = ${status} AND DATE(createdAt) = ${createdAt}
							`);
							if (search.length < 1) {
								return response(
									404,
									"No datas activity",
									null,
									"Not found",
									res
								);
							}
							if (search.length >= 1) {
								const data = await getPromiseData(search);
								return response(200, "Get Activities Success", data, "Ok", res);
							}
						}
					} catch (err) {
						return response(500, err, null, "Internal server error", res);
					}
				}
			} catch (err) {
				return response(500, err, null, "Internal server error", res);
			}
		}
	} catch (err) {
		if (err.code === "ECONNREFUSED") {
			return response(
				500,
				"Connection refused, please try again later",
				null,
				"Internal server error",
				res
			);
		}
		return response(
			500,
			"Database query error",
			null,
			"Internal server error",
			res
		);
	}
};

const createActivity = async (req, res) => {
	try {
		const { title, userId, category, date } = req.body;
		if (!title || !userId || !category || !date) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		if (title && userId && category && date) {
			const searchUser = searchUserById(userId)
			if (!searchUser) {
				return response(404, "No datas user", null, "Not found", res);
			}
			if (searchUser) {
				try {
					const searchCategory = searchCategoryById(category);
					if (!searchCategory) {
						return response(404, "No datas category", null, "Not found", res);
					}
					if (searchCategory) {
						const create = await prisma.activities.create({
							data: {
								title: title,
								user_id: searchUser.id,
								category_id: searchCategory.id,
								completed: false,
								date: date,
							},
						});
						const data = {
							id: create.id,
							title: create.title,
							category: searchCategory.category,
							color: searchCategory.color,
							date: create.date,
							createdAt: create.createdAt,
						};
						return response(201, "Create Activity Success", data, "Ok", res);
					}
				} catch (err) {
					return response(500, err, null, "Internal server error", res);
				}
			}
		}
	} catch (err) {
		if (err.code === "ECONNREFUSED") {
			return response(
				500,
				"Connection refused, please try again later",
				null,
				"Internal server error",
				res
			);
		}
		return response(
			500,
			"Database query error",
			null,
			"Internal server error",
			res
		);
	}
};

const updateActivity = async (req, res) => {
	try {
		const { userId, id, title, category, date } = req.body;
		if (!userId || !id || !title || !category || !date) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		if (userId && id && title && category && date) {
			const searchUser = searchUserById(userId)
			if (!searchUser) {
				return response(404, "No datas user", null, "Not found", res);
			}
			if (searchUser) {
				const searchActivity = await prisma.activities.findFirst({
					where: {
						id: id,
						user_id: searchUser.id,
					},
				});
				if (!searchActivity) {
					return response(404, "No datas activity", null, "Not found", res);
				}
				if (searchActivity) {
					const searchCategory = searchCategoryById(category);
					if (!searchCategory) {
						return response(404, "No datas category", null, "Not found", res);
					}
					if (searchCategory) {
						try {
							const updateActivity = await prisma.activities.update({
								where: {
									id: searchActivity.id,
								},
								data: {
									title: title,
									category_id: searchCategory.id,
									date: date,
								},
							});
							const data = {
								title: updateActivity.title,
								category: searchCategory.category,
								date: updateActivity.date,
								color: searchCategory.color,
							};
							return response(200, "Update Activity Success", data, "Ok", res);
						} catch (err) {
							return response(500, err, null, "Internal server error", res);
						}
					}
				}
			}
		}
	} catch (err) {
		if (err.code === "ECONNREFUSED") {
			return response(
				500,
				"Connection refused, please try again later",
				null,
				"Internal server error",
				res
			);
		}
		return response(
			500,
			"Database query error",
			null,
			"Internal server error",
			res
		);
	}
};

const deleteActivity = async (req, res) => {
	try {
		const { userId, id, category } = req.body;
		if (!userId || !id || !category) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		if (userId && id && category) {
			const searchUser = searchUserById(userId)
			if (!searchUser) {
				return response(404, "No datas user", null, "Not found", res);
			}
			if (searchUser) {
				const searchCategory = searchCategoryById(category);
				if (!searchCategory) {
					return response(404, "No datas category", null, "Not found", res);
				}
				if (searchCategory) {
					const searchActivity = await prisma.activities.findFirst({
						where: {
							id: id,
							user_id: searchUser.id,
							category_id: searchCategory.id,
						},
					});
					if (!searchActivity) {
						return response(404, "No datas activity", null, "Not found", res);
					}
					if (searchActivity) {
						try {
							await prisma.activities.delete({
								where: {
									id: searchActivity.id,
								},
							});
							return response(200, "Delete Activity Success", null, "Ok", res);
						} catch (err) {
							return response(500, err, null, "Internal server error", res);
						}
					}
				}
			}
		}
	} catch (err) {
		if (err.code === "ECONNREFUSED") {
			return response(
				500,
				"Connection refused, please try again later",
				null,
				"Internal server error",
				res
			);
		}
		return response(
			500,
			"Database query error",
			null,
			"Internal server error",
			res
		);
	}
};

const updateStatusCompleted = async (req, res) => {
	try {
		const { userId, id, completed, category } = req.body;
		if (!userId || !id || !category || !req.body) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		if (userId && id && category && req.body) {
			const searchUser = searchUserById(userId)
			if (!searchUser) {
				return response(404, "No datas user", null, "Not found", res);
			}
			if (searchUser) {
				const searchCategory = searchCategoryById(category);
				if (!searchCategory) {
					return response(404, "No datas category", null, "Not found", res);
				}
				if (searchCategory) {
					const searchActivity = await prisma.activities.findFirst({
						where: {
							id: id,
							user_id: searchUser.id,
							category_id: searchCategory.id,
						},
					});
					if (!searchActivity) {
						return response(404, "No datas activity", null, "Not found", res);
					}
					if (searchActivity) {
						try {
							const updateStatus = await prisma.activities.update({
								where: {
									id: searchActivity.id,
								},
								data: {
									completed: completed,
								},
							});
							const data = {
								title: searchActivity.title,
								category: searchCategory.category,
								completed: updateStatus.completed,
							};
							return response(200, "Update Status Completed", data, "Ok", res);
						} catch (err) {
							return response(500, err, null, "Internal server error", res);
						}
					}
				}
			}
		}
	} catch (err) {
		if (err.code === "ECONNREFUSED") {
			return response(
				500,
				"Connection refused, please try again later",
				null,
				"Internal server error",
				res
			);
		}
		return response(
			500,
			"Database query error",
			null,
			"Internal server error",
			res
		);
	}
};

export default {
	getActivities,
	getActivitiesByUser,
	createActivity,
	updateActivity,
	deleteActivity,
	updateStatusCompleted,
	getActivitiesByQuery,
};
