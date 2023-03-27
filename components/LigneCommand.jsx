import { Paper, Title } from "@mantine/core"
import dayjs from "dayjs"
import "dayjs/locale/fr"

export default function LigneCommand({elt, onClick}) {
    const backgroundColor = {
        notPaid: "bg-stone-300",
        paid: "bg-orange-300",
        finished: "bg-lime-300",
        given: "bg-sky-300",
    }

    const getDate = () => {
        let format = 'HH:mm'
        const current = dayjs(elt.createdAt).locale('fr')
        const today = dayjs()

        if (current.format('DD/MM/YYYY') !== today.format('DD/MM/YYYY')) {
            format = `dddd D MMMM ${format}`
        }

        return current.format(format)
    }

    return (
        <Paper mt="sm" p="0" shadow="md" 
            className={`${backgroundColor[elt.state]} flex flex-row overflow-hidden`}
            onClick={onClick}
        >
            <div className="text-white bg-slate-900 px-2 flex items-center"><Title order={3}>{elt.id}</Title></div>
            <div className="px-4 py-2 w-full flex flex-col">
                <div className="text-right text-slate-700 text-sm">{getDate()}</div>
                {elt.panier.LignePanier.map(elem => (
                    <>
                        <div key={elem.id}><strong>{elem.quantity} x</strong> {elem.dish.name}</div>
                        {elem.informations && 
                            <div className="ml-4 text-slate-600 text-xs">{elem.informations.split('\\n').map(line => <>{line}<br/></>)}</div>
                        }
                    </>
                ))}
            </div>
        </Paper>
    )
}
