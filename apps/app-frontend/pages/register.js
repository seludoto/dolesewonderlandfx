import Head from 'next/head'
import AdvancedRegister from '../components/AdvancedRegister'

export default function Register() {
  return (
    <>
      <Head>
        <title>Register - dolesewonderlandfx</title>
        <meta name="description" content="Create your dolesewonderlandfx trading account and start your forex journey" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdvancedRegister />
    </>
  )
}