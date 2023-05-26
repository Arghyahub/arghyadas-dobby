// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect , useRef } from 'react';
import { Link } from "react-router-dom";
const backendURL = process.env.REACT_APP_BACKEND;

const Home = () => {
  const inputRef = useRef(null);
	const [LoggedIn, setLoggedIn] = useState(true);
	const [UploadClick, setUploadClick] = useState(false);
	const [Images, setImages] = useState([{ img: "https://picsum.photos/seed/picsum/500/300", name: "mountain" }]);
	const [TempImg, setTempImg] = useState([]);

  const [Search, setSearch] = useState('') ;


	const checkUser = async () => {
		if (localStorage.getItem("token") === undefined || localStorage.getItem("token") === null) {
			return;
		}
		try {
			const resp = await fetch(`${backendURL}/home`, {
				method: "GET",
				headers: {
					"authorization": localStorage.getItem("token")
				}
			})
			setLoggedIn(true);
			const json = await resp.json();
			setImages(json.images);
		}
		catch (err) {
			setLoggedIn(false);
			console.log(err);
		}
	}
	useEffect(() => {


		// Call the function
	}, [])

	const handleImg = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const img = formData.get("image");
		const name = formData.get("name");

		try {
			const resp = await fetch(`${backendURL}/postImg`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ img, name })
			})
			// Call check user function here
		}
		catch (err) {
			console.log(err);
		}
	}

  const handleSearch = () => {
    const searchImg = Images.filter((objs) => {
      return objs.name === Search;
    }) ;
    setTempImg([...Images]) ;
    setImages(searchImg) ;
  }


	return (
		<div className="flex-col hi-100">

			<div id="navbar" className='fl-row border acen' style={{ position: 'sticky', top: '0', backgroundColor: 'white' }}>
				<div id="navl" className='fl-row acen'>
					<img src="logo.png" alt="logo" />
					The ImageStore
				</div>
				{LoggedIn && (
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
								<form onSubmit={handleImg} className='fl-col'>
									<label for="image">Image </label>
									<input type="file" name="image" id="image" />
									<label htmlFor="name">ImageName</label>
									<input type="text" name='name' />
									<input type="submit" value="Upload Image" name="submit" />
								</form>
							</div>
						)}
					</div>

					<div className='fl-row'>
						<button><img src="search.png" alt="search" /></button>
						<input type="text" onChange={(event) => setSearch(event.target.value)} ref={inputRef} />
            <button onClick={()=> { inputRef.current.value=""; setImages([...TempImg]) }}>Clear</button>
					</div>

					<div className="fl-row jcon-sar fwrap f1 personal-img">
						{Images.map((Imge) => (
							<img src={Imge.img} alt={Imge.name} key={Imge.name} />
						))}
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