# unitum

Unitum Web App

## Backend: Setup

---

The setup is really simple, just create environment variables. you can check the ".env.sample" file for all the environment variables you need and the format of some of the values.

For secret key generation, you can visit [Secret key generator](https://secret-key-generator.vercel.app/) to get one.  
Do note to get two different secret keys, one for JWT_SECRET and one for RF_TOKEN_SECRET.

### Socket.io Implementation 😎😋

---

The client need to provide Authorization header when initializing the socket an all when sending subsequent requests.<br>
The Authorization header must have the access token provided after sign in / sign up as value.<br>

On successful connection,

> - The connected user is added to a private room. The room name is the id of the user.
> - The connected user is added to all communities the user is part of. The room name is the community id
> - An event named "Notification:get" is emitted. This event contains a list of all unread notifications for the connected user.

#### Other custom events emitted by the server: notifications

---

- **new notification**: This notification event emitted when ever there is a new notification. it returns an object that with the details about the notification. The properties of this objects are:

  - **message**: This contains the description of the notification. (required)
  - **userID**: The id of the user who owns this notification.
  - **user**: Some profile information of the user who performed an action that triggered this notification
  - **createdAt**: The timestamp of the notification
  - **type**: This is the type of notification. there are three types of notifications; (required)
    - **_message_**: private message notification
    - **_post_**: post like or comment notification
    - **_community_**: community activity such as new post, post like or comment.
  - **postID**: the id of the post the action("comment", "like") happened.
  - **community**: the id of the community in which the action ("create", "comment", "like") happened

- **new message**: emitted when there is a new private message for the connected user. It returns the message object with these properties:
  - **_\_id_**: the id of the message
  - **_from_**: some profile info of the user who sent the message
  - **_to_**: the id of the intended reciever(user)
  - **_text_**: the text content of the message
  - **_media_**: the url of the media part of the message
  - **_createdAt_**: the timestamp of the message.

### Custom events emitted by the server: private chat

---

- **all chats**: this event returns a list all the chats or conversations of a the connected user. The shape of the chat object is:

  - **_\_id_**: the id of the chat.
  - **_participants_**: an array containing some profile info("fullName", "picture") of the the users participating in this chat.
  - **_messages_**: an array of one element, the latest message in the chat.

- **chat messages**: returns an array of 30(default) most recent messages in a chat.

### Custom events listened by the server: private chat

---

- **message:send**: this event expects two required parameters:

  - **_msg_**: The message object.
    - **_to_**: The id of the intended recipient
    - **_chatID_**: the id of the chat
    - **_text_**: the text content of the message
    - **_media_**: url to the media content of the message
  - **_callback_**: a callback function to achieve a request - response cycle. This callback will be called to communicate the status of the event emitted.

    if the message sent passes all validations, it is saved and "new message" event is emitted for the intended recipient of the message.

- **message:delete**: takes two parameters; **_messageID_** and **_callback function_**.

- **chat:all**: takes a parameter; **_callback function_**. It emits the "**_all chats_**" events and also join the user to all the chat rooms. The chat room should be referenced by the id of the chat.

- **chat:read**: takes two required parameters; **_chatID_** and **_callback function_** and two optional parameters; **_skip_** and **_limit_**.<br>
  It emits the **_chat messages_** event.

- **_chat:delete_**: takes two required parameters; **_chatID_** and **_callback function_**. It delete the chat with the provided chatID.
