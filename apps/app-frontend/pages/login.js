import Head from 'next/head'
import AdvancedLogin from '../components/AdvancedLogin'

export default function Login() {
  return (
    <>
      <Head>
        <title>Login - dolesewonderlandfx</title>
        <meta name="description" content="Sign in to your dolesewonderlandfx trading account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdvancedLogin />
    </>
  )
}