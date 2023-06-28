import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPromiseData = data => {
	return Promise.all(
		data.map(async item => {
			const searchCategory = await prisma.category.findUnique({
				where: { id: item.category_id },
			});
			return {
				id: item.id,
				title: item.title,
				completed: item.completed,
				date: item.date,
				createdAt: item.createdAt,
				category: searchCategory.category,
				color: searchCategory.color,
			};
		})
	);
};
