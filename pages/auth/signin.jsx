import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useForm } from '@mantine/form';
import { useRouter } from "next/router";


export default function login() {
    const { status } = useSession();
    const router = useRouter();

    const form = useForm({
      initialValues: {
        email: 'test@test.com',
        password: 'test'
      },
  
      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      },
    });

    const onSubmit = async (values) => {
        try {
          const body = { ...values };
          let res = await signIn("credentials", {
            ...body,
            callbackUrl: router.query.callbackUrl,
          });
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/", {
                query: {
                    callbackUrl: router.query.callbackUrl,
                },
            });
        }
    }, [status])

    return (
        <section className="gradient-form h-screen bg-slate-100">
            <div className="h-screen p-10">
                <div className="flex h-full flex-wrap items-center justify-center">
                    <div className="w-full md:w-2/3 lg:w-1/2">
                        <div className="block rounded-lg bg-white shadow-lg">
                            <div className="g-0">
                                <div className="px-4 md:px-0">
                                    <div className="md:mx-6 md:p-12">
                                        <div className="text-center">
                                            <img
                                                className="mx-auto w-48"
                                                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                                                alt="logo" />
                                            <h4 className="mt-1 mb-12 pb-1 text-xl font-semibold">
                                                Caisse toi
                                            </h4>
                                        </div>
                                        <form onSubmit={form.onSubmit(onSubmit)}>
                                            <p className="mb-4">Connectez-vous pour accéder a l'application !</p>
                                            <div className="relative mb-4">
                                                <input
                                                    type="email"
                                                    className={`peer block min-h-[auto] w-full rounded border-0 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear 
                                                        focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0`}
                                                    placeholder="your@mail.com" 
                                                    {...form.getInputProps('email')}
                                                />
                                                <label
                                                    className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out 
                                                    ${form.values.email.length > 0 && "-translate-y-[0.9rem] scale-[0.8] text-rose-600 -translate-y-[0.9rem] scale-[0.8]"}
                                                    peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-rose-600 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none`}
                                                >
                                                    Email
                                                </label>
                                            </div>
                                            <div className="relative mb-4">
                                                <input
                                                    type="password"
                                                    className={`peer block min-h-[auto] w-full rounded border-0 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear 
                                                        focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0`}
                                                    placeholder="password" 
                                                    {...form.getInputProps('password')}
                                                />
                                                <label
                                                    className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out 
                                                    ${form.values.password.length > 0 && "-translate-y-[0.9rem] scale-[0.8] text-rose-600 -translate-y-[0.9rem] scale-[0.8]"}
                                                    peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-rose-600 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none`}
                                                >
                                                    Mot de passe
                                                </label>
                                            </div>
                                            <div className="mb-12 pt-1 pb-1 text-center">
                                                <button
                                                    className="mb-3 inline-block w-full rounded px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                                    type="sibmit"
                                                    style={{background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'}}
                                                >
                                                    Se connecter
                                                </button>
                                                <a href="#!">Mot de passe oublié ?</a>
                                            </div>
                                            <div className="flex items-center justify-between pb-6">
                                                <p className="mb-0 mr-4">Pas encore de compte ?</p>
                                                <button
                                                    type="button"
                                                    className="inline-block rounded border-2 border-danger px-6 pt-2 pb-[6px] text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                                                >
                                                    S'enregister
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}