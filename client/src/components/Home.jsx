// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import "./Home.css";
const backendURL = process.env.REACT_APP_BACKEND;

const Home = () => {
	const navigate = useNavigate();
	const inputRef = useRef(null);
	const [LoggedIn, setLoggedIn] = useState(true);
	const [UploadClick, setUploadClick] = useState(false);
	const [Images, setImages] = useState([]);
	const [searchFilter, setsearchFilter] = useState("");
	const [ImgDel, setImgDel] = useState("") ;
	const [ImgDelStatus, setImgDelStatus] = useState(false) ;
	const [ChangeNameState, setChangeNameState] = useState(false) ;
	const [ChangeNameId, setChangeNameId] = useState("") ;
	const [NewName, setNewName] = useState("") ;


	const checkUser = async () => {
		if (localStorage.getItem("token") === undefined || localStorage.getItem("token") === null) {
			return;
		}
		try {
			const resp = await fetch(`${backendURL}/getImg`, {
				method: "GET",
				headers: {
					"authorization": localStorage.getItem("token"),
				}
			})
			setLoggedIn(true);
			const json = await resp.json();
			setImages(json.images);
			console.log(json.images);
		}
		catch (err) {
			setLoggedIn(false);
			console.log(err);
		}
	}

	useEffect(() => {
		checkUser();
		// Call the function
	}, [])

	const convertBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);

			fileReader.onload = () => {
				resolve(fileReader.result);
			};

			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const handleImg = async (e) => {
		e.preventDefault();
		const img = e.target.image.files[0]; // Add this line
		const name = e.target.name.value; // Add this line

		const base64 = await convertBase64(img);

		try {
			await fetch(`${backendURL}/postImg`, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					"authorization": localStorage.getItem("token")
				},
				body: JSON.stringify({ name, image: base64 })
			})

			checkUser();
			setUploadClick(!UploadClick)
		}
		catch (err) {
			console.log(err);
		}
	}

	const handleLogout = () => {
		setLoggedIn(false);
		localStorage.removeItem("token");
		setImages([]);
		navigate("/");
	}

	const delImg = async () => {
 		const res = await fetch(`${backendURL}/delImg`, {
			method: "DELETE",
			headers: {
				"content-type": "application/json",
				"Authorization": localStorage.getItem('token'),
			},
			body: JSON.stringify({ id : ImgDel })
		});
		if (res.ok) {
			checkUser();
			setImgDel("") ;
			setImgDelStatus(false) ;
		}
	}

	const changeName = async () => {
		const res = await fetch(`${backendURL}/updateName`,{
			method:"PUT",
			headers : {
				'content-type' : "application/json",
				"Authorization" : localStorage.getItem('token')
			},
			body : JSON.stringify({ id: ChangeNameId , name: NewName }) 
		});
		setChangeNameState(false) ;
		if (res.ok){
			// set message
			checkUser() ;
		}
		else {
			// Set message
		}
	}


	return (
		<div className="flex-col hi-100">

			<div id="navbar" className='fl-row acen' style={{ position: 'sticky', top: '0', backgroundColor: 'white' }}>
				<div id="navl" className='fl-row acen'>
					<img src="logo.png" alt="logo" />
					The ImageStore
				</div>
				{LoggedIn && (
					<div id="navr">
						<button className='cp' onClick={handleLogout}>Logout</button>
					</div>
				)}
			</div>

			{LoggedIn ? (
				<>
					<div id="uploadbtn" className="fl-col fade-in">
						<button onClick={() => setUploadClick(!UploadClick)}>Upload</button>
						{UploadClick && (
							<div id="upload-form">
								<form onSubmit={handleImg} enctype="multipart/form-data" className='fl-col jcen acen home-form'>
									<div>
										<div>
											<label for="image">Image </label>
											<input type="file" name="image" accept='image/*' id="image" className='cp' />
										</div>
										<div>
											<label htmlFor="name">ImageName</label>
											<input type="text" name='name' />
										</div>
										<input type="submit" value="Upload Image" name="submit" className='upload-img cp' />
									</div>
								</form>
							</div>
						)}
					</div>

					<div className='fl-row w-100 jcen'>
						<div className='search-logo'><img src="search.png" alt="search" /></div>
						<input type="text" onChange={(event) => setsearchFilter(event.target.value)} ref={inputRef} />
						<button onClick={() => { inputRef.current.value = ""; setsearchFilter("") }}>Clear</button>
					</div>

					<div className="fl-row jcon-sar fwrap f1 personal-img">

						{(searchFilter === "") ?
							Images.map((Imge, ind) => (
								<div key={ind}>
									{/* {console.log(Imge)} */}
									<div className="img-div fl-col">
										<div style={{ position: "relative" }}>
											<img src={Imge.link} alt={Imge.name} key={Imge.name} className='user-img' />
											<button className='del-btn' onClick={() => { setImgDel(Imge._id) ; setImgDelStatus(true) } } >&times;</button>
										</div>
										<p>{Imge.name} <button className='edit-btn' onClick={() => { setChangeNameId(Imge._id) ; setChangeNameState(true) } }>✏️</button> </p>
									</div>
								</div>
							))
							:
							Images.map((Imge, ind) => (
								<div key={ind}>

									{console.log(Images.length)}
									{(Imge.name.toLowerCase() === searchFilter.toLowerCase()) && (
										<div className="img-div fl-col">
											<div>
												<img src={Imge.link} alt={Imge.name} key={Imge.name} className='user-img' />
											</div>
											<p>{Imge.name}</p>
										</div>
									)
									}

								</div>
							))
						}

					</div>
				</>
			) : (
				<div className="notLogged">
					<h1>You are not logged In</h1>
					<p>Login or Signin <Link to={'/'}>Here</Link></p>
				</div>
			)}

			{ ImgDelStatus && (
				<>
				<div className='del-conf fl-col acen tcen'>
					Do you really want to delete the image?
					<div className='fl-row jcon-sar acen w-100 confbtn-div'><button onClick={delImg}>Delete</button> <button onClick={() => { setImgDel("") ; setImgDelStatus(false) }}>Cancel</button> </div>
				</div>
				<div className='bg-opac'></div>
				</>
			)}

			{ ChangeNameState && (
				<>
				<div className='del-conf fl-col acen tcen'>
					New Image Name
					<input type="text" className='change-name-ip' onChange={(e) => setNewName(e.target.value)} />
					<div className='fl-row jcon-sar acen w-100 confbtn-div'><button onClick={changeName}>Update</button> <button onClick={() => setChangeNameState(false) }>Cancel</button> </div>
				</div>
				<div className='bg-opac'></div>
				</>
			)}

		</div>
	)
}

export default Home