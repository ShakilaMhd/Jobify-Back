import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("monogo db connect success");
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB