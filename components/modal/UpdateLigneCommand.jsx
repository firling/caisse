import { Button, Group, Modal } from '@mantine/core';

export default function UpdateLigneCommandModal({opened, onClose, ligne, refresh}) {
    const states = {
        notPaid: {
            previous: null,
            next: {
                value: "paid",
                label: "Payée",
                color: "text-orange-900 border-orange-900 bg-orange-300"
            },
        },
        paid: {
            previous: {
                value: "notPaid",
                label: "Non Payée",
                color: "text-stone-900 border-stone-900 bg-stone-300"
            },
            next: {
                value: "finished",
                label: "Prête",
                color: "text-lime-900 border-lime-900 bg-lime-300"
            },
        },
        finished: {
            previous: {
                value: "paid",
                label: "Payée",
                color: "text-orange-900 border-orange-900 bg-orange-300"
            },
            next: {
                value: "given",
                label: "Livrée",
                color: "text-sky-900 border-sky-900 bg-sky-300"
            },
        },
        given: {
            previous: {
                value: "finished",
                label: "Prête",
                color: "text-lime-900 border-lime-900 bg-lime-300"
            },
            next: null
        },
    }

    const changeState = (state) => {
        fetch(`/api/command/${state}`, {
            method: "PUT",

            body: JSON.stringify({
                data: {
                    id: ligne.id
                }
            }),
     
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            refresh()
            onClose()
        });
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Changer l'état d'une commande" centered>
            
            <div className="mb-6">

                {ligne.state && (
                    <Group position="apart" mt="md">
                        {states[ligne.state].previous ? (
                            <Button 
                                className={states[ligne.state].previous.color}
                                variant="outline"
                                onClick={() => changeState(states[ligne.state].previous.value)}
                            >{"<< " + states[ligne.state].previous.label}</Button>
                        ) : <div></div>}
                        {states[ligne.state].next ? (
                            <Button 
                                className={states[ligne.state].next.color}
                                variant="outline"
                                onClick={() => changeState(states[ligne.state].next.value)}
                            >{states[ligne.state].next.label + " >>"}</Button>
                        ) : <div></div>}
                    </Group>
                )}
            </div> 
        </Modal>
    )
}