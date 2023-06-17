require('dotenv').config();
const Express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose') ;


const app = Express();
app.use(cors());
app.use(Express.json({ limit: '50mb' }));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};


// DATABSE PART
mongoose.connect(`${process.env.MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    passwd: String,
    images: [
      {
        name: String,
        link: String,
      },
    ],
});

const User = mongoose.model('User', userSchema);


// DATABASE PART COMPLETE

const secretKey = process.env.JWT_SECRET ;
const tmpuserPasswd = '$2b$10$Y/GxvAShEcdkRbrsl5EkN.qO332UvBYU1GOJy8krlYt7utQqQE9Lu';
const USERS = [{ id: 2, name: "test", email: "test@test.com", passwd: tmpuserPasswd, images: [{name: "algo" , link: "https://res.cloudinary.com/dudeynbt4/image/upload/v1685099243/nl03vlvmlgxuunpr1c8v.jpg"}] }];

app.get("/", (req, res) => {
    res.send("Server Running");
})

app.post("/signin", async (req, res) => {
    try {
        const { name, email, passwd } = req.body;
        const hashedPasswd = await bcrypt.hash(passwd, 10);

        // FindOne if User Exist
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({newAc : false}) ;
        }
        const numofData = await User.countDocuments({}) ;

        const data = { id: numofData + 1, name, email, passwd: hashedPasswd, images: [] } ;
        // console.log(data);
        const token = jwt.sign({ id: data.id }, secretKey);
        const newUser = new User(data) ;
        await newUser.save() ;
        res.status(200).json({ newAc: true , token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ newAc: false });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, passwd } = req.body;
        // FindOne User, then check if password match

        const user = await User.findOne({email: email}) ;

        if (!user) {
            return res.status(200).json({ acExist: false, msg: "User Doesn't exist" });
        }
        else {
            const isPasswordValid = bcrypt.compare(passwd, user.passwd);
            if (isPasswordValid) {
                const token = jwt.sign({ id: user.id }, secretKey);
                res.status(200).json({ acExist: true, token });
            }
            else {
                res.status(200).json({ acExist: false, msg: "Wrong Password" });
            }
        }
    }
    catch (err) {
        console.log(err) ;
        res.status(500).json({ acExist: false, msg: "Some error occured" });
    }
})

app.get('/getImg', async (req, res) => {
    const authHeader = req.headers["authorization"];
    if (authHeader===undefined || authHeader===null){
        return res.status(500).json({images: []});
    }
    const decoded = jwt.verify(authHeader, secretKey);

    // Find user with id decoded.id and return their images array
    try{
        const user = await User.findOne({ id: decoded.id });
        res.status(200).json({images : user.images})
    }
    catch(err){
        res.status(500).json({images: []}) ;
    }
})

app.post("/postImg", async (req, res) => {
    const imgPath = req.body.image;
    const name = req.body.name;
    const authHeader = req.headers["authorization"];
    if (authHeader===undefined || authHeader===null){
        return res.status(404).json({error: "unsuccessful"});
    }
    const decoded = jwt.verify(authHeader, secretKey);
    // console.log(decoded) ;

    try {
        cloudinary.uploader.upload(imgPath, opts, async (error, result) => {
            if (result && result.secure_url) {
                console.log(result.secure_url);
                const imageDetails = {
                    name: name,
                    link: result.secure_url
                }

                // Implement uploading link to user's database
                const user = await User.findOne({id: decoded.id}) ;

                // USERS[decoded.id].images.push(imageDetails) ;
                // console.log(USERS[decoded.id].images) ;

                user.images.push(imageDetails) ;
                await user.save() ;

                return res.status(200).json({imageUrl: result.secure_url}) ;
            }
            else {
                console.log(error) ;
                res.send(500).json({error: "unsuccessfull"}) ;
            }
        });
    } catch (error) {
        console.log(error) ;
        res.status(500).json({ error: 'Image upload failed' });
    }
})

app.delete("/delImg",async (req,res) => {
    const imgId = req.body.id ;
    const token = req.headers["authorization"];
    if (token === undefined || token === null){
        return res.send(404).json({message : "User not found"}) ;
    }
    const decoded = jwt.verify(token,secretKey) ;
    try {
        await User.updateOne({id: decoded.id}, {
            $pull : {
                images: { _id : imgId }
            }
        })
        res.status(200).json({message: "successfully deleted"}) ;
    }
    catch (err) {
        res.status(500).json({message: "some error occured" , error : err}) ;
    }
})


app.listen(5000, () => {
    console.log("Listening on http://localhost:5000/");
})