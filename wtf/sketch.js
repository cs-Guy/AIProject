// let mobilenet;
// let classifier;
// let video;
// let label = 'test';
// let ukeButton;
// let whistleButton;
// let trainButton;

// function modelReady() {
//   console.log('Model is ready!!!');
// }

// function videoReady() {
//   console.log('Video is ready!!!');
// }

// function whileTraining(loss) {
//   if (loss == null) {
//     console.log('Training Complete');
//     classifier.classify(gotResults);
//   } else {
//     console.log(loss);
//   }
// }


// function gotResults(error, result) {
//   if (error) {
//     console.error(error);
//   } else {
//     label = result;
//     classifier.classify(gotResults);
//   }
// }

// function setup() {
//   createCanvas(320, 270);
//   video = createCapture(VIDEO);
//   video.hide();
//   background(0);
//   mobilenet = ml5.featureExtractor('MobileNet', modelReady);
//   classifier = mobilenet.classification(video, videoReady);

//   ukeButton = createButton('happy');
//   ukeButton.mousePressed(function() {
//     classifier.addImage('happy');
//   });

//   whistleButton = createButton('sad');
//   whistleButton.mousePressed(function() {
//     classifier.addImage('sad');
//   });

//   trainButton = createButton('train');
//   trainButton.mousePressed(function() {
//     classifier.train(whileTraining);
//   });


// }

// function draw() {
//   background(0);
//   image(video, 0, 0, 320, 240);
//   fill(255);
//   textSize(16);
//   text(label, 10, height - 10);
// }

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


let mobilenet;
let video;
let canvas;
let features;
let classifier;
let neighbour = 10;
let confidenceThreshold = .9;
let previousWord;
let finishSentence = true;
let labelP;
let previous;
var train = document.getElementById("train");
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
      classifier.addImage(queryWord);
      console.log(queryWord);
  });
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
  canvas = createCanvas(400, 300);
  canvas.parent('showVideo');
  video = createCapture(VIDEO);
  //video.size(320, 240);
  video.size(400, 300);
  video.hide();
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  labelP = document.createElement("p");
  labelP.style.fontSize = '20pt';
  labelP.innerHTML = "Please Sign your Language"
  textHolder.appendChild(labelP);
  train.addEventListener('click',function(){
      classifier.train(whileTraining);
  });
}

function videoReady() {
  console.log('Video is ready!!!');
}
// function goClassify() {
//     const logits = features.infer(video);
//     knn.classify(logits,10, function (error, result) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(result);
//             if(words[result.label] != "start" && result.confidences[result.label] > confidenceThreshold && words[result.label] != previousWord && !finishSentence){

//                 if(words[result.label] == "stop"){
//                     finishSentence = true;
//                 }else{
//                     labelP.innerHTML += words[result.label];
//                 }
//                 previousWord = words[result.label];
//             }else{
//                 if(words[result.label] == "start"){
//                     clearPara();
//                     finishSentence = false;
//                     previousWord = words[result.label];
//                 }
//             }
//             goClassify();
//         }
//     });
// }

function clearPara() {
  labelP.innerHTML = "";
}

function whileTraining(loss) {
  if (loss == null) {
      console.log('Training Complete');
      classifier.classify(gotResults);
  } else {
      console.log(loss);
  }
}


function gotResults(error, result) {
  if (error) {
      console.error(error);
  } else {
      console.log(result);
      
      
      classifier.classify(gotResults);
  }
}

function modelReady() {
  console.log('MobileNet loaded!');
  classifier = mobilenet.classification(video, videoReady);
  // knn.load("model.json").then(function () {
  //     console.log("KNN Data Loaded");
  //     goClassify();

  // }).catch(function(){
  //     console.log("cannot find file");
  //     goClassify();
  // });
}


function draw() {
  background(0);
  image(video, 0, 0);
}

function saveModel() {
  classifier.save("model.json");
}

