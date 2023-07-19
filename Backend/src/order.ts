import e = require('cors');
import mongoose = require('mongoose');
import * as it from './item';

export interface Order{ // define interface
    readonly _id: mongoose.Types.ObjectId;       // readonly _id
    tableId: number;                             // table
    associatedWaiter: string;                    // associated waiter
    items: string[];                             // items
    status: string;                              // status
    timeStamp: Date;                             // timeStamp
    total: number;                               // total
}


var orderSchema = new mongoose.Schema<Order>({ // create schema
    tableNumber: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    associatedWaiter: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    status: {   
        type: mongoose.SchemaTypes.String,
        required: true  
    },
    timeStamp: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    total: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },

    food: {
        type: [mongoose.SchemaTypes.String],
        required: false
    },
    drinks: {
        type: [mongoose.SchemaTypes.String],
        required: false
    }
});

/*
orderSchema.methods.pushFood = function(food: string){
    this.food?.push(food);
    this.updateTotal(food);
}

orderSchema.methods.pushDrink = function(drink: string){
    this.drinks?.push(drink);
    this.updateTotal(drink);
}

orderSchema.methods.updateTotal = function(item: string){
    it.getModel().findOne({name: item}, (err: any, item: any) =>{
        if(err){
            console.log(err);
        }
        else{
            this.total += item.price as number;
        }
    });
}
*/

export default mongoose.model<Order>('Order', orderSchema); // export model

export function getSchemas(){
    return orderSchema;
}

var orderModel: mongoose.Model<Order>;

export function getModel(){
    if(!orderModel){
        orderModel = mongoose.model<Order>('Order', getSchemas());
    }
    return orderModel;
}   // export model

export function newOrder(data: (mongoose.AnyKeys<Order> | mongoose.AnyObject) | undefined){
    var _orderModel = getModel();   
    var order = new _orderModel(data);
    return order;
}   // export newOrder



