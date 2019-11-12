(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND", a
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];
                    return o(n || r)
                }, p, p.exports, r, e, n, t)
            }
            return n[i].exports
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o
    }
    return r
})()({
    1: [function (require, module, exports) {
        'use strict';

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _deeplearnKnnImageClassifier = require('deeplearn-knn-image-classifier');

        var _deeplearn = require('deeplearn');

        var dl = _interopRequireWildcard(_deeplearn);

        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            } else {
                var newObj = {};
                if (obj != null) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                    }
                }
                newObj.default = obj;
                return newObj;
            }
        }

        function _toConsumableArray(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            } else {
                return Array.from(arr);
            }
        }

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }



        //----------------Tangible code begins--------------------------------------------------------------------


        // Webcam Image size. Must be 227.
        const IMAGE_SIZE = 227;
        // K value for KNN. 10 means that we will take votes from 10 data points to classify each tensor.
        const TOPK = 10;
        // Percent confidence above which prediction needs to be to return a prediction.
        const confidenceThreshold = 0.98

        // Initial Gestures that need to be trained.
        // The start gesture is for signalling when to start prediction
        // The stop gesture is for signalling when to stop prediction
        var words = ["start", "stop"];


        var Main = function () {
            function Main() {
                _classCallCheck(this, Main);

                // Initialize variables for display as well as prediction purposes
                this.exampleCountDisplay = [];
                this.checkMarks = [];
                this.gestureCards = [];
                this.training = -1; // -1 when no class is being trained
                this.videoPlaying = false;
                this.previousPrediction = -1;
                this.currentPredictedWords = [];

                // Variables to restrict prediction rate
                this.now;
                this.then = Date.now();
                this.startTime = this.then;
                this.fps = 5; //framerate - number of prediction per second
                this.fpsInterval = 1000 / this.fps;
                this.elapsed = 0;

                // Initalizing kNN model to none.
                this.knn = null;
                /* Initalizing previous kNN model that we trained when training of the current model
                is stopped or prediction has begun. */
                this.video = document.getElementById('video');
                this.video.addEventListener('mousedown', function () {
                    // click on video to go back to training buttons
                    main.pausePredicting();
                    _this2.trainingListDiv.style.display = "block";
                });

                this.addWordForm = document.getElementById("add-word");
                this.addWordForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    var word = document.getElementById("new-word").value.trim();

                    if (word && !words.includes(word)) {
                        //console.log(word)
                        words.splice(words.length - 1, 0, word); //insert at penultimate index in array
                        _this2.createButtonList(false);
                        _this2.updateExampleCount();
                        //console.log(words)


                        if (checkbox.checked) {
                            endWords.push(word);
                        }

                        document.getElementById("new-word").value = '';
                        checkbox.checked = false;

                        // console.log(words)
                        // console.log(endWords)
                    } else {
                        alert("Duplicate word or no word entered");
                    }

                    return;
                });

