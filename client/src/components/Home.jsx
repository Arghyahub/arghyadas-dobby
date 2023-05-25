// eslint-disable-next-line no-unused-vars
import React , { useState , useEffect } from 'react' ;
import {Link} from "react-router-dom" ;
const backendURL = process.env.REACT_APP_BACKEND ;

const Home = () => {
  const [LoggedIn, setLoggedIn] = useState(false) ;
  const [UploadClick, setUploadClick] = useState(false) ;

	useEffect(() => {
		const checkUser = async () => {
			// Work to be done
		}
	},[])
	

  return (
    <div className="flex-col hi-100">

      <div id="navbar" className='fl-row border acen' style={{position: 'sticky' , top: '0' , backgroundColor: 'white'}}>
        <div id="navl" className='fl-row acen'>
          <img src="logo.png" alt="logo" />
          The ImageStore
        </div>
        { LoggedIn && (
          <div id="navr">
            <button>logout</button>
          </div>
        )}
      </div>

      {LoggedIn ? (
				<>
					<div id="uploadbtn" className="fl-col">
						<button onClick={() => setUploadClick(!UploadClick)}>Upload</button>
						{UploadClick && (
							<div id="upload-form" className='border'>
								<form className='fl-col'>
								<label for="image">Image </label>
								<input type="file" name="fileToUpload" id="fileToUpload" />
								<input type="submit" value="Upload Image" name="submit" />
								</form>
							</div>
						)}
					</div>
					<div className="fl-row jcon-sar fwrap f1 personal-img">
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
						<img src="https://picsum.photos/id/237/200/300" alt="nothing" />
					</div>
				</>
			) : (
				<div className="notLogged">
					<h1>You are not logged In</h1>
					<p>Login or Signin <Link to={'/'}>Here</Link></p>
				</div>
			)}
    </div>
  )
}

export default Home