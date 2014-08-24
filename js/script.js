window.AudioContext = window.AudioContext || window.webkitAudioContext;

angular.module('audioApp', [])
  .controller('mainCtrl', ['$scope', function($scope) {

    var buffer_size = 2048;
    var context = new AudioContext();
    var sampleRate = context.sampleRate;
    var jsNode = context.createJavaScriptNode(buffer_size , 0, 2);

    $scope.f1 = 440;
    $scope.f2 = 440;
    var f1z = $scope.f1;
    var f2z = $scope.f2;
    var vol = 0.0;
    $scope.playing = false;

    function initAudio() {

      var t = 0;

      jsNode.onaudioprocess = function(e) {
        var outL = e.outputBuffer.getChannelData(0);
        var outR = e.outputBuffer.getChannelData(1);
        var sample = new Float32Array(buffer_size);
        for (var i = 0 ; i < buffer_size ; i++){
          sample[i] = vol* (Math.sin(2 * Math.PI * $scope.f1 * t) + Math.sin(2 * Math.PI * $scope.f2 * t));
          doStep();
        }
        outL.set(sample);
        outR.set(sample);
      };

      var doStep = function () {
        t += 1.0/sampleRate;
        f1z = 0.001*$scope.f1 + 0.999*f1z;
        f2z = 0.001*$scope.f2 + 0.999*f2z;
      };

      var bufSrc = context.createBufferSource();

      bufSrc.noteOn(0);
      bufSrc.connect(jsNode);

      jsNode.connect(context.destination);
    }

    initAudio();

    $scope.togglePlay = function() {
      if (vol > 0) {
        vol = 0;
        $scope.playing = false;
      } else {
        vol = 0.5;
        $scope.playing = true;
      }
      $scope.$apply();
    }

  }]);

