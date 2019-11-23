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

const IMAGE_SIZE = 227;

//Number of Nearest Neighbours for KNN classifier
const TOPK = 10;

const confidenceThreshold = 0.98

var words = [];


this.video = document.getElementById("videoElement");
console.log(video);


function initClassifier() {
    initWebcam();
    const knn = knnClassifier.create();
    const mobilenetModule = mobilenet.load();

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



function predictClass() {

}

