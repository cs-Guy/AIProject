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



let video;
let canvas;
let features;
let knn;
let neighbour = 10;
let confidenceThreshold = .9;
let previousWord;
let finishSentence = true;
var talk = new p5.Speech();
let labelP;
let previous;
var textHolder = document.getElementById("translationHolder");
var words = [];
var cards = document.getElementById("trainedCardsHolder");
var addWordForm = document.getElementById("add-word");

wordsRef.on("child_added", snap => {
    // get Information of word from database
    var queryWord = snap.child("word").val();
    // add word to words array
    words.push(queryWord);
    console.log(words);
    var queryText = document.createElement('span');
    queryText.innerText = queryWord;
    cards.appendChild(queryText);
    var button = document.createElement('button');
    button.innerText = "Add Example";
    cards.appendChild(button);
    button.addEventListener('click', function () {
        const logits = features.infer(video);
        console.log(queryWord);
        knn.addExample(logits, queryWord);
        updateCount(queryWord, exampleCount);
    });
    var btn = document.createElement('button');
    btn.innerText = "Clear";
    btn.addEventListener('mousedown', function () {
        knn.clearLabel(queryWord);
        console.log("clear " + queryWord);
        updateCount(queryWord, exampleCount);
    });
    cards.appendChild(btn);
    var exampleCount = document.createElement('span');
    exampleCount.id = "exampleCount" + queryWord;
    updateCount(queryWord, exampleCount);
    cards.appendChild(exampleCount);
    var breakLine = document.createElement('br');
    cards.appendChild(breakLine);


});

addWordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var word = document.getElementById("new-word").value.trim().toLowerCase();

    if (word && !words.includes(word)) {
        //console.log(word)
        var addWordRef = db.ref("words");
        var data = {
            word: word
        };
        addWordRef.push(data);
        document.getElementById("new-word").value = '';
    } else {
        alert("Duplicate word or no word entered");
    }
    return;
});


function setup() {
    //canvas = createCanvas(320, 240);
    canvas = createCanvas(340, 240);
    canvas.parent('showVideo');
    video = createCapture(VIDEO);
    //video.size(320, 240);
    video.size(340, 240);
    video.hide();
    features = ml5.featureExtractor('MobileNet', modelReady);
    labelP = document.createElement("p");
    labelP.style.fontSize = '20pt';
    labelP.innerHTML = "Please Sign your Language"
    textHolder.appendChild(labelP);
}

function goClassify() {
    const logits = features.infer(video);
    knn.classify(logits, 10, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            var temp = Object.values(result.confidences);
            console.log(temp);
            var index = indexOfMax(temp);
            console.log(words[index]);
            if (words[index] != "start" && temp[index] > confidenceThreshold && words[index] != previousWord && !finishSentence) {

                if (previousWord != words[index] && words[index] == "stop") {
                    finishSentence = true;
                } else {
                    labelP.innerHTML += words[index];
                    talk.speak(words[index]);
                }
                previousWord = words[index];
            } else {
                if (words[index] == "start") {
                    clearPara();
                    finishSentence = false;
                    previousWord = words[index];
                }
            }
            goClassify();
        }
    });
}
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
function clearPara() {
    labelP.innerHTML = "";
}
function updateCount(n, m) {
    const counts = knn.getCountByLabel();

    m.innerHTML = (counts[n] || 0) + " exampleCount";

}


function modelReady() {
    console.log('MobileNet loaded!');
    knn = ml5.KNNClassifier();
    knn.load("model.json").then(function () {
        console.log("KNN Data Loaded");
        goClassify();

    }).catch(function () {
        console.log("cannot find file");
        goClassify();
    });
}


function draw() {
    image(video, 0, 0);

}

function saveModel() {
    knn.save("model.json");
}

