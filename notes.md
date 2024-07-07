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
