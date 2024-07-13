# Notes

dotenv
is used so that all envirionment variables is loaded for all in inital start

cors
cross origin resource sharing when connection with front end and backend

req.body
various data types to be sent to the server json form etc

middleware: req,res,next which acts as an mediary that helps to communcate with the client and server

asynchandler is a utility that is a higher order function tht takes a function as a parameter and creates two instances of it a asucess and a error when a sucess is occured then we sucessfully pass the requestFunction with req,res,next

apiError is a utility that is a class that is used to standardize the way we pass errrors from backend for example we can forget to send either status codes or even message sthis is used to crete a standard such that we have a boiler plate of error handeling

apiResponse is a utility that is a class that is used to standarize the way that we pass responses to the front end form the backend by passing sucess code messages os that all reponses can be created with a same standard

jwt is a bearer token used for generating tokens to encrypt the payload user information requires verficaition secret

bcrypt; for encrypting password

aggregatepaginate: study more from docs

multer is used to upload files in a backend we cannot pass files in middlewares for that we use multer or expressupload
cloudinary is used to upload files in the cloudinary server and get the url of the image uploaded which is then stored in the database
this is done so that the mondodb database size doesnt require more amount of unnecessary storage

what we use in use for route will become the prefix and based on the type of http method the required method will be called
for example
app.use('/users',routerlocaiton)
in the controlle
router.route('/register).post(contoller)
router.route('/login).get(contoller)
then the route will become /user/register when we iinvoke the post requeist
similarly oif there is get then login

# http

http stands for hyper text transfeer protocol
uri uniform resourse informartion

http header is meta data that works in key value pairs
http header is used for caching authentication and user State management

req headers
res headers
representation header encoding and compression
payload headers: data

common headers
accept: type of data sent or recieved
user-agent: to find what type of device user is using example mobile chrome firefox
authorization: contains jwt
content-types
cookies
cache-control

### http methods

http methods show what type of operation is being performed by server or user

1. get : retrive informations from the server default method is get
2. post: send resources to the server from the client
3. put: replace a resource
4. delete: remove a resource
5. patch: replaces a part of a resource
6. options: what http options are available
7. trace: mostly used in debugging shows a loopback of ooperations that were performed
8. head: retrieve the heads only not the body

### http status-codes

1. 1xx: information
2. 2xx: success
3. 3xx: redirection
4. 4xx: client error
5. 5xx: server error

100: continue
102: processing
200: ok
201: created
202: accepted
307: temporary redirect
308: permanent redirect
400: bad request
401: unauthorized
402: payment required
403: forbidden
404: not found
500: internal server error
504: gateway time out
