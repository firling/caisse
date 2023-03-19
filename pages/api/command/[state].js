import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "POST") {
    await handlePost(req, res);
  } else if (req.method === "GET") {
    await handleGet(req, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}


async function handlePost(req, res) {
    // const {state} = req.query
    const {data} = req.body

    const command = await prisma.command.create({
        data: {
            ...data,
            state: 'notPaid'
        }
    })

    await prisma.panier.update({
        where: { id: data.panierId },
        data: {
            active: false
        }
    })

    res.json(command)
}


async function handleGet(req, res) {
    const {state, restoId} = req.query

    const command = await prisma.command.findMany({
        where: {
            restoId
        },
        include: {
            panier: {
                include: {
                    LignePanier: {
                        include: {
                            dish: true
                        }
                    }
                }
            }
        }
    })

    res.json(command)
}