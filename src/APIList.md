Auth
 POST /auth/signup
 POST /auth/login
 GET /auth/logout
 PATCH /auth/forgetPassword


Profile
 GET /user/view
 PATCH /user/edit

Connections
 POST /request/like/:senderID
 POST /request/dislike/:senderID
 POST /request/accepted/:receiverID
 POST /request/rejected/:receiverID

User
 GET /users/connections
 GET /users/request
 GET /users/feed
