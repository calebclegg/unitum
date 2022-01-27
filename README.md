# unitum

Unitum Web App

## Backend: Setup
---
The setup is really simple, just create environment variables. you can check the ".env.sample" file for all the environment variables you need and the format of some of the values.

For secret key generation, you can visit [Secret key generator](https://secret-key-generator.vercel.app/) to get one.  
Do note to get two different secret keys, one for JWT_SECRET and one for RF_TOKEN_SECRET.

### Socket.io Implementation
---

The client need to provide Authorization header when initializing socket.<br>
The Authorization header must have the access token provided after sign in / sign up as value.<br>

On successful connection,

> - The connected user is added to a private room. The room name is the id of the user.
> - The connected user is added to all communities the user is part of. The room name is the community id
> - An event named "Notification:get" is emitted. This event contains a list of all unread notifications for the connected user.

#### Other custom events emitted by the server
---
* **New Notification**: This a notification event emitted when ever there is a new notification. it returns an object that with the details about the notification. The properties of this objects are:
  * **message**: This contains the description of the notification. (required)
  * **userID**: The id of the user who owns this notification.
  * **user**: Some profile information of the user who performed an action that triggered this notification
  * **createdAt**: The timestamp of the notification
  * **type**: This is the type of notification. there are three types of notifications; (required) 
    * ***message***: private message notification
    * ***post***: post like or comment notification
    * ***community***: community activity such as new post, post like or comment.
  * **postID**: the id of the post the action("comment", "like") happened.
  * **community**: the id of the community in which the action ("create", "comment", "like") happened

* **new message**: emitted when there is a new private message for the connected user. It returns the message object with these properties:
  * ***_id***: the id of the message
  * ***from***: some profile info of the user who sent the message
  * ***to***: the id of the intended reciever(user)
  * ***text***: the text content of the message
  * ***media***: the url of the media part of the message
  * ***createdAt***: the timestamp of the message.
  
