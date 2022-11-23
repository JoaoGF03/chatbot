# **Server**
### **TODO**
- [ ] CI/CD
  
* [ ] Email verification on account creation

- [ ] Create contacts table
  - [ ] View all contacts
  - [ ] Delete a contact
  - [ ] Add a contact
  - [ ] Block a contact
  - [ ] Unblock a contact
  - [ ] View all blocked contacts

* [ ] Create activation messages table
  * [ ] View all activation messages
  * [ ] Add an activation message
  * [ ] Update an activation message
  * [ ] Delete an activation message

### **Planing**
* Save Contact on message received
* Block/Mute a Contact so that they can't receive messages from the bot
* Register what message was sent and when it was sent
* Check if the Contact is blocked before sending a message
* Check if the Contact has activated the flow today and hasn't received the 'still needs help' message
  * Send a message asking if he still needs help (can only be sent if he has activated the flow)
    * If so, send the first message of the flow
    * If not, send a message saying that he will be contacted later

# **Client**
### **TODO**
* [ ] Create account page
