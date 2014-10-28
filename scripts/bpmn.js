var bpmn = {
    "NS": "http://www.w3.org/2000/svg",
    "SVG": null,
    "newElement": function(type) {
        if (this.hasOwnProperty(type)) {
            var e = document.createElementNS(this.NS, "use");
            e.setAttributeNS("xlink", "href", "#" + type);
            e.setAttribute("x", event.x);
            e.setAttribute("y", event.y);
            SVG.appendChild(e);
//            document.getElementById("bpmn").appendChild(this[type]("event1", "start"));
        } else
            throw("Element not implemented");
    },
    "event": function(name, subtype) {
        var bpmnElement = document.createElementNS(this.NS, "circle");
        bpmnElement.setAttribute("class", "bpmnElement bpmn" + subtype);
        bpmnElement.setAttribute("id", "myEvent");
        bpmnElement.setAttribute("cx", 100);
        bpmnElement.setAttribute("cy", 100);
        bpmnElement.setAttribute("r", 25);
        bpmnElement.addEventListener("click", function (e) { alert(e.currentTarget.id); });
        return bpmnElement;
    },
    "activity": function(name, subtype) {
        var bpmnElement = document.createElementNS(this.NS, "rect");
        bpmnElement.setAttribute("class", "bpmnElement bpmn" + subtype);
        bpmnElement.setAttribute("id", "myActivity");
        bpmnElement.setAttribute("x", 100);
        bpmnElement.setAttribute("y", 100);
        bpmnElement.setAttribute("width", 100);
        bpmnElement.setAttribute("height", 100);
        bpmnElement.setAttribute("rx", 5);
        bpmnElement.setAttribute("ry", 5);
        bpmnElement.addEventListener("click", function (e) { alert(e.currentTarget.id); });
        return bpmnElement;
    },
    "setup": function() {
        this.SVG = document.getElementById("bpmn");
    }
};
bpmn.setup();