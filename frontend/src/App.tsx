import { useEffect } from "react"
import { SideNavBar } from "./components/NavBar"
import { useDispatch, useSelector } from "react-redux"
import { loadUserFailed, loadUserSuccess, startingToLoadUser } from "./features/userSlice"
import axios from "axios"
import { RootState } from "./app/store"
import Loader from "./components/Loader"
import Auth from "./pages/Auth"

function App() {

  const { loading: userLoading, errMsg, msg, user } = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(startingToLoadUser())
    axios.get(`${import.meta.env.VITE_API_URL}/`, { withCredentials: true })
      .then(({ status, data }) => {
        if (status === 200 && data.user) {
          dispatch(loadUserSuccess({ user: data.user as IUser, msg: null }))
        } else {
          console.log("Special", status, data)
          dispatch(loadUserFailed({ errorMsg: "please login or register" }))
        }
      }).catch((err) => {
        dispatch(loadUserFailed({ errorMsg: "please login or register" }))
        console.error("While fetching user data", err)
      })
  }, [])

  if(userLoading){
    return (
      <div className="w-full mt-[30vh] flex items-center justify-center">
        <Loader size={60}/>
      </div>
    )
  } else if(!user) {
    return (
      <Auth />
    )
  }
  return (
    <div>
      <SideNavBar />
    </div>
  )
}

export default App
