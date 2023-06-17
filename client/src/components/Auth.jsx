// eslint-disable-next-line no-unused-vars
import React , { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Auth.css"

const backendURL = process.env.REACT_APP_BACKEND ;

const Auth = () => {
  const [NewUser, setNewUser] = useState(true) ;
  const [Msg, setMsg] = useState("Some Warning") ;
  const [WarnModel, setWarnModel] = useState(false) ;
  const navigate = useNavigate() ;

  const handelWarn = (text) => {
    setMsg(text) ;
    setWarnModel(true) ;
    setTimeout(()=> {
      setWarnModel(false) ;
    },2300)
  }
 
  const signinAuth = async (e) => {
    e.preventDefault() ;
    const data = new FormData(e.target) ;
    const name = data.get('name') ;
    const email = data.get('email') ;
    const passwd = data.get('password') ;
    console.log(name,email,passwd) ;

    try {
      const res = await fetch(`${backendURL}/signin`, {
        method: 'POST',
        body: JSON.stringify({name,email,passwd}),
        headers: {
          'Content-Type': 'application/json',
        }
      }) ;
      const json = await res.json() ;
      if (json.newAc){
        handelWarn("Account Signup successfull") ;
        localStorage.setItem("token",json.token) ;
        setTimeout(() => {
          navigate("/home") ;
        }, 2500);
      }else{
        setWarnModel(true) ;
        handelWarn("User already exists") ;
      }
    }
    catch(err) {
      console.log(err) ;
    }
  }

  const loginAuth = async (e) => {
    e.preventDefault() ;
    const data = new FormData(e.target) ;
    const email = data.get('email') ;
    const passwd = data.get('password') ;
    console.log(email,passwd) ;

    try {
      const res = await fetch(`${backendURL}/login`, {
        method: 'POST',
        body: JSON.stringify({email,passwd}),
        headers: {
          'Content-Type': 'application/json'
        }
      }) ;
      const json = await res.json() ;
      if (json.acExist){
        handelWarn("Account Login successfull") ;
        localStorage.setItem("token", json.token);
        setTimeout(() => {
          navigate("/home") ;
        }, 1500);
      }else{
        handelWarn(json.msg) ;
      }
    }
    catch(err) {
      console.log(err) ;
    }
  }

  return (
    <div id='Auth' className='fl-col acen h-100'>
      <h1 className='auth-head'>Welcome to The ImageStore</h1>
      <div className='fl-col jcen acen f1'>
        <div className='form-wrap'>

          { NewUser ? (
            <>
            <form className='fl-col' onSubmit={signinAuth}>
              <label className='auth-label' htmlFor="name">Name</label>
              <input className='auth-ip' type="text" name='name'/>
              <label className='auth-label' htmlFor="email">Email</label>
              <input className='auth-ip' type="text" name='email'/>
              <label className='auth-label' htmlFor="password">Password</label>
              <input className='auth-ip' type="password" name='password'/>
              <button type="submit" className='auth-sub-btn cp'>Sign Up</button>
            </form>
            <div className='acnt-avail' >Already have an account? <button className='acnt-avil-btn' onClick={() => setNewUser(false) } >Login..</button> </div>
            </>
            ) : (
            <>
            <form className='fl-col' onSubmit={loginAuth}>
              <label className='auth-label' htmlFor="email">Email</label>
              <input className='auth-ip' type="text" name='email'/>
              <label className='auth-label' htmlFor="password">Password</label>
              <input className='auth-ip' type="password" name='password'/>
              <button type="submit" className='auth-sub-btn cp'>Login</button>
            </form>
            <div className='acnt-avail' >Don't have an account? <button className='acnt-avil-btn' onClick={() => setNewUser(true) } >Signup..</button> </div>
            </>
            )
          }
        </div>
        <p className={`auth-warn ${WarnModel ? 'warn-vis' : ''}`}>{Msg}</p>
        </div>
    </div>
  )
}

export default Auth