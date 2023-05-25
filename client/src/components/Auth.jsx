// eslint-disable-next-line no-unused-vars
import React , { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const backendURL = process.env.REACT_APP_BACKEND ;

const Auth = () => {
  const [NewUser, setNewUser] = useState(true) ;
  const [Msg, setMsg] = useState("Enter Data") ;
  const navigate = useNavigate() ;

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
          'Content-Type': 'application/json'
        }
      }) ;
      const json = await res.json() ;
      if (json.newAc){
        setMsg("Account Signup successfull") ;
      }else{
        setMsg("Signup unsuccessful") ;
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
        setMsg("Account Login successfull ,Redirecting to home page") ;
        localStorage.setItem("token", json.token);
        setTimeout(() => {
          navigate("/home") ;
        }, 1500);
      }else{
        setMsg("Signup before making an account") ;
      }
    }
    catch(err) {
      console.log(err) ;
    }
  }

  return (
    <div className='fl-col jcen acen h-100'>
      <h1>Welcome to The ImageStore</h1>
      <div className='form-wrap'>

        <div className="fl-row">
          <button onClick={ () =>setNewUser(true)}>Signup</button>
          <button onClick={ () =>setNewUser(false)}>Login</button> 
        </div>

        { NewUser ? (
          <form className='fl-col' onSubmit={signinAuth}>
            <label htmlFor="name">Name</label>
            <input type="text" name='name'/>
            <label htmlFor="email">Email</label>
            <input type="text" name='email'/>
            <label htmlFor="password">Password</label>
            <input type="password" name='password'/>
            <button type="submit" className='sub-btn'>Sign in</button>
          </form>
          ) : (
          <form className='fl-col' onSubmit={loginAuth}>
            <label htmlFor="email">Email</label>
            <input type="text" name='email'/>
            <label htmlFor="password">Password</label>
            <input type="password" name='password'/>
            <button type="submit" className='sub-btn'>Login</button>
          </form>
          )
        }
      </div>
      <p>{Msg}</p>
    </div>
  )
}

export default Auth