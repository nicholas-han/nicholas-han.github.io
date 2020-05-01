// Header Icon: 4D Cube Animation
var canvas, context, timer;

function initHeaderIcon() {
    canvas = document.getElementById("headerIcon");
    context = canvas.getContext("2d");
    setInterval(draw, 100);
}

var counter = 1;
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "red";
    context.beginPath();
    context.setLineDash([]);
    var topleft = [10+5*Math.sin(counter), 60+10*Math.sin(counter/3)];
    var edgeSize = 70;
    var scaleFactor = 0.75;
    // draw front
    var currcoord = topleft;
    context.moveTo(currcoord[0], currcoord[1]);
    currcoord[1] += edgeSize; // front topleft to botleft
    context.lineTo(currcoord[0], currcoord[1]);
    currcoord[0] += edgeSize; // front botleft to botright
    context.lineTo(currcoord[0], currcoord[1]);
    currcoord[1] -= edgeSize; // front botright to topright
    context.lineTo(currcoord[0], currcoord[1]);
    currcoord[0] -= edgeSize; // front topright to topleft
    context.lineTo(currcoord[0], currcoord[1]);
    // draw top
    currcoord[0] += edgeSize * scaleFactor * Math.cos(Math.PI / 6); // front topleft to top topleft
    currcoord[1] -= edgeSize * scaleFactor * Math.sin(Math.PI / 6); // front topleft to top topleft
    context.lineTo(currcoord[0], currcoord[1]);
    currcoord[0] += edgeSize; // top topleft to topright
    context.lineTo(currcoord[0], currcoord[1]);
    currcoord[0] -= edgeSize * scaleFactor * Math.cos(Math.PI / 6); // top topright to front topright
    currcoord[1] += edgeSize * scaleFactor * Math.sin(Math.PI / 6); // top topright to front topright
    context.lineTo(currcoord[0], currcoord[1]);
    //draw right
    currcoord[0] += edgeSize * scaleFactor * Math.cos(Math.PI / 6); // top topright to right botright
    currcoord[1] -= edgeSize * scaleFactor * Math.sin(Math.PI / 6); // top topright to right botright
    context.moveTo(currcoord[0], currcoord[1]);
    currcoord[1] += edgeSize;
    context.lineTo(currcoord[0], currcoord[1]);
    currcoord[0] -= edgeSize * scaleFactor * Math.cos(Math.PI / 6); // right botright to front botright
    currcoord[1] += edgeSize * scaleFactor * Math.sin(Math.PI / 6); // right botright to front botright
    context.lineTo(currcoord[0], currcoord[1]);
    context.stroke();
    context.closePath();
    context.beginPath();
    // draw hidden lines
    context.setLineDash([5, 3]);
    currcoord[0] -= edgeSize;
    context.moveTo(currcoord[0], currcoord[1]);
    currcoord[0] += edgeSize * scaleFactor * Math.cos(Math.PI / 6); // front botleft to hidden intersect
    currcoord[1] -= edgeSize * scaleFactor * Math.sin(Math.PI / 6); // front botleft to hidden intersect
    context.lineTo(currcoord[0], currcoord[1]);
    currcoord[1] -= edgeSize; // hidden intersect to top topleft
    context.lineTo(currcoord[0], currcoord[1]);
    currcoord[1] += edgeSize;
    context.moveTo(currcoord[0], currcoord[1]);
    currcoord[0] += edgeSize; // hidden intersect to right botright
    context.lineTo(currcoord[0], currcoord[1]);
    context.stroke();
    context.closePath();

    if(counter < 100) {
        counter++;
    }
    else {
        counter = 0;
    }
}
