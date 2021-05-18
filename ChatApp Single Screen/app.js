var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get the name for the user
if (!localStorage.getItem("name")) {
    name = prompt("What is your name?");
    localStorage.setItem("name", name);
} else {
    name = localStorage.getItem("name");
}
document.querySelector("#name").innerText = name;

// Change name
document.querySelector("#change-name").addEventListener("click", () => {
    name = prompt("What is your name?");
    localStorage.setItem("name", name);
    document.querySelector("#name").innerText = name;
});

// Send a new chat message
document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    firebase
        .firestore()
        .collection("messages")
        .add({
            name: name,
            message: document.querySelector("#message-input").value,
            date: firebase.firestore.Timestamp.fromMillis(Date.now()),
        })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            document.querySelector("#message-form").reset();
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
});

// Display chat stream
firebase
    .firestore()
    .collection("messages")
    .orderBy("date", "asc")
    .onSnapshot(function (snapshot) {
        document.querySelector("#messages").innerHTML = "";
        snapshot.forEach(function (doc) {
            var message = document.createElement("div");
            message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		`;
            document.querySelector("#messages").prepend(message);
        });
    });

// Remove all chat messages
document.querySelector("#clear").addEventListener("click", () => {
    firebase
        .firestore()
        .collection("messages")
        .get()
        .then(function (snapshot) {
            snapshot.forEach(function (doc) {
                firebase
                    .firestore()
                    .collection("messages")
                    .doc(doc.id)
                    .delete()
                    .then(function () {
                        console.log("Document successfully deleted!");
                    })
                    .catch(function (error) {
                        console.error("Error removing document: ", error);
                    });
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
});
