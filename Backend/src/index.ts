/**
 * 
 *  Endpoints                    Attributes                   Methods                  Description  
 * 
 *   /                           None                         GET                      Returns api version and a list of all endpoints
 * 
 * 
 *   /register                   None                         POST                     Registers a new user (authorization required) (only cashier can register new users)
 *   /login                      None                         POST                     Logs in a user
 *   /logout                     None                         POST                     Logs out a user
 * 
 *   /users                      ?role=                       GET                      Returns a list of all users eventually filtered by role  (authorization required) (only cashier can get users by role)
 *   /users/:name                None                         GET                      Returns a user by id (authorization required) (only cashier can get users by id)
 *   /users/:name                None                         DELETE                   Delete a user by name (authorization required) (only cashier can delete users) 
 * 
 * 
 * 
 *   /orders                     ?tb=&food                    GET                      Returns a list of all orders grouped by table id and eventually filtered by type (food or drinks) (authorization required) 
 *                               ?tb=&drinks                  GET                                                                           
 *                               ?status=                     GET                      Returns a list of all orders grouped by table id and eventually filtered by status (queue, finished, up)(authorization required)
 * 
 *   /orders/:id                 None                         GET                      Returns an order by id (authorization required) (only cashier can get orders by id)
 * 
 *   /orders/:id                 None                         PUT                      Updates an order by id (authorization required) (only cooks, bartenders or cashier can update orders by id)
 * 
 *   /orders                     None                         POST                     Creates a new order (authorization required)    
 *  
 *   /orders/:id                 None                         DELETE                   Removes an order by id (authorization required) (only cashier can delete orders by id)
 * 
 *   /daily                      ?food                        GET                      Returns the total amount of money earned (authorization required) (only cashier can get total)
 *                               ?drinks                      GET                         
 * 
 * 
 *   /tables                     ?free                        GET                      Returns a list of all tables eventually filtered as free tables (authorization required)
 *                               ?occupied                    GET                      Returns a list of all tables eventually filtered as occupied tables (authorization required)
 *   /tables/:num                None                         GET                      Returns a table by id (authorization required) (only cashier can get tables by id)
 *   /tables/:num                None                         DELETE                   Delete a table by id (authorization required) (only cashier can delete tables by id)
 * 
 * 
 *   /menu                       ?food                        GET                      Returns a list of all menu items eventually filtered by food or drinks (authorization required) 
 *                               ?drinks                      GET             
 * 
 *   /menu                       None                         POST                     Creates a new menu item (authorization required) (only cashier can create new menu items)
 *   /menu/:id                   None                         DELETE                   Delete a menu item by id (authorization required) (only cashier can get menu items by id)
 *   
 * 
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



const app = express();  
const server = http.createServer(app);
const port = 3000;  
const { Server } = require("socket.io");
const io = new Server(server);
const secret = process.env.JWT_SECRET;

var auth = expressjwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']});

app.use(cors());
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



//--------------------ENDPOINTS--------------------//
app.get('/', (req, res) => {
    return res.status(200).json({
        api_version: '1.0', 
        endpoints: [ "/orders", "/tables", "/menu", "/users" ]
    });
});


// USER ENDPOINTS
app.post('/register', auth, authCashier, (req, res) => {
    //i want to  create a new user
    try{
        const {name, password, role} = req.body;
        const us = user.newUser({
            name: name
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

passport.use(new passportHTTP.BasicStrategy(
    function(username, password, done){
        console.log("New login from: " + username);
        user.getModel().findOne( {name: username}, (err: any, user: any) => {
            if(!user.validatePassword(password)){
                return done(null, false);
            }
            else if(!user){
                return done(null, false);
            }
            else if(err){
                
                return done({statusCode: 500, error: true, errormessage: err});
            }            
                return done(null, user);
        })
    }
));

app.post('/login', passport.authenticate('basic', {session: false}), (req: any, res) => {
    var _token = {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
        stats: req.user.stats,
        table: req.user.table
    };

    console.log("Login from: " + req.user.name);
    var tokenSigned = jwt.sign(_token, secret, {expiresIn: '4h'});
    return res.status(200).json({error: false, errormessage: "", token: tokenSigned});
});



app.post('/logout', auth, (req: any, res) => {
    try{
        const invalidate = "."; 
        jwt.sign(invalidate, secret);
        return res.status(200).json({error: false, errormessage: "", token: invalidate});
    } catch(err){
        console.log(err);
        return res.status(500).json({error: true, errormessage: err});
    }
});


app.get('/users', auth, authCashier, (req, res) => {
    var filter = {};
    if(req.query.role){
        filter = {$all: req.query.role};
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
    user.getModel().findOne(req.params.name).then((data) => {
        return res.status(200).json({error: false, errormessage: "", user: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});

app.delete('/users/:name', auth, authCashier, (req: any, res) => {
    user.getModel().findOneAndDelete(req.params.name).then((data) => {
        return res.status(200).json({error: false, errormessage: "", user: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});



// ORDER ENDPOINTS
app.get('/orders', auth, (req, res) => {
    var filter = {};
    if(req.query.tb){
        filter = {table: req.query.tb};
    }
    if(req.query.status){
        filter = {status: req.query.status};
    }
    if(req.query.food){
        filter = {type: req.query.food};
    }
    if(req.query.drinks){
        filter = {type: req.query.drinks};
    }
    console.log("Using filter: " + JSON.stringify(filter));
    console.log("Using query: " + JSON.stringify(req.query.tb));
    order.getModel().find(filter).then((data) => {
        return res.status(200).json({error: false, errormessage: "", orders: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    })
});

app.route('/orders/:id')
.get(auth, authCashier, (req, res) => {
    order.getModel().findById(req.params.id).then((data) => {
        return res.status(200).json({error: false, errormessage: "", order: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    }); 
})
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
        order.getModel().findByIdAndUpdate(req.params.id).then((order: any) => {
            user.getModel().findOne({name: order?.associatedWaiter}).then((us: any) => {
                io.emit('Order updated!', us.name);
            }).catch((err) => {
                return res.status(500).json({error: true, errormessage: err});
            });
            order.status = req.body.status;
            return res.status(200).json({error: false, errormessage: "", order: order});
        }).catch((err) => {
            return res.status(500).json({error: true, errormessage: err});
        });

    } else {   
        return res.status(401).json({err: "Cashier, cook or bartender authorization required"});
    }
})
.delete(auth, authCashier, (req, res) => {
    order.getModel().findByIdAndDelete(req.params.id).then((data) => {
        stats.updateDaily(data?.total);
        return res.status(200).json({error: false, errormessage: "", order: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});

app.post('/orders', auth, (req, res) => {
    //i want to notify through socket.io the users with role 'BARTENDER' and 'COOKS' that a new order has been created
    
    var newOrder = req.body;
    newOrder.timeStamp = new Date();
    order.getModel().create(newOrder).then((data) => {
        user.getModel().find({role: {$in: ['BARTENDER', 'COOK']}}).then((us) => {
            us.forEach((user) => {
                io.emit('New order arrived!', user.name);
            });
            stats.pushItem(data._id);
        }).catch((err) => {
            return res.status(500).json({error: true, errormessage: err});
        });
        if(req.body.food){
            order.newOrder(req.body).pushFood(req.body.food);
        }
        if(req.body.drinks){
            order.newOrder(req.body).pushDrink(req.body.drinks);
        }
        return res.status(200).json({error: false, errormessage: "", id: data._id});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});



app.get('/daily', auth, authCashier, (req, res) => {
   var daily = 0;
    order.getModel().find().then((data) => {
        data.forEach((order) => {
            daily += order.total;
        });
        return res.status(200).json({error: false, errormessage: "", daily: daily});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});


app.get('/tables', auth, (req, res) => {
    var filter = {};
    if(req.query.free){
        filter = {occ: false};
    }
    if(req.query.occupied){
        filter = {occ: true};
    }
    console.log("Using filter: " + JSON.stringify(filter));
    console.log("Using query: " + JSON.stringify(req.query.free));
    table.getModel().find(filter).then((data) => {
        return res.status(200).json({error: false, errormessage: "", tables: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});

app.route('/tables/:num')
.get(auth, authCashier, (req, res) => {
    table.getModel().findById(req.params.num).then((data) => {
        return res.status(200).json({error: false, errormessage: "", table: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
})
.delete(auth, authCashier, (req, res) => {
    table.getModel().findByIdAndDelete(req.params.num).then((data) => {
        return res.status(200).json({error: false, errormessage: "", table: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});




app.route('/menu')
.get(auth, (req, res) => {
    var filter = {};
    if(req.query.food){
        filter = {type: req.query.food};
    }
    if(req.query.drinks){
        filter = {type: req.query.drinks};
    }
    console.log("Using filter: " + JSON.stringify(filter));
    console.log("Using query: " + JSON.stringify(req.query.food));
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

app.delete('/menu/:id', auth, authCashier, (req, res) => {
    menu.getModel().findByIdAndDelete(req.params.id).then((data) => {
        return res.status(200).json({error: false, errormessage: "", item: data});
    }).catch((err) => {
        return res.status(500).json({error: true, errormessage: err});
    });
});



mongoose.connect('mongodb://127.0.0.1:27017/Taw')
.then(
    () => {
        console.log("Connected to database");
        return user.getModel().findOne({name: "admin"});
    }
).then(
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
