bpms
====

BPMS (Business Process Management System) includes a webbase process designer based on BPMN, generation of XPDL, ability to define roles and and associated calendar, business process data, engine and analytics.

BPMN defines events, activities, gateways, flows, data, artifacts and swimlanes. The actions possible 

BPMN actions are object sensitive: 
Create element
Delete element
Move element
Resize element
Group element
Connect element
Change element subtype


An activity includes a set of data inputs, the degenerate case involves a single input boolean value that indicates if the activity has been compleated. Inputs are used in conditioning gateways and flows. Where gateways and flows determine define the business process transition logic. 
Each activity requires one or more resources (human and non human) to be completed, completion is reached when all the required inputs have been specified.

Attachments to process or activity

Resources

Create SVG symbols associated to each BPMN element

Raphael.js (move + resize) http://jsfiddle.net/tmkfs/ http://jsfiddle.net/vPyjc/

Reading:
http://www.wikihow.com/Write-a-Business-Process-Document

http://www.bpmnquickguide.com/viewit.html