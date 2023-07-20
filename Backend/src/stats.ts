import mongoose = require('mongoose');
import * as tb from './table';
import * as od from './order';

export interface Stats{
    readonly _id: mongoose.Types.ObjectId;  // readonly _id
    date: Date;                             // date
    totalSeats: number;                     // totalSeats
    occupancy?: number;                      // occupancy
    dailySales?: number;                     // dailySales

    setOccupancy: () => void;               // totCustomers
    updateDaily: (x: number) => void;              // totTableOccupancy
}


var statsSchema = new mongoose.Schema<Stats>({ // create schema
    date: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        unique: true
    },
    totalSeats: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    occupancy: {
        type: mongoose.SchemaTypes.Number,
        required: false
    },
    dailySales: {
        type: mongoose.SchemaTypes.Number,
        required: false
    }
})



statsSchema.methods.setOccupancy = function(){    // setOccupancy
    var _tableModel = tb.getModel();
    _tableModel.find( {free: false} ).then( (tables) => {
        var totOccupancy = 0;
        tables.forEach((table) => {
            totOccupancy += table.seats;
        })
        this.occupancy = totOccupancy;
    }).catch((err) => {
        console.log(err);
    })
}

statsSchema.methods.updateDaily = function(x: number){    // updateDaily
    this.dailySales += x;
}



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

