import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "DELETE") {
    await handleDelete(req, res);
  } else if (req.method === "PUT") {
    await handlePut(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}


async function handlePut(req, res) {
    const {id} = req.query
    const {value} = req.body

    const ligne = await prisma.lignePanier.findUnique({
        where: {id},
        include: {
            dish: true
        }
    })

    await prisma.lignePanier.update({
        where: { id },
        data: {
            quantity: value,
            total: ligne.dish.price * value
        }
    })

    res.json({success: true})
}


async function handleDelete(req, res) {
    const {id} = req.query

    await prisma.lignePanier.delete({
        where: {id}
    })

    res.json({success: true})
}