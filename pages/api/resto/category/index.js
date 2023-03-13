import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "POST") {
    await handlePOST(req, res);
  } else if (req.method === "GET") {
    await handleGET(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

async function handleGET(req, res) {
  const { restoId } = req.query

  const categories = await prisma.category.findMany({
    where: { restoId },
    select: {
      id: true,
      name: true,
      color: true,
      type: true
    }
  })

  res.json(categories)
}

async function handlePOST(req, res) {
  const {data} = req.body

  const category = await prisma.category.create({
      data: {
          ...data,
          type: "color"
      }
  })

  res.json(category);
}