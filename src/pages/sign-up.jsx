import { Helmet } from "react-helmet-async"

import { CONFIG } from "src/config-global"

import { SignUpView } from "src/sections/auth/sign-up-view"

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`ثبت نام - ${CONFIG.appName}`}</title>
      </Helmet>

      <SignUpView />
    </>
  )
}
