import e = require('cors');
import mongoose = require('mongoose');
import * as it from './item';
import * as Stats from './stats';

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



