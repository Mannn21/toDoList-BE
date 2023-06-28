import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import response from "../utils/response.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
	try {
		const search = await prisma.user.findMany();
		if (search.length < 1) {
			return response(404, "No datas user", null, "Not found", res);
		}
		if (search) {
			const data = search.map(user => {
				return { name: user.name, email: user.email, status: user.status };
			});
			return response(200, "Get users Success", data, "Ok", res);
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

const getUserByEmail = async (req, res) => {
	try {
		const email = req.body.email;
		if (!email) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
		if (!validEmail.test(email)) {
			return response(400, "Invalid email format", null, "Bad request", res);
		}
		const search = await prisma.user.findUnique({ where: { email } });
		if (!search) {
			return response(404, "No datas user", null, "Not found", res);
		}
		if (search) {
			try {
				const data = {
					name: search.name,
					email: search.email,
					status: search.status,
					create: search.createdAt,
				};
				return response(200, "Find user success", data, "Ok", res);
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

const createUser = async (req, res) => {
	try {
		const { name, email, password, confPassword } = req.body;
		if (!name || !email || !password || !confPassword) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
		if (!validEmail.test(email)) {
			return response(400, "Invalid email format", null, "Bad request", res);
		}
		const search = await prisma.user.findUnique({ where: { email } });
		if (search) {
			return response(409, "User email is regitered", null, "Conflict", res);
		}
		if (!search) {
			try {
				if (password !== confPassword) {
					return response(
						400,
						"Password not compare",
						null,
						"Bad request",
						res
					);
				}
				if (password === confPassword) {
					const encryptedPassword = await bcrypt.hash(password, 10);
					if (!encryptedPassword) {
						return response(
							500,
							"Generate Password error",
							null,
							"Internal server error",
							res
						);
					}
					if (encryptedPassword) {
						const createUser = await prisma.user.create({
							data: {
								name,
								email,
								password: encryptedPassword,
								status: true,
							},
						});
						const data = {
							name: createUser.name,
							email: createUser.email,
							status: createUser.status,
						};
						return response(201, "Create user success", data, "Success", res);
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

const updateUser = async (req, res) => {
	try {
		const { name, email, password, newPassword, confNewPassword } = req.body;
		if (!email || !password) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
		if (!validEmail.test(email)) {
			return response(400, "Invalid email format", null, "Bad request", res);
		}
		const search = await prisma.user.findUnique({ where: { email } });
		if (!search) {
			return response(404, "No datas user", null, "Not found", res);
		}
		if (search) {
			try {
				const compare = await bcrypt.compare(password, search.password);
				if (!compare) {
					return response(
						400,
						"Password not compare",
						null,
						"Bad request",
						res
					);
				}
				if (compare) {
					if (email && password && name && !newPassword && !confNewPassword) {
						if (name === search.name) {
							return response(200, "No data Updates", null, "Ok", res);
						}
						if (name !== search.name) {
							const update = await prisma.user.update({
								where: { email: search.email },
								data: { name },
							});
							const data = {
								name: update.name,
							};
							return response(200, "Updated Success", data, "Ok", res);
						}
					}
					if (email && password && !name && newPassword && confNewPassword) {
						const compare = await bcrypt.compare(newPassword, search.password);
						if (compare) {
							return response(200, "No data Updates", null, "Ok", res);
						}
						if (!compare) {
							const check = newPassword === confNewPassword;
							if (check) {
								const encryptedPassword = await bcrypt.hash(
									confNewPassword,
									10
								);
								if (!encryptedPassword) {
									return response(
										500,
										"Generate Password error",
										null,
										"Internal server error",
										res
									);
								}
								if (encryptedPassword) {
									const update = await prisma.user.update({
										where: { email: search.email },
										data: { password: encryptedPassword },
									});
									const data = {
										name: update.name,
										email: update.email,
									};
									return response(200, "Updated Success", data, "Ok", res);
								}
							}
							if (!check) {
								return response(
									400,
									"Password not compare",
									null,
									"Bad request",
									res
								);
							}
						}
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

const deleteUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
		if (!validEmail.test(email)) {
			return response(400, "Invalid email format", null, "Bad request", res);
		}
		const search = await prisma.user.findUnique({ where: { email } });
		if (!search) {
			return response(404, "No datas user", null, "Not found", res);
		}
		if (search) {
			try {
				const compare = await bcrypt.compare(password, search.password);
				if (!compare) {
					return response(
						400,
						"Password not compare",
						null,
						"Bad request",
						res
					);
				}
				if (compare) {
					const deleted = await prisma.user.delete({
						where: { email: search.email },
					});
					const data = { name: deleted.name };
					return response(200, "Deleted Success", data, "Ok", res);
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

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return response(400, "Missing required datas", null, "Bad request", res);
		}
		const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
		if (!validEmail.test(email)) {
			return response(400, "Invalid email format", null, "Bad request", res);
		}
		const search = await prisma.user.findUnique({ where: { email } });
		if (!search) {
			return response(404, "User not registered", null, "Not found", res);
		}
		if (search) {
			const compare = await bcrypt.compare(password, search.password);
			if (!compare) {
				return response(400, "Invalid password", null, "Bad request", res);
			}
			if (compare) {
				try {
					const searchLogin = await prisma.login.findUnique({
						where: { user_id: search.id },
					});
					const name = search.name;
					const email = search.email;
					const user_id = search.id;
					const accessToken = jwt.sign(
						{ name, email, user_id },
						process.env.ACCESS_TOKEN_SECRET,
						{
							expiresIn: "20s",
						}
					);
					const refreshToken = jwt.sign(
						{ name, email, user_id },
						process.env.REFRESH_TOKEN_SECRET,
						{
							expiresIn: "1d",
						}
					);
					const expiredTime = new Date();
					expiredTime.setDate(expiredTime.getDate() + 1);
					if (searchLogin) {
						req.session.userId = search.id;
						await prisma.login.update({
							data: {
								refresh_token: refreshToken,
							},
							where: {
								email: email,
							},
						});
						res.cookie(`refreshToken`, refreshToken, {
							httpOnly: true,
							maxAge: 24 * 60 * 60 * 1000,
						});
						return response(200, "Login success", accessToken, "Ok", res);
					}
					if (!searchLogin) {
						req.session.userId = search.id;
						await prisma.login.create({
							data: {
								name: search.name,
								user_id: search.id,
								email: search.email,
								refresh_token: refreshToken,
								expired_time: expiredTime,
							},
						});
						res.cookie(`refreshToken`, refreshToken, {
							httpOnly: true,
							maxAge: 24 * 60 * 60 * 1000,
						});
						return response(201, "Login Success", accessToken, "Ok", res);
					}
				} catch (err) {
					return response(500, err.message, null, "Internal server error", res);
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

const getRefreshToken = async (req, res) => {
	try {
		const { userId } = req.session;
		const refreshToken = req.cookies.refreshToken;
		if (!userId || !refreshToken) {
			return response(401, "Please login first", null, "Unauthorized", res);
		}
		if (refreshToken) {
			const search = await prisma.login.findFirst({
				where: {
					user_id: userId,
					refresh_token: refreshToken,
				},
			});
			if (!search) {
				return response(403, "Please login first", null, "Forbidden", res);
			}
			if (search) {
				try {
					const user = await prisma.user.findFirst({
						where: {
							email: search.email,
							id: search.user_id,
						},
					});
					if (!user) {
						return response(401, "User not found", null, "Unauthorized", res);
					}
					if (user) {
						jwt.verify(
							refreshToken,
							process.env.REFRESH_TOKEN_SECRET,
							(err, decode) => {
								if (err) return response(401, err, null, "Forbidden", res);

								const name = user.name;
								const email = user.email;
								const user_id = user.id;
								const accessToken = jwt.sign(
									{ name, email, user_id },
									process.env.ACCESS_TOKEN_SECRET,
									{
										expiresIn: "20s",
									}
								);
								return response(
									200,
									"Refresh Token Success",
									accessToken,
									"Ok",
									res
								);
							}
						);
					}
				} catch (err) {
					return response(500, err.message, null, "Internal server error", res);
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

const logout = async (req, res) => {
	try {
		const { userId } = req.session;
		const refreshToken = req.cookies.refreshToken;
		if (!userId || !refreshToken) {
			return response(401, "Please login first", null, "Unauthorized", res);
		}
		if (userId && refreshToken) {
			const search = await prisma.login.findFirst({
				where: {
					user_id: userId,
					refresh_token: refreshToken,
				},
			});
			if (!search) {
				return response(403, "Please login first", null, "Forbidden", res);
			}
			if (search) {
				try {
					await prisma.login.delete({
						where: {
							user_id: search.user_id,
						},
					});
					req.session.destroy(err => {
						if (err)
							return response(400, "Logout failed", null, "Bad request", res);
						return response(200, "Logout success", null, "Ok", res);
					});
				} catch (err) {
					return response(500, err.message, null, "Internal server error", res);
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
	getUsers,
	getUserByEmail,
	createUser,
	updateUser,
	deleteUser,
	login,
	getRefreshToken,
	logout,
};
