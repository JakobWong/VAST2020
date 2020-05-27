# Beeswarm chart for question 1

This interface uses interactive beeswarm chart to support visual analytics for question 1.

## Help youself adding data
The folder `MC2-Image-Data` is too huge to be added into this repo. Please copy and paste it to under `q1`

## How to interpret the chart

There are 43 different objects (or, 43 labels, 43 classes, you name it. Anyway, these words will be used interchangably in this readme doc). For each label, a beeswarm chart is drawn to show how well that class has been classified. Each dot in a beeswarm chart represents an image that contains the object being classified as the class that the beeswarm chart corresponds to. Such classification may or may not be correct. The dots are laid out horitonally according to their label and vertically according to their `Score`s, which quantify how confident the classifier is to the fact that the sample is of the class.

## What you need to do with this interface

Apparently the machine-leanring-based classifier is very very poor at detecting and classifying objects. So those misclassified results need to be corrected. And by contrasting the manually corrected results we can give answers to question 1, 2 and 3. This interface comes to help in the "manuanlly correcting" process.

## How to use

1. Left click a dot to display the related image and check if it is correctly classified.

2. Right click a dot to tag the status of classification as "correctly classified" or "misclassified". Once being tagged as "correctly classified", a dot is outlined green. Contrast to that being tagged as "misclassified" outlines the dot red

3. For relabeling misclassified data, hit the `Show Incorrect Data Only` button which makes incorrectly labeled data samples the only visible ones. In this mode, Left Click a dot to see the related image. Right click to select the correct label you think the object in the image should be classified as.

4. Hit `Download New Result` to save the progress you've made so far. It will download a file named `new_data.json` to your local directories. Next time you run this interface, copy and paste `new_data.json` to under the folder `q1`and change the variable `json_path` of `index.js` to `new_data.json`. This will initialize the graph based on `new_data.json`, i.e. you start from the saved break point.