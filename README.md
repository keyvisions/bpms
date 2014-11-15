keyvisions bpms
=

The components of the KeyVisions BPMS (Business Process Management System) project are: a web based BPMN process designer that includes semantics of business process data and roles, a BPMN to XPDL generator, an engine and analytics.

BPMN defines *events*, *activities*, *gateways*, *flows*, *data*, *artifacts* and *swimlanes*. The actions possible 

BPMN actions are object sensitive: 
 - Create element
 - Delete element
 - Move element
 - Resize element
 - Group element
 - Connect element
 - Change element subtype

An *activity* includes a set of *data* inputs, the degenerate case involves a single input boolean value that indicates if the activity has been compleated. Inputs are used in conditioning *gateways* and *flows*. Where gateways and flows determine define the business process transition logic. 
Each activity requires one or more resources (human and non human) to be completed, completion is reached when all required inputs have been specified.

Attachments to process or activity
---

Resources
---

BPMN Designer Behavior
=
The idea is to incorporate in the designer logic that aids the business process development.

 - Adding a swimlane to a swimlane creates a pool, or adds a swimlane to the underling pool. Dragging and dropping a swimlane on a swimlane has the same effect.
 - WYSIWYG behavior
 - Automatic alignment
 - Grid snapping



References
=
http://www.bpmn.org/
http://www.bpmnquickguide.com/viewit.html
http://www.xpdl.org/

http://www.wikihow.com/Write-a-Business-Process-Document

---

Technologies
=
This project is built on HTML, SVG, XML, CSS, javascript, node.js and JSON (versions available as of 11/09/2014). Raphael.js has been adopted to ease SVG development, however, while using it, its limitation have surfaced so probably it will be dropped in favor of bare DOM/SVG handling.

Create SVG symbols associated to each BPMN element


---
KeyVisions BPMS icon is a plain circle, it simply represents a process start event.