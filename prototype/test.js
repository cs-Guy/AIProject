(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
    1: [function (require, module, exports) {
        'use strict';

        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        var _deeplearnKnnImageClassifier = require('deeplearn-knn-image-classifier');

        var _deeplearn = require('deeplearn');

        var dl = _interopRequireWildcard(_deeplearn);

        function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

        function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // Launch in kiosk mode
        // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --app=http://localhost:9966

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
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        var db = firebase.database();
        var wordsRef = db.ref().child("words");

        // Webcam Image size. Must be 227. 
        var IMAGE_SIZE = 227;
        // K value for KNN
        var TOPK = 10;

        var predictionThreshold = 0.98;

        var words = [];
        wordsRef.on("child_added", snap => {
            words.push(snap.child("word").val());

        });
        console.log(words);