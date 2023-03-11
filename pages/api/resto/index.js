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
    const {userId, data} = req.body

    // const user = await prisma.user.findUnique({
    //     where: {
    //         id: userId
    //     }
    // })

    const resto = await prisma.resto.create({
        data: {
            ...data,
            selectedUsers : {
                connect: [{id: userId}]
            }
        }
    })

    const userResto = await prisma.userResto.create({
        data: {
            userId,
            restoId: resto.id,
            role: "superAdmin"
        }
    })

    res.json(resto);
}