var ferros,vals,cnv,coords, coordDict, charDict,fDial,otherfont;
var trialStart,charStart,charTarget;

var currentTarget = "xb3";
var showFeedback=false;
var dispFeedback=false;
var giveHints=false;
var fadeSequence=false;
var producedCoordinates = [];
var cnv;
var thechars="1234567890=qwertyuiopasdfghjkl;zxcvbnmQWERTYUIOPXCVBNM<DFGHJK"
thechars=thechars.split("")

function preload() {
	//load the fonts and the node contour values from the Ferro font. 
	//note the the Ferro font is not freely available, so a free font, from 
	// is used here instead. You can contact the researcher if you wish to have the Ferro font.
	ferros=loadFont("../static/assets/bk1.otf");
	otherfont=loadFont("../static/assets/Roboto.ttf");
	vals=loadJSON("../static/assets/ordinalFerros.json");
	
}

function setup() {
	//create the p5js canvas and attach it to the html
	cnv = createCanvas(500,400);
	cnv.parent("paletteContainer");
	//define the radius of the hint circle
	hintCircleR=180;

	//list/dictionaries which have the coordinates of each Ferro's centroid
	//and a dictionary that does the reverse (locates the character and centroid from the coordinates)
	coords=[];
	coordDict = {};
	charDict = {};
	
	for (var key in vals) {
		var nodeRank=vals[key]["nodeRank"];
		var contRank=vals[key]["contRank"];
		var loc=createVector(nodeRank,contRank);
		coords.push(loc);
		coordDict[nodeRank.toString()+","+contRank.toString()] = key;
		charDict[key]=loc;
	}
	//create the palette itself
  	fDial=new FerroDial(20,20,360);
}

///standard p5js draw loop
function draw() {
	background(255);
	noFill();
	//draw boundaries around palette
	stroke(0,102,204);
	rect(20,20,360,360);
	noStroke();
	smooth();

	//check if the mouse is inside the palette, if so, change ferro based on coordinates
	if (fDial.isInside()) {
		fDial.changeVal();
	}
	if (giveHints) {
		showHint();
	}
	//display the large ferro in the centre of the palette
	makeFerro(fDial.val.x,fDial.val.y);

	//draw the small green circle which shows users position inside the palette
	fDial.showPosition();
	if (showFeedback && dispFeedback) {
		fill(100,100,214);	
		textFont(otherfont);
		textSize(30);
		fill(225,100,25);
		showSeqs();
	}

}

//ferro dial class with various functions
function FerroDial(startX,startY,sz) {
	this.val=createVector(68.5,68.5);
	this.leftX=startX;
	this.rightX=startX+sz;
	this.topY=startY;
	this.bottomY=startY+sz;
	this.cPos=createVector(startX+sz/2,startY+sz/2);
	
	this.isInside=function() {
		if (mouseX<this.rightX && mouseX>this.leftX && mouseY<this.bottomY && mouseY>this.topY) {
			return true;
		} else {
			return false
		}
	}
		
	this.showPosition = function() {
		ellipseMode(CENTER);
		fill(135,230,90,190);
		noStroke();
		ellipse(this.cPos.x,this.cPos.y,10,10);
	}

	this.changeVal = function() {
		this.cPos.x=mouseX;
		this.cPos.y=mouseY;
		var propX=(mouseX-this.leftX)/sz;
		var propY=(mouseY-this.topY)/sz;
		this.val.x=propX*137;
		this.val.y=propY*137;
	}

	this.reset = function() {
		this.cPos.x=startX+sz/2;
		this.cPos.y=startY+sz/2;
		this.val.x=68.5;
		this.val.y=68.5;
	}
}

//write ferro when mouse is pressed
//note mousePressed() is a built in p5js function
function mousePressed() {
	if (fDial.isInside() && showFeedback==false) {
		//producedCoordinates.push([mouseX-20,mouseY-20])
		enterFerro("#output");
		var producedSequence=$("#output").text()
		if (producedSequence.length===3) {
			disablePalette=true;
			$("#submitSeq").addClass("btn-info").removeClass("btn-light")
			submitButtonActive=true;

			
		} else if (producedSequence.length<3) {
			disablePalette=false;
			$("#submitSeq").addClass("btn-light").removeClass("btn-info")
			submitButtonActive=false;
		}

	}
}

//show target and produced sequences is feedback is being displayed
function showSeqs() {

	var outputSequence = $("#output").text()
	var inputSequence = currentTarget;
	for (var c=0; c<3;c++) {
		var locT = charDict[inputSequence.charAt(c)];

		if (inputSequence.charAt(c)===outputSequence.charAt(c)) {
			//green
			fill(21,130,10);
			
			text(c+1,paletteScale(locT.x)+20,20+paletteScale(locT.y)-5);
			ellipse(paletteScale(locT.x)+20,20+paletteScale(locT.y),5,5)

			text(c+1,20+producedCoordinates[c][0],20+producedCoordinates[c][1]-5);
			ellipse(20+producedCoordinates[c][0],20+producedCoordinates[c][1],5,5);
			

		} else {
			//orange
			fill(225,100,25);
			text(c+1,paletteScale(locT.x)+20,20+paletteScale(locT.y)-5);
			ellipse(paletteScale(locT.x)+20,20+paletteScale(locT.y),5,5)
			//blue
			fill(100,100,214);
			text(c+1,20+producedCoordinates[c][0],20+producedCoordinates[c][1]-5);
			ellipse(20+producedCoordinates[c][0],20+producedCoordinates[c][1],5,5);

		}
	}
}

