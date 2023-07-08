import mongoose = require('mongoose');

export interface Stats{
    readonly _id: mongoose.Types.ObjectId;
    daily: number;
    items?: mongoose.Types.ObjectId[];
    
    //pushItem: (item: mongoose.Types.ObjectId) => void;
    getDaily: (daily: number) => void;
    pushItem: (item: mongoose.Types.ObjectId) => void;
    /*
    weekly: number;
    monthly: number;
    yearly: number;

    
    updateWeekly: () => void;
    updateMonthly: (monthly: number) => void;
    updateYearly: (yearly: number) => void;
    getDaily: () => number;
    getWeekly: () => number;
    getMonthly: () => number;
    getYearly: () => number;
    */
}

var statsSchema = new mongoose.Schema<Stats>({
    daily: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    items: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: false
    }
    /*
    weekly: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    monthly: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    yearly: {
        type: mongoose.SchemaTypes.Number,
        required: true
    }
    */
});


statsSchema.methods.updateDaily = function(daily: number){
    this.daily += daily;
};

statsSchema.methods.pushItem = function(item: mongoose.Types.ObjectId){
    this.items?.push(item);
};
/*
statsSchema.methods.updateWeekly = function(){
    var med = 0;
    for(var i = 0; i < 7; i++){
        med += this.getDaily();
    }
    med = med / 7;
    this.weekly = med;
};
*/

export default mongoose.model<Stats>('Stats', statsSchema);

export function getSchemas(){
    return statsSchema;
}

var statsModel: mongoose.Model<Stats>;
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

export function updateDaily(total: number | undefined) {
    throw new Error('Function not implemented.');
}

export function pushItem(_id: any) {
    throw new Error('Function not implemented.');
}

