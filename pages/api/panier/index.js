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

    var panier = await prisma.panier.findFirst({
        where: {
            userId: data.userId,
            active: true
        },
    })

    if (!panier) {
        panier = await prisma.panier.create({
            data: {
                userId: data.userId,
                active: true
            }
        })
    }

    const ligne = await prisma.lignePanier.create({
        data: {
            panierId: panier.id,
            dishId: data.dishId,
            quantity: data.quantity,
            total: data.quantity * data.dishPrice,
            information: data.information
        }
    })

    res.json(ligne);
}