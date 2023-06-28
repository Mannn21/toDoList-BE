import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const searchCategoryById = async category => {
	const data = await prisma.category.findUnique({
		where: {
			category,
		},
	})
	return (data)
};
