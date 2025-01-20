import mongoose from "mongoose";
import config from "../config"

const url = config.CONNECTION_STRING;
export default async function connect() {
  try {
    await mongoose.connect(url || "");
    console.log("Database connected");
  } catch (error) {
    console.log(`could not connect to db ${error}`);
    process.exit(1);
  }
}
