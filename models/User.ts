import mongoose,{Schema,model,models} from "mongoose";
import bcrypt from "bcryptjs";


//Generics
export interface IUser {    // declare an interface where u have to define the types
    email: string;
    password: string;
    _id?:mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema= new Schema<IUser>(
    {
      email:{type:String,required:true,unique:true},
      password:{type:String,required:true, unique:true},

    },
    {
        timestamps:true

    }
)

//Pre hooks for hashing password

userSchema.pre('save', async function(next){

    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,10)
    }

    next();
}
);

const User=models?.User|| model<IUser>("User",userSchema)
//search if there any existing model nmaed"User" present or not
//if yes use it otherwise creaate a new one


export default User