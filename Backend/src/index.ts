/**
 *      ENDPOINTS             ATTRIBUTES                   METHODS                  DESCRIPTION
 * 
 *      /                     None                         GET                      Returns api version and a list of all endpoints 
 * 
 * 
 *      /login                None                         POST                     Logs in a user
 *  
 *      /register             None                         POST                     Register a new user (authorization required) (only cashier can register new users)
 * 
 *      /users                ?role=                       GET                      Returns a list of all users eventually filtered by role (authorization required) (only cashier can get users by role)
 * 
 *      /users/:name          None                         GET                      Returns a user by id (authorization required) (only cashier can get users by id)
 * 
 *      /users/:name          None                         DELETE                   Removes a user by id (authorization required) (only cashier can delete users by id)
 * 
 * 
 * 
 *      /tables               ?free                        GET                      Returns a list of all tables eventually filtered as free tables (authorization required)
 * 
 *      /tables               None                         POST                     Creates a new table (authorization required) (only cashier can create new tables)
 * 
 *      /tables/:id           None                         DELETE                   Removes a table by id (authorization required) (only cashier can delete tables by id)
 *      
 *      
 *      
 *      /orders               ?tb=                         GET                      Returns a list of all orders grouped by table id 
 *                            ?status=                                              and eventually filtered by status(authorization required)
 * 
 *      /orders               None                         POST                     Creates a new order (authorization required)
 * 
 *      /orders/:id           None                         PUT                      Updates an order by id (authorization required) (only cooks, bartenders or cashier can update orders by id)
 * 
 *      /orders/:id           None                         GET                      Returns an order by id (authorization required) (only cashier can get orders by id)
 * 
 *      /orders/:id           None                         DELETE                   Removes an order by id (authorization required) (only cashier can delete orders by id)
 * 
 *      
 * 
 *     /menu                  ?type=                       GET                      Returns a list of all menu items eventually filtered by type (food or drinks) (authorization required)
 * 
 *     /menu/:name            None                         GET                      Returns a menu item by id (authorization required)
 *  
 *     /menu/:name            None                         DELETE                   Removes a menu item by id (authorization required) (only cashier can delete menu items by id)
 * 
 *     /menu                  None                         POST                     Creates a new menu item (authorization required) (only cashier can create new menu items)
 * 
 *     
 * 
 *     /stats                 None                         GET                      Returns the daily sales (authorization required) (only cashier can get daily sales)
 * 
 */





const result = require('dotenv').config();

if (result.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    throw result.error;
}

if (!process.env.JWT_SECRET) {
    console.log("No JWT secret string. Please provide one in .env");
    process.exit(1);
}


import fs = require('fs');
import http = require('http');
import mongoose = require('mongoose');
import express = require('express');
import passport = require('passport');
import passportHTTP = require('passport-http');
import jwt = require('jsonwebtoken');
import cors = require('cors');
const { expressjwt: expressjwt } = require('express-jwt');


import * as user from './user';
import * as order from './order';
import * as table from './table';
import * as menu from './item';
import * as stats from './stats';
import e = require('express');
import { Socket } from 'socket.io';



const app = express();  
const server = http.createServer(app);
const port = 3000;  
const { Server } = require("socket.io");
const socketIo = require("socket.io");
const secret = process.env.JWT_SECRET;

const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true
};

const io = socketIo(server, {
    cors: corsOptions
});

var auth = expressjwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']});

app.use(cors(corsOptions));
app.use( (req, res, next) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
}); 

app.use(express.json());


var authCashier = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({err: "No authorization header"});
    }
    const token = authHeader?.split(' ')[1] as string;
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const userRole = user.newUser(decoded).role;
    if(userRole === 'CASHIER'){
        next();
    }else{ 
        return res.status(401).json({err: "Cashier authorization required"});
    }
};

// ----------------------------------------------  ENDPOINTS  ------------------------------------------------------ //

//----------------------------------------------------------------- ROOT
app.get('/', (req, res) => {
    return res.status(200).json({
        api_version: '1.0', 
        endpoints: [ "/orders", "/tables", "/menu", "/users" ]
    });
});




//----------------------------------------------------------------- LOGIN
passport.use(new passportHTTP.BasicStrategy(
    function(username, password, done){
        //console.log("New login from: " + username);
        user.getModel().findOne( {name: username}, (err: any, user: any) => {
            if(!user){
                return done(null, false);
            }
            else if(!user.validatePassword(password)){
                return done(null, false);
            }
            else if(err){
                
                return done({statusCode: 500, error: true, errormessage: err});
            }            
                return done(null, user);
        }).catch((err) => {
            return done({statusCode: 500, error: true, errormessage: err});
        });
    }
));

app.post('/login', passport.authenticate('basic', {session: false}), (req: any, res) => {
    var _token = {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
        stats: req.user.stats
    };

    console.log("Login from: " + req.user.name);
    var tokenSigned = jwt.sign(_token, secret, {expiresIn: '4h'});
    return res.status(200).json({error: false, errormessage: "", token: tokenSigned});
});



