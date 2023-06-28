import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const searchUserById = async userId => {
	const id = parseInt(userId)
	const data = await prisma.user.findUnique({
		where: {
			id: id,
		},
	})
	return(data)
};
