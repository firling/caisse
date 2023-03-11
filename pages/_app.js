import '@/styles/globals.css'
import { MantineProvider } from '@mantine/core'
import { SessionProvider } from "next-auth/react"
import Head from 'next/head'
import Navbar from '@/components/layout/Navbar'
import Topbar from '@/components/layout/Topbar'

export default function App({ Component, pageProps: {session, ...pageProps}, ...appProps }) {
  const noLayout = ['/auth/signin'];

  if (noLayout.includes(appProps.router.pathname)){
    return (
      <SessionProvider session={session} basePath="/api/auth">
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light',
          }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    )
  }
  

  return (
    <SessionProvider session={session} basePath="/api/auth">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
        <div className="flex flex-col w-full h-screen bg-slate-100">
          <Topbar title={pageProps.user?.selectedResto ? pageProps.user?.selectedResto.name : "Caisse"}/>
          <Component {...pageProps} />
          <Navbar />
        </div>
      </MantineProvider>
    </SessionProvider>
  )
}