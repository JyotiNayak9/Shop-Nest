# Architecture
# MVC pattern 
- Model
    - data mapping
    - data store
    - definition of the data

- view 
    - presentation
- controller
    - 9.8 m/s2 => Acc due to gravity =>9.8m/s2
    - brain of the project

# server
- client-server architecture

client ----->server
request generator ====> responder

Request
URl
protocol         http  https
domain.tld => top level domain
port no           80   443
path          /path/pth
query         /path?querystring
method          POST, GET,PUT, PATCH, DELETE

Endpoint ===> Data
        => JSON data => API
        => XML data/HTML => View

protocol://host.tld:portno/path/..../?queryString....

https://facebook.com/username



# Ecommerce prodject

a. Authentication and authorization 
     - login 
     - signup
     - activation
     -forgot password
     -reset password
     -logout
     0dashboard
     -rbac (role base action control)

b. Product
    -CRUD operation
    - product list
        -search
        -category
        -brand
    -Add to caart
    -wishlist
    -order

c. category
    -Crud operation
    - category list
    - category detail(product list = category)

d. Brand 
    - crud operation 
    -brand list
    - brand detail (product list - brand)
    

add-on features
e. Payment gateway
g. offers and coupons
f. review and rating
h. logistic

## CRUD operation
--> Methods
C = create => post method
R = Read => get method
U = update => put/patch method
D = delete => delete method

Auth and authorization
=>register
    => data entry => Form(react view)
        => submit
            => BE/ API caller

=> Login
    -> Login view(FORM login, react)
        ->Data entry(form action, react)
            ->API Call (BE call)
                ->post method


# content 
//user
 ->create
    =>post -> /user => body data => register data
 -> Read
    => get => /user => list all users
        ->?filter
    => get => /user/:id => get detail of a user
-> update
    => put/patch => /user/:id =>update request
-> delete
    => delete => /user/:id => delete operation

//user
banner
brand
category
product
order and cart

relational database
mysql
postgresql
oracle
ms-sql

non-relational database
mongodb - fast, data structure maintain garnu pardaina
sqlite  
redis

nosql- not only sql

host => localhost, 127.0.0.1
port => 27817
user => NR,
pass =>NR


PAALW0PYurPfvEG2 -mongo password
jyotinayak
n1pEMyL9vUbK1Hyy -api29


a. Insert
<activeDB>.<collectionName/tableName>.insertOne(<validd json object>)
<activeDB>.<collectionName/tableName>.insertMany(<validd json  array of objects>)

b.Find/select
=> <activeDB>.<collectionName/tableName>.find(filter, project)
filter =>
{
    key: value,
    key: value.....
}
=> ~ SELECT * FROM table WHERE  key = value AND key = value

{
    $operation: [] or {}
}

{
    $or: [{ley1:value1},{key2:value2}]
}
~ WHERE (key1 = value or key2 = value)

{
    $or: [],
    $or:[]
}

{
    $and:[
        {$or:[]},
        {$or:[]}
    ]
}

{
    key:{
        $gt:value
    }
}
$gt,$gte, $lt, $lte, $eq, $ne, $in, $nin

db.users.find({age:{$gt:18}})


- core development
-ORM/ODM implementation

MVC
m=model
        table name plural
        model name singular
        for e.g 
        users => table ename
        User => User model

    {key: value}
    collection keys or tablr column
    ===> the properties of a model

    User model => userObj() => keys

    Every object of a model class is a row /document of a table/collection

    Ecommerce application
        Entity list
            Users,
            Products,
            brand
            category
            cart
            order
            wishlist
            banner

            =>details
