# AlienForms
Code for Cuskley (2019), Alien Forms for Alien Language

The code released contains two folders. 

## Data_Analysis

- AlienFormsAnalysis.Rmd: an RMarkdown document which gives a more detailed explanation of the data file, and goes through the models used for the analysis, including R code
- calcEdgeDistances.py: This file shows how the CharError values were calculated, by determining the Euclidean distance from the nearest edge of the target polygon. Note that it is advisable to use Python3 for this for character encoding reasons (many of the unicode characters produced by participants run into issues in Python 2)
- charares.json: This is a json file with information about each Ferro Character, required for the calcEdgeDistances.py
- FerroSeqData_Long.tsv: data from the experiment in long form (i.e., each line is one *character* produced by a participant, even thought there were three characters per sequence (and 12 sequences per participant). Note that this file is tab separated; participants could use the ',' character as part of the experiment.

## PaletteCode

This folder contains HTML, JavaScript, and CSS for the palette at the centre of the task. It is set up to be deployed directly to Heroku - for further information, see here: https://devcenter.heroku.com/articles/getting-started-with-python. 

Note that this palette is not the full task, but only the 2D palette used to produce forms during the main part of the task. As such, this code doesn't include detail about storing and saving participant responses, but this was done with mLab and MongoDB (https://mlab.com) via FlaskSocketio (https://flask-socketio.readthedocs.io/en/latest/). For a demo version of the original task in full, see here: https://bit.ly/FerroSeqDemo

Also note that this palette does not use the Ferro forms used in the original task, but a different, freely available alien font (https://www.fontspace.com/fontepx/bk1). The font cannot be freely released, but can be purchased from the creator, Craig Ward. Should you wish to use the font for research purposes, contact the author of Cuskley (2019), who has permission to distribute the font free of charge for use in scholarly research.

While the palette displays a different font, the spatial arrangement is the same as described in Cuskley (2019), and based on the node/contour values of the Ferro font (i.e., not on visual properties of the b1k font).

