//Init firebase


var db = firebase.database();
var wordsRef = db.ref().child("words");
var imageRef = db.ref().child("images");

const IMAGE_SIZE = 227;
const knn = null;
const model = null;
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
    trainHolderText.innerText = queryWord + " ";
    trainCardsHolder.appendChild(trainHolderText);
    var button = document.createElement('button');
    button.innerText = "Add Example";
    trainCardsHolder.appendChild(button);

    // Listen for mouse events when clicking the button, if clicked change training to index of words
    button.addEventListener('mousedown', function () {
        addExample(queryId,queryExample);
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
    exampleCount.id = queryWord;
    exampleCount.innerText = " "+queryExample + " examples";
    trainCardsHolder.appendChild(exampleCount);
    var breakLine = document.createElement('br');
    trainCardsHolder.appendChild(breakLine);
    updateExampleCount();
});



function initClassifier() {
    initWebcam();
    this.knn = knnClassifier.create();
    this.model = mobilenet.load();

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

        //console.log(words)

        document.getElementById("new-word").value = '';

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

function addExample(i,j){
    var image1 = tf.browser.fromPixels(video,1);
    var send = {
        id: i,
        image: image1
    }
    imageRef.push(send);
    var updates = {exampleCount: j+1};
    var updater = db.ref("words/"+i);
    updater.update(updates);
    
    
}

function clearExample(i){

}

function predictClass() {

}

