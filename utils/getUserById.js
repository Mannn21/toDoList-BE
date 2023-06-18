import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const searchUserById = async userId => {
	await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});
};
