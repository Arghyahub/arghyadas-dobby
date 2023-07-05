// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Auth.css"

const backendURL = process.env.REACT_APP_BACKEND;

const Auth = () => {
  const [NewUser, setNewUser] = useState(true);
  const [Msg, setMsg] = useState("Some Warning");
  const [WarnModel, setWarnModel] = useState(false);
  const navigate = useNavigate();
  const [Pass, setPass] = useState(true) ;

  useEffect(() => {
    const coldStart = async () => {
      const data = await fetch(`${backendURL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    coldStart();
  }, [])


  const handelWarn = (text) => {
    setMsg(text);
    setWarnModel(true);
    setTimeout(() => {
      setWarnModel(false);
    }, 2300)
  }

  const signinAuth = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    const email = data.get('email');
    const passwd = data.get('password');
    console.log(name, email, passwd);

    try {
      const res = await fetch(`${backendURL}/signin`, {
        method: 'POST',
        body: JSON.stringify({ name, email, passwd }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const json = await res.json();
      if (json.newAc) {
        handelWarn("Account Signup successfull");
        localStorage.setItem("token", json.token);
        setTimeout(() => {
          navigate("/home");
        }, 2500);
      } else {
        setWarnModel(true);
        handelWarn("User already exists");
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const loginAuth = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get('email');
    const passwd = data.get('password');
    console.log(email, passwd);

    try {
      const res = await fetch(`${backendURL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, passwd }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      if (json.acExist) {
        handelWarn("Account Login successfull");
        localStorage.setItem("token", json.token);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        handelWarn(json.msg);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div id='Auth' className='fl-row h-100'>
      <img src="imagewall.jpg" alt="bgimg" className="auth-img" />

      <div className="auth-form fl-col">

        <h1 className='auth-head'>Welcome to the ImageStore</h1>
        <div className='fl-col acen f1'>
          <p className='auth-desc'>ImageStore is a personalised image storing app where you can upload your images to the cloud and all you data will be saved and private </p>

          <div className='form-wrap'>

            {NewUser ? (
              <>
                <form className='fl-col acen' onSubmit={signinAuth}>
                  <div className="ip fl-row jcen acen">
                    <input className='auth-ip' placeholder='Name' type="text" name='name' />
                    <img src="name.ico" alt="" />
                  </div>
                  <div className="ip fl-row jcen acen">
                    <input className='auth-ip' placeholder='Email@' type="text" name='email' />
                    <img src="email.ico" alt="" />
                  </div>
                  <div className="ip flrow jcen acen">
                    <input type={Pass? 'password' : 'text'} name='password' placeholder='Password' className='auth-ip'/>
                    <button className='curpoi pass-btn' onClick={() => setPass(!Pass)}>
                      <img src={`${Pass? 'eyenot':'eye'}.ico`} alt="" />
                    </button>
                  </div>

                  <button type="submit" className='auth-sub-btn cp'>Sign Up</button>
                </form>
                <div className='acnt-avail' >Already have an account? <button className='acnt-avil-btn' onClick={() => setNewUser(false)} >Login..</button> </div>
              </>
            ) : (
              <>
                <form className='fl-col acen' onSubmit={loginAuth}>
                  <div className="ip fl-row jcen acen">
                    <input className='auth-ip' placeholder='Email@' type="text" name='email' />
                    <img src="email.ico" alt="" />
                  </div>
                  <div className="ip flrow jcen acen">
                    <input type={Pass? 'password' : 'text'} name='password' placeholder='Password' className='auth-ip'/>
                    <button className='curpoi pass-btn' onClick={() => setPass(!Pass)}>
                      <img src={`${Pass? 'eyenot':'eye'}.ico`} alt="" />
                    </button>
                  </div>
                  <button type="submit" className='auth-sub-btn cp'>Login</button>
                </form>
                <div className='acnt-avail' >Don't have an account? <button className='acnt-avil-btn' onClick={() => setNewUser(true)} >Signup..</button> </div>
              </>
            )
            }
          </div>
          <p className={`auth-warn ${WarnModel ? 'warn-vis' : ''}`}>{Msg}</p>
        </div>

      </div>

    </div>
  )
}

export default Auth