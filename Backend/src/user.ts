import  mongoose = require('mongoose'); // import mongoose
import crypto = require('crypto'); // import crypto

// define interface
export interface User{
    readonly _id: mongoose.Types.ObjectId;  // readonly _id
    name: string;                           // name
    role: string;                           // role
    salt: string;                           // salt
    digest: string;                         // digest
    stats? : number;                        // stats
    table? : number[];                      // associated tables


    setPassword: (password: string) => void;    // setPassword  
    validatePassword: (password: string) => boolean; // validatePassword
    setRole: (role: string) => void;              // setRole
    getRole: () => string;                        // getRole
    //pushTable: (table: number) => void;           // pushTable
    //removeTable: (table: number) => void;         // removeTable
}

var userSchema = new mongoose.Schema<User>({ // create schema
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    role: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    salt: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    digest: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    stats: {
        type: mongoose.SchemaTypes.Number,
        required: false
    },
    table: {
        type: [mongoose.SchemaTypes.Number],
        required: false
    }
}); 

userSchema.methods.setPassword = function(pwd: string){
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
    .createHash('sha512')
    .update(pwd + salt)
    .digest('hex');

    this.salt = salt;
    this.digest = hashedPassword;
}

userSchema.methods.validatePassword = function(pwd: string): boolean{
    const hashedPassword = crypto
    .createHash('sha512')
    .update(pwd + this.salt)
    .digest('hex');

    return hashedPassword === this.digest;
}

userSchema.methods.setRole = function(rl: string){
    if(rl === 'WAITER' || rl === 'COOK' || rl === 'BARTENDER' || rl === 'CASHIER'){
        if(this.getRole() != rl){
            this.role = rl;
        }
        else{
            console.log(this.name + " is " + rl + " already");
        }
    }
    else{
        console.log(rl + " is an invalid role");
    }
}

userSchema.methods.getRole = function(){
    return this.role;
}

export default mongoose.model<User>('User', userSchema); // export model

export function getSchema(){
    return userSchema;
}   // export schema


var userModel: mongoose.Model<User>;
export function getModel(){
    if(!userModel){
        userModel = mongoose.model<User>('User', getSchema());
    }
    return userModel;
}

export function newUser(data: (mongoose.AnyKeys<User> & mongoose.AnyObject) | undefined): User{
    var _userModel = getModel();   
    var user = new _userModel(data);
    return user;
}

export function getRole(user: User){
    return user.role;
}