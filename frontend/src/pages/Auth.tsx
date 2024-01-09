import { useCallback, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { loadUserFailed, loadUserSuccess, startingToLoadUser } from "../features/userSlice"
import axios from "axios"

export default function Auth() {

  const [authType, setAuthType] = useState<"login" | "register">("register")

  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useDispatch()

  const onSubmitForm = useCallback(() => {
    console.log("Here on submit")
    if (emailInputRef.current && passwordInputRef.current) {
      dispatch(startingToLoadUser())
      axios.post(
        `${import.meta.env.VITE_API_URL}/${authType==="register"?'register':'login'}`,
        {
          email: emailInputRef.current.value,
          name: nameInputRef.current?.value,
          password: passwordInputRef.current.value
        } as IUserCreate,
        { withCredentials: true }
      ).then(({ status, data }) => {
        if ((status === 200 || status === 201 || status === 202) && data.user) {
          dispatch(loadUserSuccess({ user: data.user as IUser, msg: null }))
        } else {
          console.warn("Special case", status, data)
        }
      }).catch((err) => {
        console.error("While authenticating ", err)
        dispatch(loadUserFailed({ errorMsg: "Error occured while authenticating" }))
      })
    }
  }, [authType])

  return (
    <div className="w-full h-screen flex bg-gray-800 items-center justify-center">
      <div className="px-4 md:px-0 border bg-white shadow-lg w-full max-w-[600px]">
        <div className="p-10">
          <div className="text-center">
            {/* <img
              className="mx-auto w-48"
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
              alt="logo" /> */}
            <h4 className="mb-12 mt-1 pb-1 text-5xl font-extrabold">
              TextPost
            </h4>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(event) => {
              console.log("Here submit!")
              event.preventDefault()
              onSubmitForm()
            }}>
            <p className="mb-4">
              Please {(authType === "register") ? "register" : "login"} to your account
            </p>

            {
              (authType === "register") &&
              <div className="relative my-4 " data-te-input-wrapper-init>
                <input
                  ref={nameInputRef}
                  type="text"
                  className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="nameInput"
                  placeholder="Name" />
                <label
                  htmlFor="nameInput"
                  className="text-xs text-gray-700 -top-4 absolute"
                >Name
                </label>
              </div>
            }

            <div className="relative my-4 " data-te-input-wrapper-init>
              <input
                ref={emailInputRef}
                type="email"
                className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInput1"
                placeholder="Email" />
              <label
                htmlFor="exampleFormControlInput1"
                className="text-xs text-gray-700 -top-4 absolute"
              >Email
              </label>
            </div>


            <div className="relative my-4 " data-te-input-wrapper-init>
              <input
                ref={passwordInputRef}
                type="password"
                className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInput11"
                placeholder="Password" />
              <label
                htmlFor="exampleFormControlInput11"
                className="text-xs text-gray-700 -top-4 absolute"
              >Password
              </label>
            </div>


            <div className="my-10 pb-1 pt-1 text-center">
              <button
                className="mb-3 inline-block border text-white bg-gray-800 hover:bg-gray-700 w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normalshadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                type="submit"
                data-te-ripple-init
                data-te-ripple-color="light">
                {
                  (authType === "register") ? "Register" : "Login"
                }
              </button>
            </div>


            <div className="flex items-center justify-between pb-6">
              <p className="mb-0 mr-2">
                {
                  (authType === "register") ? "Already " : "Don't "
                }
                have an account?
              </p>
              <button
                type="button"
                className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                data-te-ripple-init
                data-te-ripple-color="light"
                onClick={() => {
                  setAuthType((prev) => (prev === "login") ? "register" : "login")
                }}>
                {
                  (authType === "register") ? "Login" : "Register"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
