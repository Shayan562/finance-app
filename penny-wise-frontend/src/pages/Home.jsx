import  Axios  from "axios"
import { useEffect, useState } from "react"
import { CreateTransaction } from "../components/CreateTransaction"

export const Home = () =>{
    const [loginStatus, setLoginStatus]=useState(false)
    const [userDetails, setUserDetails]=useState(null)
    useEffect(()=>{
        const getDetails=async()=>{
            try{
                const response=await Axios.get('http://localhost:8081/user')
                console.log(response.data)
                const user=response.data
                setUserDetails(user)

            }catch(err){
                console.log(err)
            }
        }
        if (window.sessionStorage.getItem("isLoggedIn")!=null){
            setLoginStatus('True')
            getDetails()

        }
        
    },[])
    return(
        <>
            {loginStatus && userDetails?.name + '\n'+userDetails?.email}
            <CreateTransaction/>
        </>
    )
}