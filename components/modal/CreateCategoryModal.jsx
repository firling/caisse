import { Button, Group, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';

export default function CreateCategoryModal({opened, onClose, restoId, colorVariants}) {
    const router = useRouter()

    const form = useForm({
      initialValues: {
        name: '',
        color: 'gray',
      },
  
      validate: {
        name: (value) => (value.length > 0 ? null : 'Le nom est requis'),
        color: (value) => (value.length > 0 ? null : 'La couleur est requise'),
      },
    });

    const onSubmit = (values) => {
        fetch('/api/resto/category', {
            method: "POST",

            body: JSON.stringify({
                data: {
                    restoId,
                    ...values
                }
            }),
     
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            router.replace(router.asPath);
            onClose()
        });
    }

    const buttons = Object.keys(colorVariants).map((elt, i) => {

        return <button 
            key={i}
            type='button' 
            className={`rounded-full ml-1 ${colorVariants[elt].bg} border-2 ${form.values.color === elt && colorVariants[elt].border}`} 
            style={{width: 40, height: 40}}
            onClick={() => form.setFieldValue('color', elt)}
        ></button>
    })

    return (
        <Modal opened={opened} onClose={onClose} title="Créez une catégorie" centered>
            
            <div className="mb-6">
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput
                        placeholder="Catégorie"
                        label="Nom de la catégorie"
                        withAsterisk
                        {...form.getInputProps('name')}
                    />

                    <div className='mt-4'>
                        <Text
                            fz="sm"
                            fw={500}
                        >Couleur de la catégorie <span className='text-red-500'>*</span></Text>
                        {buttons}
                    </div>

                    <Group position="right" mt="md">
                        <Button 
                            type='submit'
                            variant="outline"
                            color="blue"
                        >Créer</Button>
                    </Group>
                </form>
            </div> 
        </Modal>
    )
}