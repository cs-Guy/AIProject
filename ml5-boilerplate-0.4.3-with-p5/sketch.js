let video;
let features;
let knn;


function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  features = ml5.featureExtractor('MobileNet', modelReady);
  knn = ml5.KNNClassifier();
}

function gotResult(result){
    console.log(result);
}
function mousePressed(){
    const logits = features.infer(video);
    knn.classify(logits, gotResults);
}
function keyPressed() {
    const logits = features.infer(video);
    if(key == "l"){
        knn.addExample(logits,"left");
    }else if(key == "r"){
        knn.addExample(logits,"right");
    }
    //console.log(logits.dataSync());
}


function modelReady() {
  console.log('model ready!');
}

function draw() {
  image(video, 0 ,0);
}