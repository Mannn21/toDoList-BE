import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const searchCategoryById = async category => {
	await prisma.category.findUnique({
		where: {
			category,
		},
	});
};
