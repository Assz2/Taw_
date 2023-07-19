import e = require('cors');
import mongoose = require('mongoose');  

export interface Item{ // define interface
    readonly _id: mongoose.Types.ObjectId;      // readonly _id
    name: string;                               // name 
    type: string;                               // type
    price: number;                              // price
    popularity: number;                         // popularity
    description: string;                        // description
}

var itemSchema = new mongoose.Schema<Item>({ // create schema
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    type: { 
        type: mongoose.SchemaTypes.String,
        required: true
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    popularity: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    description: {
        type: mongoose.SchemaTypes.String,
        required: false
    }
    
});

export default mongoose.model<Item>('Item', itemSchema); // export model

export function getSchemas(){
    return itemSchema;
}

var itemModel: mongoose.Model<Item>;
export function getModel(){
    if(!itemModel){
        itemModel = mongoose.model<Item>('Item', getSchemas());
    }
    return itemModel;
}   // export model

export function newItem(data: (mongoose.AnyKeys<Item> | mongoose.AnyObject) | undefined){
    var _itemModel = getModel();
    var item = new _itemModel(data);
    return item;
}   // export newItem
