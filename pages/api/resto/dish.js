import prisma from "../../../lib/prisma";

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
  const { id } = req.query

  const dish = await prisma.dish.findUnique({
    where: {id},
    select: {
        id: true,
        name: true,
        price: true,
        image: true,
        description: true,
    }
})

  res.json(dish)
}

// POST /api/user
async function handlePOST(req, res) {
    const {data} = req.body

    const dish = await prisma.dish.create({
        data: {
            ...data,
        }
    })

    res.json(dish);
}