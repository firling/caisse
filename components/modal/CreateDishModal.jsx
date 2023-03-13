import { Button, FileInput, Group, Modal, NumberInput, Text, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CreateDishModal({opened, onClose, restoId, categoryId}) {
    const router = useRouter()

    const [img, setImg] = useState('')    

    const form = useForm({
      initialValues: {
        name: '',
        price: 0,
        description: '',
        image: null,
      },
  
      validate: {
        name: (value) => (value.length > 0 ? null : 'Le nom est requis'),
      },
    });

    useEffect(() => {
        if (!form.values.image) return;

        let reader = new FileReader();

        reader.readAsDataURL(form.values.image);

        reader.onload = function () {
            setImg(reader.result)
        };

        reader.onerror = function (error) {
            console.log('Error: ', error);
        };

    }, [form.values.image])

    const onSubmit = (values) => {
        fetch('/api/resto/dish', {
            method: "POST",

            body: JSON.stringify({
                data: {
                    restoId,
                    categoryId,
                    ...values,
                    image: img,
                    description: values.description.replaceAll('\n', '\\n'),
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

    return (
        <Modal opened={opened} onClose={onClose} title="Créez un plat" centered>
            
            <div className="mb-6">
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput
                        withAsterisk
                        placeholder="Plat"
                        label="Nom du plat"
                        {...form.getInputProps('name')}
                    />
                    
                    <NumberInput
                        mt="md"
                        withAsterisk
                        decimalSeparator=","
                        label="Prix"
                        precision={2}
                        // {...form.getInputProps('price')}
                        defaultValue={form.values.price}
                        onChange={(val) => form.setFieldValue('price', val)}
                    />

                    <div className="mt-4 flex items-center justify-center w-full">
                        <label 
                            for="dropzone-file" 
                            className="mt-2 flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            style={{
                                background: `center / cover no-repeat url("${img}")`,
                            }}
                        >
                            <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Ajouter une image</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                            </div>
                            <FileInput
                                id="dropzone-file" 
                                className="hidden" 
                                {...form.getInputProps('image')}
                            />
                        </label>
                    </div> 

                    
                    <Textarea
                        mt="md"
                        placeholder="Votre description"
                        label="Description du plat"
                        autosize
                        minRows={2}
                        {...form.getInputProps('description')}
                    />

                    <div className='mt-4'>
                        <Group position="right" mt="md">
                            <Button 
                                type='submit'
                                variant="outline"
                                color="blue"
                            >Créer</Button>
                        </Group>
                    </div>
                </form>
            </div> 
        </Modal>
    )
}