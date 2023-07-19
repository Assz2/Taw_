import mongoose = require('mongoose');

export interface Stats{
    readonly _id: mongoose.Types.ObjectId;  // readonly _id
    date: Date;                             // date
    customers: number;                      // customers
    tableOccupancy: number;                 // tableOccupancy
    totalSales: number;                     // totalSales
}

var statsSchema = new mongoose.Schema<Stats>({ // create schema
    date: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        unique: true
    },
    customers: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    tableOccupancy: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    totalSales: {
        type: mongoose.SchemaTypes.Number,
        required: true
    }
})

export default mongoose.model<Stats>('Stats', statsSchema); // export model

export function getSchemas(){
    return statsSchema;
}

var statsModel: mongoose.Model<Stats>

export function getModel(){
    if(!statsModel){
        statsModel = mongoose.model<Stats>('Stats', getSchemas());
    }
    return statsModel;
}   // export model

export function newStats(data: (mongoose.AnyKeys<Stats> | mongoose.AnyObject) | undefined){
    var _statsModel = getModel();
    var stats = new _statsModel(data);
    return stats;
}   // export newStats

