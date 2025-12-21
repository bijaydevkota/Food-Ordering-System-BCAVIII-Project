import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://dbijay2058_db_user:UkXBZ002WoP7OPCT@cluster0.r6ajncn.mongodb.net/?appName=Cluster0')
    .then(() => console.log('DB connected'))
}


// UkXBZ002WoP7OPCT
// dbijay2058_db_user