//show hints if option is selected
function showHint() {
	ellipseMode(CENTER);
	fill(255,150,50,150);
	noStroke();
	var tar = charDict[charTarget];
	if (tar) {
		ellipse(20+paletteScale(tar.x),20+paletteScale(tar.y),hintCircleR,hintCircleR);
		if (hintCircleR>10 && frameCount%30==0) {
			hintCircleR=hintCircleR-1;
		}
	}

}

//scale a value to the palette dimensions
function paletteScale(val) {
	//convert from number between 0-137 to number between 0-360;
	return (360*val)/137;
}
//generic function to shuffle an array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//make a ferro based on x,y coordinates (i.e., which polygon do these coordinates fall into)
function makeFerro(px,py) {
	console.log("making ferro",px,py)
	var minDist=400;
	var charKey;
	for (var i=0;i<coords.length; i++) {
    	if (dist(px,py, coords[i].x,coords[i].y)<minDist) {
      		minDist=dist(px,py, coords[i].x,coords[i].y);
      		charKey=coords[i].x.toString()+","+coords[i].y.toString();
    	}
  	}
  	if (showFeedback) {
  		fill(130);
  	} else {
		fill(0);
	}
	textFont(ferros);
	textAlign(CENTER);
	textSize(200);
	text(coordDict[charKey],190,280);
	textFont(otherfont)
	//textSize(15)
	//text(coordDict[charKey],100,100);
	//text("Center: "+charKey,100,150);
	//console.log(charKey);

	return coordDict[charKey];
}

//send a ferro to the sequence in the field
function enterFerro(displayNode) {
	var curval=$(displayNode).text();
	var newchar=makeFerro(fDial.val.x,fDial.val.y);
	var newval=curval+newchar
	producedCoordinates.push([mouseX-20,mouseY-20,newchar])
	$(displayNode).text(newval);
	hintCircleR=180;
	charTarget=currentTarget[curval.length+1];
	
}

//delete a ferro from the field
function deleteFerro(displayNode) {
	var curval=$(displayNode).text();
	var newval=curval.substring(0,curval.length-1);
	producedCoordinates.pop()
	$(displayNode).text(newval);
	hintCircleR=180;
	charTarget=currentTarget[curval.length+1];
	var charRT=Date.now()-charStart;
	charStart=Date.now()
}


//check a sequence against the target and score it
function checkSequence(sequence) {
	var score;
	if (sequence===currentTarget) {
		score=100;
	} else {
		var scores=[];
		var iCoordinates=[]
		for (var i=0;i<currentTarget.length;i++) {
			var t=charDict[currentTarget.charAt(i)];
			iCoordinates.push([paletteScale(t.x),paletteScale(t.y)]);
		}
		for (var c=0;c<3;c++) {
			if (sequence[c]==currentTarget[c]) {
				scores.push(1)
			} else {
				var tx=iCoordinates[c][0]
				var ty=iCoordinates[c][1]
				var rx=producedCoordinates[c][0]
				var ry=producedCoordinates[c][0]
				var maxDist=Math.max(dist(tx,ty,20,20),dist(tx,ty,360,360),dist(tx,ty,20,360),dist(tx,ty,360,20));
				var d=dist(tx,ty,rx,ry);
				scores.push(d/maxDist);
			}
		}
		var tscore=0;
		for (var s=0;s<scores.length;s++) {
			tscore += scores[s];
		}
		score=100-Math.round((tscore/3)*100);
	}

	if (dispFeedback) {
		$("#accValue").text(score.toString());
		$(".percentAccuracy").show()
		if (sequence===currentTarget) {
			$(".perfectSeq").show();
		} else {
			$(".wrongSeq").show();
		}
	}
}

//jquery functions for buttons etc
$(document).ready(function() {
	$("#startModal").modal('show')
	$('body').keydown(function(event) {
		if (event.keyCode===46 || event.keyCode===8) {
			event.preventDefault();
			deleteFerro("#output");
			var theseq=$("#output").text()
			if (theseq.length<3) {
				$("#submitSeq").addClass("btn-light").removeClass("btn-info")
				disablePalette=false

			}
		}
		if (event.keyCode===13) {
			$("#submitSeq").click()
		}
	});

	$("#submitSeq").click(function() {
		var producedSequence=$("#output").text()
		if (producedSequence.length<3) {
			//submitButtonActive=false;
		} else {
			showFeedback=true
			checkSequence(producedSequence);
			$("#ferroCursor").hide();
			$("#targetSeq").stop();
			$("#targetSeq").fadeTo(0,1);
			$("#copyPrompt").text("Click next to continue.");
			$(this).hide()
			$(this).addClass('btn-light').removeClass('btn-info')
			$("#newSeq").show()
		}
		

	});

	$("#newSeq").click(function() {
		$("#ferroCursor").show();
		$("#feedbackDisplay").hide();
		showFeedback=false
		thechars=shuffle(thechars)
		currentTarget=thechars[0]+thechars[1]+thechars[2]
		$("#output").text("")
		$("#targetSeq").text(currentTarget);
		$(this).hide()
		$("#submitSeq").show()
		if (fadeSequence) {
			$("#targetSeq").fadeTo(8000,0,function() {
				//do something when fade is complete
			});
		}

	});

	$("#doFade").click(function() {
		fadeSequence=!fadeSequence
	});

	$("#showFeedback").click(function() {
		dispFeedback=!dispFeedback
	});

	$("#showHints").click(function() {
		giveHints=!giveHints
	});

	$("#showInfo").click(function() {
		$("#startModal").modal('show')
	})
})