Auth
 POST /auth/signup
 POST /auth/login
 GET /auth/logout
 PATCH /auth/forgetPassword


Profile
 GET /user/view
 PATCH /user/edit

Connections
 POST /request/like/:receiverID
 POST /request/dislike/:receiverID
 POST review/request/accepted/:requestID
 POST review/request/rejected/:requestID

User
 GET /users/connections
 GET /users/request
 GET /users/feed
