import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "GET") {
    await handleGET(res, req);
  } else if (req.method === "POST") {
    await handlePOST(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

async function handleGET(res, req) {
    const {restoId} = req.query

    const resto = await prisma.resto.findUnique({
        where: {id: restoId},
        include: {
            users: {
                select: {
                    role: true,
                    user: true
                }
            },
            invitations: {
                select: {
                    status: true,
                    referred: true
                }
            },
        }
    })

    res.json(resto);
}

async function handlePOST(res, req) {
    const {restoId, userMail} = req.body

    const user = await prisma.user.findUnique({
        where: {
            email: userMail
        }
    })

    if (!user) {
        return res.status(404).json({
            status: "notFound"
        })
    }

    const userResto = await prisma.userResto.findFirst({
        where: {
            userId: user.id,
            restoId
        }
    }) 

    const invited = await prisma.invitation.findFirst({
        where: {
            referredId: user.id,
            restoId
        }
    }) 

    if (userResto || invited) {
        return res.status(403).json({
            status: "alreadyExists"
        })
    }

    await prisma.invitation.create({
        data: {
            status: "pending",
            referredId: user.id,
            restoId
        }
    })

    res.json({
        status: "success",
        user
    });
}