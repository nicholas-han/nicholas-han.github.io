window.onload = function(){

  var physics = (function() {

    var universeSetting = {
      star1Position: [-1.0, 0.0],
      star2Position: [1.0, 0.0],

      planetMass: 0.1,
      starMass: 1000.0,
      gravitationConstant: 1e-5,
      
      deltaT: 0.016
    };

    var initialState = {
      position: [1.2, 0.0],
      velocity: [0.0, 0.1]
    };

    var currentState = {
      position: [1.2, 0.0],
      velocity: [0.0, 0.1]
    };

    function calculateDistance(pos1, pos2) {
      var sum = 0;
      for (i = 0; i < pos1.length; i++) {
        sum += Math.pow(pos1[i] - pos2[i], 2);
      }
      return sum;
    }

    function resetToInitialState() {
      currentState.position = initialState.position;
      currentState.velocity = initialState.velocity;
    }

    function newAcceleration() {
      var distance = calculateDistance(currentState.position, universeSetting.star1Position);
      var acceleration = universeSetting.planetMass*universeSetting.gravitationConstant/Math.pow(distance, 2); // g = GM/r^2
      var accelerationComponent = Array(currentState.position.length);
      for (i = 0; i < accelerationComponent.length; i++) {
        accelerationComponent[i] = acceleration/distance*(currentState.position[i]-universeSetting.star1Position[i]);
      }
      return accelerationComponent;
    }

    function newVelocity(acceleration) {
      var velocity = Array(currentState.velocity.length);
      for (i = 0; i < velocity.length; i++) {
        velocity[i] = currentState.velocity[i] + universeSetting.deltaT * acceleration[i];
      }
      return velocity;
    }

    function newPosition() {
      var position = Array(currentState.position.length);
      for (i = 0; i < position.length; i++) {
        position[i] = currentState.position[i] + universeSetting.deltaT * currentState.velocity[i];
      }
      return position;
    }

    function updatePosition() {
      currentState.velocity = newVelocity(newAcceleration());
      currentState.position = newPosition();
    }

    return {
      resetToInitialState: resetToInitialState,
      updatePosition: updatePosition,
      initialState: initialState,
      currentState: currentState,
    };

  })();

  var graphics = (function() {
    var canvas = null, // Canvas DOM element.
      context = null, // Canvas context for drawing.
      colors = {
        shade30: "#a66000",
        shade40: "#ff6c00",
        shade50: "#ffb100"
      };

    // Return the middle X position of the box
    function middleX(position) {
      var boxSpaceWidth = canvas.width - boxSize;
      return boxSpaceWidth * (position + 1) / 2 + boxSize / 2;
    }

    // Draw spring from the box to the center. Position argument is the box position and varies from -1 to 1.
    // Value 0 corresponds to the central position, while -1 and 1 are the left and right respectively.
    function drawSpring(position) {
      var springEndX = boxMiddleX(position),
        springTopY = (canvas.height - springInfo.height) / 2,
        springEndY = canvas.height / 2,
        canvasMiddleX = canvas.width / 2,
        singleSegmentWidth = (canvasMiddleX - springEndX) / (springInfo.numberOfSegments - 1),
        springGoesUp = true;

      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = colors.shade40;
      context.moveTo(springEndX, springEndY);

      for (var i = 0; i < springInfo.numberOfSegments; i++) {
        var currentSegmentWidth = singleSegmentWidth;
        if (i === 0 || i === springInfo.numberOfSegments - 1) { currentSegmentWidth /= 2; }

        springEndX += currentSegmentWidth;
        springEndY = springTopY;
        if (!springGoesUp) { springEndY += springInfo.height; }
        if (i === springInfo.numberOfSegments - 1) { springEndY = canvas.height / 2; }

        context.lineTo(springEndX, springEndY);
        springGoesUp = !springGoesUp;
      }

      context.stroke();
    }

    

    // Draw a box at position. Position is a value from -1 to 1.
    // Value 0 corresponds to the central position, while -1 and 1 are the left and right respectively.
    function drawBox(position) {
      var boxTopY = Math.floor((canvas.height - boxSize) / 2);
      var startX = boxMiddleX(position) - boxSize / 2;

      // Rectangle
      context.beginPath();
      context.fillStyle = colors.shade50;
      context.fillRect(startX, boxTopY, boxSize, boxSize);

      // Border around rectangle
      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = colors.shade30;
      context.strokeRect(startX + 0.5, boxTopY + 0.5, boxSize - 1, boxSize - 1);
    }

    function drawStar(position) {

      context.drawImage(new Image(src='images/sun.jpg'), 0, 0, 1000, 1000);

    }

    // Clears everything and draws the whole scene: the line, spring and the box.
    function drawScene(position) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawStar(position);
    }

    // Resize canvas to will the width of container
    function fitToContainer(){
      canvas.style.width= '80%';
      canvas.style.height= '80%';
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    // Create canvas for drawing and call success argument
    function init(success) {
      // Find the canvas HTML element
      canvas = document.getElementById("TwoStarSystemCanvas");

      // Check if the browser supports canvas drawing
      if (!(window.requestAnimationFrame && canvas && canvas.getContext)) { return; }

      // Get canvas context for drawing
      context = canvas.getContext("2d");
      if (!context) { return; } // Error, browser does not support canvas

      // Update the size of the canvas
      fitToContainer();

      // Execute success callback function
      success();
    }

    return {
      fitToContainer: fitToContainer,
      drawScene: drawScene,
      init: init
    };
  })();

  // Start the simulation
  var simulation = (function() {
    // The method is called 60 times per second
    function animate() {
      physics.updatePosition();
      graphics.drawScene(physics.currentState.position);
      window.requestAnimationFrame(animate);
    }

    function start() {
      graphics.init(function() {
        // Use the initial conditions for the simulation
        physics.resetToInitialState();

        // Redraw the scene if page is resized
        window.addEventListener('resize', function(event){
          graphics.fitToContainer();
          graphics.drawScene(physics.currentState.position);
        });

        // Start the animation sequence
        animate();
      });
    }

    return {
      start: start
    };
  })();

  simulation.start();

};
