// -------- U T I L S -------- //

//A Posn is an (x, y) coordinate
class Posn {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	//returns a list of the posns adjacent to this,
	//[top, right, bottom, left]
	getAdjacentPosns() {
		return [new Posn(this.x, this.y + 1), new Posn(this.x + 1, this.y), new Posn(this.x, this.y - 1), new Posn(this.x - 1, this.y)];
	}

	//returns the pixel position of the top left corner of the square referred to by this posn
	toCanvasPosn(world) {
		return new Posn(this.x * squareWidth(world), (world.height - (this.y + 1)) * squareHeight(world))
	}
}

// -------- C O N S T A N T S -------- //

var HEX_LETTERS = '0123456789ABCDEF';

// -------- G E N E R A L   H E L P E R S --------- //

function squareWidth(world) {
	return canvas.width / world.width;
}

function squareHeight(world) {
	return canvas.height / world.height;
}

/*function drawBorder() {
	ctx.rect(0, 0, canvas.width, canvas.height)
	ctx.stroke();
}*/

function emptyBoard(width, height) {
	return new Array(width).fill(null).map(function() {
		return new Array(height).fill(null).map(function(square) {
			return new Square(0, 0, undefined);
		})
	})
}


function setIntervalX(callback, delay, repetitions, endCallback) {
    var x = 0;
    var intervalID = window.setInterval(function () {

       callback();

       if (++x === repetitions) {
           window.clearInterval(intervalID);
           endCallback()
       }
    }, delay);
}

//TODO make it so the generated color is unique
function getRandomColor() {
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += HEX_LETTERS[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getSimilarColor(hexcode) {
	//pick 2 digits of the hex code
	//either add 1 to them or subtract 1 from them
	var digitIdx = Math.floor((Math.random() * (hexcode.length-2)) + 2)
	var newLetter = HEX_LETTERS[Math.floor(Math.random() * 16)];
	return hexcode.slice(0, digitIdx) + newLetter + hexcode.slice(digitIdx+1, hexcode.length);
}

//returns the color of a set of genes by mixing their actions' colors together
//(Uses this git repo for substractive color mixing: https://github.com/AndreasSoiron/Color_mixer) 
function genomeToColor(genes) {
	//for every gene, add its action's color to a list, then mix all those colors together
	var geneColors = []
	genes.forEach(function(gene) {
		var actionName = gene.behavior.actionName;
		geneColors.push($.Color(ACTION_SPEC[actionName].color))
	})
	return Color_mixer.mix(geneColors).toHexString();
}

function choose(choices) {
	if (choices.length <= 0) {
		return console.log("ERROR: You can't choose something from an empty array")
	}
  	var index = Math.floor(Math.random() * choices.length);
  	return choices[index];
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}