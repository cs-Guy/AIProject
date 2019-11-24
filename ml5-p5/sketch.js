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
let finishSentence = false;
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
    var queryText = document.createElement('span');
    queryText.innerText = queryWord;
    cards.appendChild(queryText);
    var button = document.createElement('button');
    button.innerText = "Add Example";
    cards.appendChild(button);
    button.addEventListener('click', function () {
        const logits = features.infer(video);
        knn.addExample(logits, queryWord);
        updateCount(queryWord, exampleCount);
    });
    var btn = document.createElement('button');
    btn.innerText = "Clear";
    btn.addEventListener('mousedown', function () {
        knn.clearLabel(queryWord);
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
    canvas = createCanvas(476, 357);
    canvas.parent('showVideo');
    video = createCapture(VIDEO);
    //video.size(320, 240);
    video.size(476, 357);
    video.hide();
    features = ml5.featureExtractor('MobileNet', modelReady);
    labelP = document.createElement("p");
    labelP.style.fontSize ='20pt';
    labelP.innerHTML = "Please Sign your Language"
    textHolder.appendChild(labelP);
}

function goClassify() {
    const logits = features.infer(video);
    knn.classify(logits,10, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            if(words[result.label] != "start" && result.confidences[result.label] > confidenceThreshold && words[result.label] != previousWord && !finishSentence){
                if(words[result.label] == "stop"){
                    finishSentence = true;
                }else{
                    labelP.innerHTML += words[result.label];
                }
            }else{
                if(words[result.label] == "start"){
                    clearPara();
                    finishSentence = false;
                }
            }
            goClassify();
        }
    });
}

function clearPara(){
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

    }).catch(function(){
        console.log("cannot find file");
        goClassify();
    });
}


function draw() {
    image(video, 0, 0);

}

function saveModel(){
    knn.save("model.json");
}

