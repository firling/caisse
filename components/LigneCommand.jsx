import { Paper, Title } from "@mantine/core"

export default function LigneCommand({elt}) {
    const backgroundColor = {
        notPaid: "bg-stone-300",
        paid: "bg-orange-300",
        finished: "bg-lime-300",
        given: "bg-sky-300",
    }

    return (
        <Paper mt="sm" p="md" shadow="md" 
            className={`${backgroundColor[elt.state]}`}
        >
            <Title order={3}>Commande n°{elt.id}</Title>
        </Paper>
    )
}
