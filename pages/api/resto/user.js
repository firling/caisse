import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "GET") {
    await handleGET(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

async function handleGET(res, req) {
    const {restoId} = req.query

    const restos = await prisma.userResto.findMany({
        where: {
            restoId 
        },
        include: {
            user: true
        }
    })

    res.json(restos);
}