//----------------------------------------------------------------- REGISTER
app.post('/register', auth, authCashier, (req, res) => {
    try{
        const {name, password, role} = req.body;
        const us = user.newUser({
            name: name,
            stats: 0
        });
        us.setPassword(password);
        us.setRole(role);
        user.getModel().create(us).then((data) => {
            return res.status(200).json({error: false, errormessage: "", id: data._id});
        }).catch((err) => {
            return res.status(500).json({error: true, errormessage: err});
        });
    } catch(err){  
        console.log(err);
        return res.status(500).json({error: true, errormessage: err});
    }
});



//----------------------------------------------------------------- USERS
app.get('/users', auth, authCashier, (req, res) => {
    var filter = {};
    if(req.query.role){
        filter = {role: req.query.role};
    }   
    console.log("Using filter: " + JSON.stringify(filter));
    console.log("Using query: " + JSON.stringify(req.query.role));
    user.getModel().find(filter).then((data) => {
        return res.status(200).json({error: false, errormessage: "", users: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    }); 
});

app.get('/users/:name', auth, authCashier, (req: any, res) => {
    console.log("Getting user: " + req.params.name);
    user.getModel().findOne({name: req.params.name}).then((data) => {
        return res.status(200).json({error: false, errormessage: "", user: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});

app.delete('/users/:name', auth, authCashier, (req: any, res) => {
    console.log("Deleting user: " + req.params.name);
    user.getModel().findOneAndDelete( {name: req.params.name } ).then((data) => {
        return res.status(200).json({error: false, errormessage: "", user: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});



//----------------------------------------------------------------- TABLES
app.route('/tables')
.get( auth, (req, res) => {
    var filter = {};
    if(req.query.free === 'false'){
        filter = {free: false};
    }
    if(req.query.free === 'true'){
        filter = {free: true};
    }
    console.log("Using filter: " + JSON.stringify(filter));
    console.log("Using query: " + JSON.stringify(req.query.free));
    table.getModel().find(filter).then((data) => {
        return res.status(200).json({error: false, errormessage: "", tables: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
})
.post(auth, authCashier, (req, res) => {
    var newTable = req.body;
    table.getModel().create(newTable).then((data) => {
        return res.status(200).json({error: false, errormessage: "", id: data._id});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});


app.delete('/tables/:id', auth, authCashier, (req, res) => {
    console.log("Deleting table: " + req.params.id);
    table.getModel().findOneAndDelete( {tableId: req.params.id as undefined as number} ).then((data) => {
        return res.status(200).json({error: false, errormessage: "", table: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});



//----------------------------------------------------------------- ORDERS
app.route('/orders')
.get(auth, (req, res) => {
    var filter = {};
    if(req.query.tb){
        filter = {tableId: req.query.tb};
    }
    if(req.query.status){
        filter = {status: req.query.status};
    }
    console.log("Using filter: " + JSON.stringify(filter));
    console.log("Using query: " + JSON.stringify(req.query.tb));
    order.getModel().find(filter).then((data) => {
        return res.status(200).json({error: false, errormessage: "", orders: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    })
})
.post(auth, async (req, res) => {
    //i want to notify through socket.io all the users with role 'BARTENDER' and 'COOKS' that a new order has been created

    //for me of the future: I think I dont need in the backend to push any item into the item[] array bcause when I will do a request
    //in post to this endpoint, i will value the order with the body of the request thus i will populate the array in the frontend
    //and pass it to the backend. Any data manipulation will be done in the backend


    const { tableId, associatedWaiter, items } = req.body;
    var newOrder = order.newOrder({
        tableId: tableId,
        associatedWaiter: associatedWaiter,
        items: items, 
    });
    newOrder.status = "PENDING";            // PENDING -> order sent to cuisine/bar -> RED
                                            // QUEUE -> order being prepared        -> YELLOW
                                            // READY -> order ready to be served    -> GREEN

    newOrder.timeStamp = new Date();
    await newOrder.setTotal();
    console.log("New order: " + JSON.stringify(newOrder));
    order.getModel().create(newOrder).then((data) => {

        //socket.io emit
        user.getModel().find(/*{role: {$in: ['BARTENDER', 'COOK']}}*/).then((us) => {
            us.forEach((user) => {
                io.emit('broadcast', user.name);
            });
        }).catch((err) => {
            return res.status(500).json({error: true, errormessage: err});
        });

        user.getModel().findOne({name: newOrder.associatedWaiter}).then((us: any) => {
            if(us.role === 'WAITER'){
                us.setStats();
                us.save();
            }
        });
        //table set free = false
        table.getModel().findOneAndUpdate({tableId: newOrder.tableId}, {free: false}).then((data) => {
            data.save();
        })
        .catch((err) => {
            //return res.status(500).json({error: true, errormessage: err});
        });

        return res.status(200).json({error: false, errormessage: "", id: data._id});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});


app.route('/orders/:id')
.put(auth, (req, res) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({err: "No authorization header"});
    }
    
    const token = authHeader?.split(' ')[1] as string;
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const userRole = user.newUser(decoded).role;
    if(userRole === 'CASHIER' || userRole === 'COOK' || userRole === 'BARTENDER'){

        //i want to notify through socket.io the users with role 'WAITER' that an order has been updated and update the state of the order
        order.getModel().find( {tableId: req.params.id as unknown as number} ).then((order) => {
            order.forEach((data) => {
                user.getModel().findOne({name: data.associatedWaiter}).then((us: any) => {
                    io.emit('OrderUpdate', us);
                })
                if(data.status != "READY"){
                    data.status = req.body.status;
                    console.log("status: " + req.body.status);
                    data.save();
                }
            });
            return res.status(200).json({error: false, errormessage: "", order: order});
        })

        user.getModel().findOne({name: decoded.name}).then((us: any) => {
            if(us.role === 'COOK' || us.role === 'BARTENDER'){
                us.setStats();
                us.save();
            }
        });

    } else {   
        return res.status(401).json({err: "Cashier, cook or bartender authorization required"});
    }
})
.get(auth, authCashier, (req, res) => {
    order.getModel().findOne( {tableId: req.params.id as undefined as number} ).then((data) => {
        return res.status(200).json({error: false, errormessage: "", order: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    }); 
})
.delete(auth, authCashier, (req, res) => {
    order.getModel().findOneAndDelete( {tableId: req.params.id as undefined as number} ).then((data) => {

        //table set free = true
        table.getModel().findOne({tableId: data.tableId}).then((data) => {
            data.setFree();
            data.save();
        });
        var updateTotal = data.total; 
        stats.getModel().find().sort({date: -1}).limit(1).then((data) => {
            data[0].updateDaily(updateTotal);
        }).catch((err) => {
           // FORSE DA PROBLEMI (to check) return res.status(500).json({error: true, errormessage: err});
        });

        return res.status(200).json({error: false, errormessage: "", order: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
})



//----------------------------------------------------------------- MENU
app.route('/menu')
.get(auth, (req, res) => {
    var filter = {};
    if(req.query.type){
        filter = {type: req.query.type};
    }
    console.log("Using filter: " + JSON.stringify(filter));
    console.log("Using query: " + JSON.stringify(req.query.type));
    menu.getModel().find(filter).then((data) => {
        return res.status(200).json({error: false, errormessage: "", menu: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
})
.post(auth, authCashier, (req, res) => {
    var newMenuItem = req.body;
    menu.getModel().create(newMenuItem).then((data) => {
        return res.status(200).json({error: false, errormessage: "", id: data._id});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});

app.route('/menu/:name')
.get(auth, (req, res) => {
    menu.getModel().find({name: req.params.name}).then((data) => {
        return res.status(200).json({error: false, errormessage: "", item: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
})
.delete(auth, authCashier, (req, res) => {
    menu.getModel().findOneAndDelete({name: req.params.name}).then((data) => {
        return res.status(200).json({error: false, errormessage: "", item: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});




//----------------------------------------------------------------- STATS
app.get('/stats', auth, authCashier, (req, res) => {
    stats.getModel().findOne().sort({date: -1}).limit(1).then((data) => {
        
        if(data){
            if(data.date.getDate() != new Date().getDate()){
                var newStats = stats.newStats({
                    date: new Date(),
                    totalSeats: 0,
                    occupancy: 0,
                    dailySales: 0
                });
                newStats.setOccupancy();
                stats.getModel().create(newStats).then((data) => {
                    return res.status(200).json({error: false, errormessage: "", stats: data});
                //}).catch((err) => {
                //    return res.status(500).json({error: true, errormessage: err});
                });
            }
        } else {
            var newStats = stats.newStats({
                date: new Date(),
                totalSeats: 0,
                occupancy: 0,
                dailySales: 0
            });
            newStats.setOccupancy();
            stats.getModel().create(newStats).then((data) => {
                return res.status(200).json({error: false, errormessage: "", stats: data});
            //}).catch((err) => {
            //    return res.status(500).json({error: true, errormessage: err});
            });
        }

        return res.status(200).json({error: false, errormessage: "", stats: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});





//----------------------------------------------------------------- DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/Taw')
.then(
    (data) => {
        if(!data){
            console.log("Creating admin user");
            var admin: any = user.newUser({
                name: "admin"
            });
            admin.setPassword("admin");
            admin.setRole("CASHIER");
            return admin.save();
        } else {
            console.log("Admin user already exists");
        }
    }
).then(
    () => {
        io.on('connection', function(client : any) {
            console.log('Socket.io client: ' + client + ' connected');
        });
        server.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        })
    }
).catch(
    (err) => {
        console.log("Error connecting to database");
        console.log(err);
        process.exit(1);
    }
);

// FIRST CONNECTION TO DATABASE SETS STATS, DOESNT WORK. NEED TO BE FIXED
// POST ORDER DOESNT WORK, NEED TO BE FIXED