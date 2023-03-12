import { signOut } from "next-auth/react";
import React from "react";


export default function Logout({ callbackUrl }) {
  signOut({ callbackUrl });
  return <div></div>;
}

export const getStaticProps = async (context) => ({
  props: { callbackUrl: process.env.NEXTAUTH_URL }, // will be passed to the page component as props
});