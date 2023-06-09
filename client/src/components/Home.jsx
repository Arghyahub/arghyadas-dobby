// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import "./Home.css";
import Trie from "./search/trie"
let trie = new Trie() ;
const backendURL = process.env.REACT_APP_BACKEND;

const Home = () => {
	const navigate = useNavigate();
	const inputRef = useRef(null);
	const [LoggedIn, setLoggedIn] = useState(true);
	const [UploadClick, setUploadClick] = useState(false);
	const [Images, setImages] = useState([]);
	const [searchFilter, setsearchFilter] = useState("");
	const [searchImage, setsearchImage] = useState([]);
	const [ImgDel, setImgDel] = useState("") ;
	const [ImgDelStatus, setImgDelStatus] = useState(false) ;
	const [ChangeNameState, setChangeNameState] = useState(false) ;
	const [ChangeNameId, setChangeNameId] = useState("") ;
	const [NewName, setNewName] = useState("") ;
	const [PromptModel, setPromptModel] = useState("Something") ;
	const [PromptActive, setPromptActive] = useState(false) ;

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
			trie = new Trie() ;
			json.images.forEach(elem => {
				trie.insertWord(elem.name,elem.link) ;
			});
			setImages(json.images);
			// console.log(json.images);
		}
		catch (err) {
			handleModel("Unable to login") ;
			setLoggedIn(false);
			console.log(err);
		}
	}

	useEffect(() => {
		checkUser();
		// Call the function
	})

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
			setUploadClick(!UploadClick)
			handleModel("Uploading Image...") ;
			await fetch(`${backendURL}/postImg`, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					"authorization": localStorage.getItem("token")
				},
				body: JSON.stringify({ name, image: base64 })
			})

			checkUser();
		}
		catch (err) {
			handleModel("Some error occured") ;
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
		else {
			handleModel("Unable to Delete") ;
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
			handleModel("Successfully changed") ;
			checkUser() ;
		}
		else {
			handleModel("Some error occured") ;
		}
	}

	const handleModel = (str) => {
		setPromptModel(str) ;
		setPromptActive(true) ;
		setTimeout(() => {
			setPromptActive(false) ;
		}, 3000);
	}


	return (
		<div className="flex-col hi-100">

			<div id="navbar" className='fl-row acen'>
				<div id="navl" className='fl-row acen'>
					<img className='logo' src="logo.png" alt="logo" />
					The ImageStore
				</div>
				{LoggedIn && (
					<div id="navr">
						<button className='cp logout-btn' onClick={handleLogout}>Logout</button>
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
						<div className='search-logo fl-row jcen acen'><img src="search.png" alt="search" /></div>
						<input className='search-ip' type="text" onChange={(event) => {setsearchFilter(event.target.value) ; setsearchImage(trie.getWords(event.target.value)) }} ref={inputRef} />
						<button className='search-cross' onClick={() => { inputRef.current.value = ""; setsearchFilter("") }}>X</button>
					</div>

					<div className="fl-row jcon-sar fwrap f1 personal-img">

						{(searchFilter === "") ?
							Images.map((Imge, ind) => (
								<div key={ind}>
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
							searchImage.map((Imge, ind) => (
								/*
								{name: 'FIGHT CLUB', links: Array(1)}
								*/
								Imge.links.map((urls) => (
									<div key={ind}>
										<div className="img-div fl-col">
											<div>
												<img src={urls} alt={Imge.name} key={Imge.name} className='user-img' />
											</div>
											<p className='search-name'>{Imge.name.toLowerCase()}</p>
										</div>
							 		</div>
								))

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
				<div className={`del-conf fl-col acen tcen ${ImgDel? 'show-conf':''}`}>
					<p>
						Do you really want to delete the image?
					</p>
					<div className='fl-row jcon-sar acen w-100 confbtn-div'>
						<button className='model-ac' onClick={delImg}>Delete</button> 
						<button className='model-na' onClick={() => { setImgDel("") ; setImgDelStatus(false) }}>Cancel</button> 
					</div>
				</div>
				<div className='bg-opac'></div>
				</>
			)}

			{ ChangeNameState && (
				<>
				<div className={`del-conf fl-col acen tcen ${ChangeNameState? 'show-conf':''}`}>
					<p>
						New Image Name
					</p>
					<input type="text" className='change-name-ip' onChange={(e) => setNewName(e.target.value)} />
					<div className='fl-row jcon-sar acen w-100 confbtn-div'>
						<button className='model-ac' onClick={changeName}>Update</button> 
						<button className='model-na' onClick={() => setChangeNameState(false) }>Cancel</button> 
					</div>
				</div>
				<div className='bg-opac'></div>
				</>
			)}

			<div className={`prompt-model ${PromptActive? 'model-anim' : ''}`}>
				{PromptModel}
			</div>

		</div>
	)
}

export default Home