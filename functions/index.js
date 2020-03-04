const functions = require('firebase-functions');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.database
  .ref("chatRoom/{key}")
  .onWrite(event => {
    console.log('cloud func event >>',event.after._data)
    const data = event.after._data;
    console.log('user data >>', data)
    payload = {
      notification: {
        title: `Message from ${data.name}`,
        body: data.message,
      },
    };
    const reciverId =data.reciverId;
    console.log('reciverId >>',reciverId)
    return admin.database().ref(`users/${reciverId}`).once('value').then((data) => {
      // if (!data.val()) return;
      const snapshot = data.val();
      console.log('reciverId snapshot >>',snapshot)
      const token = snapshot.deviceToken;

      return admin.messaging().sendToDevice(token, payload)
       .then(function(response) {
        console.log("Notification sent successfully:", response);
      })
      .catch(function(error) {
        console.log("Notification sent failed:", error);
      });
  });
    // admin
    //   .messaging()
    //   .sendToDevice(data.deviceToken, payload)
    //   .then(function(response) {
    //     console.log("Notification sent successfully:", response);
    //   })
    //   .catch(function(error) {
    //     console.log("Notification sent failed:", error);
    //   });
  });
