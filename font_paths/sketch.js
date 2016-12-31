var font;

var vpaths = [];
var vehicles = [];
var debug = false;

// A path object (series of connected points)
function preload() {
  font = loadFont('OpenSans-Regular.ttf');
}

function debugIt() {
  debug = !debug;
}

function setup() {
  createCanvas(1200, 600);
  createButton('toggle paths').mousePressed(debugIt);
  var options = {
    sampleFactor: 0.01,
  };
  var fsize = 512;
  var txt = '2017';
  var w = font._textWidth('2017', fsize);
  var h = font._textAscent(fsize) - font._textDescent(fsize);
  var x = width / 2 - w / 2;
  var y = height / 2 + h / 2;
  var points = font.textToPoints(txt, x, y, fsize, options);
  stroke(255);

  var glyphs = font._getGlyphs(txt);
  var xoff = 0;
  for (var i = 0; i < glyphs.length; i++) {
    var gpath = glyphs[i].getPath(x, y, fsize);
    var paths = splitPaths(gpath.commands);
    for (var j = 0; j < paths.length; j++) {
      var pts = pathToPoints(paths[j], options);
      var vpath = new Path();
      for (var k = 0; k < pts.length; k++) {
        pts[k].x += xoff;
        vpath.addPoint(pts[k].x, pts[k].y);
      }
      vpaths.push(vpath);
    }
    xoff += glyphs[i].advanceWidth * font._scale(fsize);
  }


}

function draw() {

  if (vehicles.length < 500) {
    newVehicle(random(width), random(height));
  }

  background(0);
  // Display the path
  if (debug) {
    for (var i = 0; i < vpaths.length; i++) {
      vpaths[i].display();
    }
  }

  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    // Path following and separation are worked on in this function
    v.applyBehaviors();
    // Call the generic run method (update, borders, display, etc.)
    v.run();
  }

}

function newVehicle(x, y) {
  var maxspeed = random(2, 4);
  var maxforce = 0.3;
  var whichP = random(vpaths);
  var start = random(whichP.points);
  vehicles.push(new Vehicle(start.x, start.y, maxspeed, maxforce, whichP));
}
