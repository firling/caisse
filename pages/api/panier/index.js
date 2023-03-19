import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "POST") {
    await handlePOST(res, req);
  } else if (req.method === "GET") {
    await handleGET(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}


async function handleGET(req, res) {
  const { userId } = req.query

  var panier = await prisma.panier.findFirst({
    where: {
        userId: userId,
        active: true
    },
    include: {
        LignePanier: {
            include: {
                dish: true
            }
        }
    }
  })

    if (!panier) {
        panier = await prisma.panier.create({
            data: {
                userId: userId,
                active: true
            },
        })
    }

    const lignePanier = await prisma.lignePanier.findMany({
        where: {
            panierId: panier.id
        },
        select: {
            id: true,
            quantity: true,
            total: true,
            informations: true,
            dish: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        }
    })

  res.json(panier)
}


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
            informations: data.informations
        }
    })

    res.json(ligne);
}