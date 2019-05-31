from shapely.geometry import LineString
import json

#This code used an earlier file of the data which was in the same long form as the provided data (FerroSeqData_Long.tsv) but did not have the CharError, TargetArea and ProductionArea columns. This adds those values from the JSON file chareares.json. 
allrows=[]
charCoords=[]
headerKeys=["Participant","Indentifier","Condition","Chain","Generation","Trial","SequenceTrace","SequencePosition","TargetCharacter","ProducedCharacer","T.x","T.y","P.x","P.y","CharRT"]

with open("charares.json","r") as infile:
	charCoords=json.load(infile)

with open("FerroSeqData_Long.tsv","r") as infile:
	for line in infile:
		x=line.rstrip().split('\t')
		row={}
		for i in range(len(headerKeys)):
			row[headerKeys[i]]=x[i]
		allrows.append(row)


def findMinIntersectionDistance(productionPoint, targetPoint, polygonPoints):
	#find if a line between the production and target intersects
	#if it does, find the point of intersection
	#store that point in an array
	#calculate the distance between production point and intersection points
	#take the minimum
	targetProductionLine=LineString([(productionPoint[0],productionPoint[1]),(targetPoint[0],targetPoint[1])])
	intersectionDistances=[]
	#print("There are ",len(polygonPoints), " lines..")
	for i in range(0, len(polygonPoints)):
		#at last element compare with first
		if i==(len(polygonPoints)-1):
			thisLine = LineString([(polygonPoints[i][0],polygonPoints[i][1]),(polygonPoints[0][0],polygonPoints[0][1])])
		else:
			thisLine = LineString([(polygonPoints[i][0],polygonPoints[i][1]),(polygonPoints[i+1][0],polygonPoints[i+1][1])])
		
		isIntersecting = thisLine.intersection(targetProductionLine)

		if isIntersecting:
			#print("Found intersection!")
			intersectionDistances.append(thisLine.length)
	#print(intersectionDistances)
	return min(intersectionDistances)

def getDist(T, P, px,py):
	if T==P:
		return 0
	else:
		targetCoordinates = [charCoords[T]["x"],charCoords[T]["y"]]
		polyPoints = charCoords[T]["lines"]
		productionCoordinates=[px,py]
		return findMinIntersectionDistance(productionCoordinates,targetCoordinates,polyPoints)

def addData():
	for r in allrows:
		if r["Participant"]=="Participant":
			r["CharError"] = "CharError"
			r["TargetArea"] = "TargetArea"
			r["ProductionArea"] = "ProductionArea"
		else:
			r["CharError"] = getDist(r["T1"],r["P1"],r["P1.x"],r["P1.y"])
			r["TargetArea"] = charCoords[r["TargetCharacter"]]["area"]
			r["ProductionArea"] =charCoords[r["ProducedCharacter"]]["area"]
	#write allrows to desired file format here

	
#longData()