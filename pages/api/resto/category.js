import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "POST") {
    await handlePOST(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

// POST /api/user
async function handlePOST(res, req) {
    const {data} = req.body

    const category = await prisma.category.create({
        data: {
            ...data,
            type: "color"
        }
    })

    res.json({});
}