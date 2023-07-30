import e = require('cors');
import mongoose = require('mongoose');
import * as it from './item';

export interface Order{ // define interface
    readonly _id: mongoose.Types.ObjectId;       // readonly _id
    tableId: number;                             // table
    associatedWaiter: string;                    // associated waiter
    items: string[];                             // items
    status: string;                              // status
    total: number;                              // total                       
    timeStamp: Date;                             // timeStamp   
    
    setTotal(): void;                           // set total
}


var orderSchema = new mongoose.Schema<Order>({ // create schema
    tableId: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    associatedWaiter: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    items: {
        type: [mongoose.SchemaTypes.String],
        required: true,
    },
    status: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    total: {
        type: mongoose.SchemaTypes.Number,
        required: false
    },
    timeStamp: {
        type: mongoose.SchemaTypes.Date,
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
/*
orderSchema.methods.setTotal = function(): number{
    var total = 0;
    this.items.forEach((data) => {
        it.getModel().findOne({name: data}).then((item) => {
            console.log(item + " with a price of:" + item.price);
            total += item.price as number;
            console.log("Total 1: " + total);
        }).catch((err) => {
            console.log(err);
        })
    });
    console.log("Total 2: " + total);
    return total;
}*/

orderSchema.methods.setTotal = function(){
    var tot = 0;
    
    const promises = this.items.map((data) => 
            it.getModel().findOne({ name: data }).then((item) => {
                tot += item.price as number;
            }).catch((err) => {
                console.log(err);
            })
        );
    
    return Promise.all(promises).then(() => {
        this.total = tot;
    });
}



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



