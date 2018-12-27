window.onload = function(){

  var physics = (function() {
    // Initial condition for the system
    var initialConditions = {
      position:       1.0, // Box is shown on the right initially
      velocity:       0.0, // Velocity is zero
      springConstant: 100.0, // The higher the value the stiffer the spring
      mass:           10.0 // The mass of the box
    };

    // Current state of the system
    var state = {
      /*
      Position of the box:
        0 is when the box is at the center.
        1.0 is the maximum position to the right.
        -1.0 is the maximum position to the left.
      */
      position: 0,
      velocity: 0,
      springConstant: 0, // The higher the value the stiffer the spring
      mass: 0 // The mass of the box
    };

    var deltaT = 0.016; // The length of the time increment, in seconds.

    function resetStateToInitialConditions() {
      state.position = initialConditions.position;
      state.velocity = initialConditions.velocity;
      state.springConstant = initialConditions.springConstant;
      state.mass = initialConditions.mass;
    }

    // Returns acceleration (change of velocity) for the given position
    function calculateAcceleration(x) {
      // We are using the equation of motion for the harmonic oscillator:
      // a = -(k/m) * x
      // Where a is acceleration, x is displacement, k is spring constant and m is mass.

      return -(state.springConstant / state.mass) * x;
    }

    // Calculates the new velocity: current velocity plus the change.
    function newVelocity(acceleration) {
      return state.velocity + deltaT * acceleration;
    }

    // Calculates the new position: current position plus the change.
    function newPosition() {
      return state.position + deltaT * state.velocity;
    }

    // The main function that is called on every animation frame.
    // It calculates and updates the current position of the box.
    function updatePosition() {
      var acceleration = calculateAcceleration(state.position);
      state.velocity = newVelocity(acceleration);
      state.position = newPosition();
      if (state.position > 1) { state.position = 1; }
      if (state.position < -1) { state.position = -1; }
    }

    return {
      resetStateToInitialConditions: resetStateToInitialConditions,
      updatePosition: updatePosition,
      initialConditions: initialConditions,
      state: state,
    };
  })();

  // Draw the scene
  var graphics = (function() {
    var canvas = null, // Canvas DOM element.
      context = null, // Canvas context for drawing.
      canvasHeight = 100,
      boxSize = 50,
      springInfo = {
        height: 30, // Height of the spring
        numberOfSegments: 12 // Number of segments in the spring.
      },
      colors = {
        shade30: "#a66000",
        shade40: "#ff6c00",
        shade50: "#ffb100"
      };

    // Return the middle X position of the box
    function boxMiddleX(position) {
      var boxSpaceWidth = canvas.width - boxSize;
      return boxSpaceWidth * (position + 1) / 2 + boxSize / 2;
    }

    // Draw spring from the box to the center. Position argument is the box position and varies from -1 to 1.
    // Value 0 corresponds to the central position, while -1 and 1 are the left and right respectively.
    function drawSpring(position) {
      var springEndX = boxMiddleX(position),
        springTopY = (canvasHeight - springInfo.height) / 2,
        springEndY = canvasHeight / 2,
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
        if (i === springInfo.numberOfSegments - 1) { springEndY = canvasHeight / 2; }

        context.lineTo(springEndX, springEndY);
        springGoesUp = !springGoesUp;
      }

      context.stroke();
    }

    // Draw a box at position. Position is a value from -1 to 1.
    // Value 0 corresponds to the central position, while -1 and 1 are the left and right respectively.
    function drawBox(position) {
      var boxTopY = Math.floor((canvasHeight - boxSize) / 2);
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

    // Draw vertical line in the middle
    function drawMiddleLine() {
      var middleX = Math.floor(canvas.width / 2);

      context.beginPath();
      context.moveTo(middleX, 0);
      context.lineTo(middleX, canvas.height);
      context.lineWidth = 2;
      context.strokeStyle = colors.shade40;
      context.setLineDash([2,3]);
      context.stroke();
      context.setLineDash([1,0]);
    }

    // Clears everything and draws the whole scene: the line, spring and the box.
    function drawScene(position) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawMiddleLine();
      drawSpring(position);
      drawBox(position);
    }

    function hideCanvasNotSupportedMessage() {
      document.getElementById("AlertCanvasNotSupported").style.display ='none';
    }

    // Resize canvas to will the width of container
    function fitToContainer(){
      canvas.style.width='100%';
      canvas.style.height= canvasHeight + 'px';
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

      // If we got to this point it means the browser can draw
      // Hide the old browser message
      hideCanvasNotSupportedMessage();

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
      graphics.drawScene(physics.state.position);
      window.requestAnimationFrame(animate);
    }

    function start() {
      graphics.init(function() {
        // Use the initial conditions for the simulation
        physics.resetStateToInitialConditions();

        // Redraw the scene if page is resized
        window.addEventListener('resize', function(event){
          graphics.fitToContainer();
          graphics.drawScene(physics.state.position);
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
