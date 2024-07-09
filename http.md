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
