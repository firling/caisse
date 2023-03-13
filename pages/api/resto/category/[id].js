import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "GET") {
    await handleGET(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

async function handleGET(req, res) {
  const { id } = req.query

  const categories = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      color: true,
      type: true,
      dishes: true
    }
  })

  res.json(categories)
}