import mongoose,{Schema,model,models} from "mongoose";
import bcrypt from "bcryptjs";


//Generics
export interface IUser {    // declare an interface where u have to define the types
    name:string;
    email: string;
    password: string;
    _id?:mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },           // ✅ Add name field
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },       // ✅ removed `unique:true` from password (not needed)
  },
  {
    timestamps: true,
  }
);

// Pre hook for hashing password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User=models?.User|| model<IUser>("User",userSchema)
//search if there any existing model nmaed"User" present or not
//if yes use it otherwise creaate a new one


export default User