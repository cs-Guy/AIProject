//Init firebase
var firebaseConfig = {
    apiKey: "AIzaSyCKJGgp8tahEwT2LhwwG0VZKmNyp4POHyY",
    authDomain: "ai-project-a2ecb.firebaseapp.com",
    databaseURL: "https://ai-project-a2ecb.firebaseio.com",
    projectId: "ai-project-a2ecb",
    storageBucket: "ai-project-a2ecb.appspot.com",
    messagingSenderId: "112172321237",
    appId: "1:112172321237:web:cf3f2fcb8b270d021d955c",
    measurementId: "G-B2Q8DHJ4XJ"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.database();
var wordsRef = db.ref().child("words");
var imageRef = db.ref().child("images");

const IMAGE_SIZE = 227;
const knn = null;
const mobilenetModule = null;
//Number of Nearest Neighbours for KNN classifier
const TOPK = 10;

const confidenceThreshold = 0.98

var words = [];
var video = document.getElementById("videoElement");
var addWordForm = document.getElementById("add-word");
var trainCardsHolder = document.getElementById("trainedCardsHolder");

wordsRef.on("child_added", snap => {
    // get Information of word from database
    var queryWord = snap.child("word").val();
    var queryId = snap.child("id").val();
    var queryExample = snap.child("exampleCount").val();

    // add word to words array
    words.push(queryWord);
    var trainHolderText = document.createElement('span');
    trainHolderText.innerText = queryWord;
    trainCardsHolder.appendChild(trainHolderText);
    var button = document.createElement('button');
    button.innerText = "Add Example";
    trainCardsHolder.appendChild(button);

    // Listen for mouse events when clicking the button, if clicked change training to index of words
    button.addEventListener('mousedown', function () {
        addExample(queryId);
    });
    
    // add "Clear Button"
    var btn = document.createElement('button');
    btn.innerText = "Clear";
    trainCardsHolder.appendChild(btn);

    // Listen for mouse events, if clicked clear training
    btn.addEventListener('mousedown', function () {
        console.log("clear training data for this label");
        knn.clearClass(queryId);
        console.log("clear");
        // console.log(words);
    });
    var exampleCount = document.createElement('span');
    exampleCount.innerText = queryExample + " examples";
    trainCardsHolder.appendChild(exampleCount);
    var breakLine = document.createElement('br');
    trainCardsHolder.appendChild(breakLine);
    updateExampleCount();
});


function initClassifier() {
    initWebcam();
    this.knn = knnClassifier.create();
    this.mobilenetModule = mobilenet.load();

}
initClassifier();

function initWebcam() {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'user'
        },
        audio: false
    })
        .then((stream) => {
            video.srcObject = stream;
            video.width = IMAGE_SIZE;
            video.height = IMAGE_SIZE;
        })


}

this.addWordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var word = document.getElementById("new-word").value.trim().toLowerCase();

    if (word && !words.includes(word)) {
        //console.log(word)
        var addWordRef = db.ref("words/" + words.length);
        var data = {
            exampleCount: 0,
            id: words.length,
            word: word
        };
        addWordRef.set(data);

        _this2.updateExampleCount();
        //console.log(words)


        document.getElementById("new-word").value = '';
        checkbox.checked = false;

        // console.log(words)
    } else {
        alert("Duplicate word or no word entered");
    }
    return;
});

function updateExampleCount() {
    var p = document.getElementById('count');
    p.innerText = 'Training: ' + words.length + ' words';
}

function addExample(i){
    var image = tf.browser.fromPixels(video);
    console.log(image);
    var logits = mobilenetModule.infer(image, 'conv_preds');
    var send = {
        id: i,
        image: logits
    }
    imageRef.push(send);
    knn.addExample(logits, i);
}

function clearExample(i){

}

function predictClass() {

}

