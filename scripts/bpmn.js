"use strict";
var ns_svg = "http://www.w3.org/2000/svg";
var ns_xlink = "http://www.w3.org/1999/xlink";
var diagram, selection, touched, selector;

function init() {
    if (!Element.setAttributes) {
        Element.prototype.setAttributes = function(attrs) {
            for (var idx in attrs) {
                if (idx === 'style' && typeof attrs[idx] === 'object') {
                    for (var prop in attrs[idx]) {
                        this.style[prop] = attrs[idx][prop];
                    }
                } else {
                    this.setAttribute(idx, attrs[idx]);
                }
            }
        };
    }
    diagram = document.getElementById("diagram");
    diagram.symbols = diagram.getElementsByClassName("symbol");
    selector = diagram.getElementById("selector");
    selection = diagram.getElementsByClassName("selected");
    touched = diagram.getElementsByClassName("touched");

    // BPMN context menu
    var ul = document.getElementById("mnu_symbols");
    [].forEach.call(diagram.getElementsByClassName("mod_symbol"), function(el) {
        var li = document.createElement("li");
        li.id = "cmd_" + el.getAttribute("id");
        li.appendChild(document.createTextNode(el.getAttribute("title")));
        ul.appendChild(li);
    });
    diagram.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        var menu = document.getElementById("mnu_bpmn");
        menu.style.display = "block";
        menu.style.left = e.clientX + "px";
        menu.style.top = e.clientY + "px";
        ["cmd_cut", "cmd_copy", "cmd_del", "cmd_prop"].forEach(function(id) {
            document.getElementById(id).classList[selection.length === 0 ? "add" : "remove"]("disabled");
        });
        return false;
    }, false);
    document.getElementById("mnu_bpmn").addEventListener("mousedown", function(e) {
        document.getElementById("mnu_bpmn").style.display = "none";
        switch (e.target.id) {
            case "cmd_cut":
            case "cmd_copy":
            case "cmd_paste":
            case "cmd_del":
                while (selection.length > 0) selection[0].parentNode.removeChild(selection[0]);
                break;
            case "cmd_prop":
                break;
            default:
                createSymbol(e.target.id.substr(4), e);
        }
    });

    function createSymbol(symbol, e) {
        // <use class="symbol" xlink:href="#event" x="50" y="25" />
        var obj = document.createElementNS(ns_svg, "use");
        obj.setAttributeNS(ns_xlink, "href", "#" + symbol);
        obj.setAttributes({ x: e.clientX, y: e.clientY });
        obj.classList.add("symbol");
        diagram.appendChild(obj);
    }
    
    // Handle BP diagram
    diagram.addEventListener("dragstart", preventEvent, false);
    diagram.addEventListener("dragenter", preventEvent, false);
    diagram.addEventListener("dragover", preventEvent, false);
    diagram.addEventListener("dragleave", preventEvent, false);
    diagram.addEventListener("dragend", preventEvent, false);
    diagram.addEventListener("drop", preventEvent, false);
    function preventEvent(e) {
        e.preventDefault();
    }
    
    diagram.addEventListener("mousedown", function(e) {
        document.getElementById("mnu_bpmn").style.display = "none";
        var obj = getSymbol(e.target);
        if (e.which === 1) {
            selector.track = true;
            if (!e.ctrlKey) {
                clearSelection();
                if (obj) { 
                    obj.classList.add("selected");
                    selector.track = false;
                }
            } else if (obj) {
                obj.classList.toggle("selected");
                selector.track = false;
            }
            
            selector.xo = e.clientX - diagram.style.left, selector.yo = e.clientY - diagram.style.top;
            selector.setAttributes({ x: selector.xo, y: selector.yo, width: 0, height: 0 });
            selector.drag = false;
        }
    });
    diagram.addEventListener("mousemove", function(e) {
        if (e.buttons & 1 === 1) {
            e.preventDefault();
            var x = e.clientX, y = e.clientY;

            // Always select the symbol under the mouse
            var obj = getSymbol(e.target);
            if (obj && selector.drag === false) obj.classList.add("selected");
            
            // Track selector
            if (selector.track) {
                selector.setAttributes({
                    x: x < selector.xo ? x : selector.xo, y: y < selector.yo ? y : selector.yo,
                    width: Math.abs(x - selector.xo), height: Math.abs(y - selector.yo)
                });
            
                // Touch symbols included in selector
                var sbox = selector.getBoundingClientRect();
                [].forEach.call(diagram.symbols, function(el) {
                    el.classList[overlap(sbox, el.getBoundingClientRect()) ? "add" : "remove"]("touched");
                });
            } else { 
                // Move selected symbols
                var dx = x - selector.xo, dy = y - selector.yo;
                [].forEach.call(selection, function(el) {
                    el.setAttribute("transform", "translate(" + ((el.xo || 0) + dx) + " " + ((el.yo || 0) + dy) + ")");
                });
            }
            selector.drag = true;
        }
    });
    diagram.addEventListener("mouseup", function(e) {
        if (e.which === 1) {
            cleanUpEvent();
            while (touched.length > 0) {
                touched[0].classList.add("selected");
                touched[0].classList.remove("touched");
            }
            [].forEach.call(selection, function(el) {
                var matrix = el.getTransformToElement(diagram);
                el.xo = matrix.e, el.yo = matrix.f;
            });
        }
    });

    function cleanUpEvent() {
        selector.track = false;
        selector.drag = false;
        selector.setAttributes({x: 0, y: 0, width: 0, height: 0});
    }
    function overlap(rect1, rect2) {
        return rect2.right >= rect1.left && rect2.left <= rect1.right && rect2.bottom >= rect1.top && rect2.top <= rect1.bottom;
    }
    function clearSelection() {
        while (selection.length > 0) selection[0].classList.remove("selected");
    }
    function getSymbol(obj) {
        for (; obj !== diagram && !obj.classList.contains("symbol"); obj = obj.parentNode);
        return (obj === diagram) ? null : obj;
    }
}