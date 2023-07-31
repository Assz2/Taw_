import mongoose = require('mongoose');
import * as order from './order';

export interface Table{
    readonly _id: mongoose.Types.ObjectId;  // readonly _id
    tableId: number;                         // number
    seats: number;                          // seats
    free: boolean;                           // free

    setOcc: () => void;                     // setOcc
    setFree: () => void;                    // setFree
}

var tableSchema = new mongoose.Schema<Table>({ // create schema
    tableId: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: true
    },
    seats: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    free: {
        type: mongoose.SchemaTypes.Boolean, 
        required: true
    }
})

tableSchema.methods.setOcc = function(){    // setOcc
    this.free = false;
}
tableSchema.methods.setFree = function(){   // setFree
    this.free = true;
}

export default mongoose.model<Table>('Table', tableSchema); // export model

export function getSchemas(){
    return tableSchema;
}

var tableModel: mongoose.Model<Table>

export function getModel(){
    if(!tableModel){
        tableModel = mongoose.model<Table>('Table', getSchemas());
    }
    return tableModel;
}   // export model

export function newTable(data: (mongoose.AnyKeys<Table> | mongoose.AnyObject) | undefined){
    var _tableModel = getModel();
    var table = new _tableModel(data);
    return table;
}   // export newTable