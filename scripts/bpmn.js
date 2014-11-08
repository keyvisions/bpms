var diagram, selection, selector;
var symbols = {
    event: {
        title: "Event",
        set: [{
            path: "M-25,0a25,25 0 1,0 50,0a25,25 0 1,0 -50,0"
        }, {
            text: "*",
            attr: {
                "font-size": "25px"
            }
        }]
    },
    activity: {
        title: "Activity",
        set: [{
            path: "M-65,-40h130a10,10 0 0 1 10,10v80a-10,10 0 0 1 -10,10h-130a-10,-10 0 0 1 -10,-10v-80a10,-10 0 0 1 10,-10Z"
        }]
    },
    gateway: {
        title: "Gateway",
        set: [{
            path: "M0,-30l30,30l-30,30l-30,-30Z"
        }]
    },
    flow: {
        title: "Flow",
        set: [{
            path: "M0,0l200,0l0,-5l10,5l-10,5l0,-5",
            attr: {
                fill: "#000000"
            }
        }]
    },
    data: {
        title: "Data",
        set: [{
            path: "M10,-30l15,15v45h-50v-60h35v15h15"
        }]
    },
    artifact: {
        title: "Artifact",
        set: [{
            path: "M20,-50h-20v100h20"
        }, {
            text: "Text Annotation"
        }]
    },
    swimlane: {
        title: "Swimlane",
        container: true,
        set: [{
            path: "M0,-75h400v150h-400v-150Z"
        }, {
            text: "Lane",
            attr: {
                contenteditable: true
            },
            transform: "t10,0r-90"
        }]
    }
    //    mail: { title: "Mail", set: [{ path: "M20,-15l-20,15l-20,-15l40,0l0,30l-40,0l0,-30" }] }
};

function init() {
    //loadSecurity();

    diagram = Raphael(0, 0, "100%", "100%");
    selection = diagram.set();
    selector = diagram.rect(0, 0, 0, 0);
    selector.active = false;
    selector.node.classList.add("selector");
    
    createBPMNMenu();
    diagram.canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        var menu = document.getElementById("bpmnmenu");
        menu.style.display = "block";
        menu.style.left = e.clientX + "px";
        menu.style.top = e.clientY + "px";
        ["cmd-cut", "cmd-copy", "cmd-del"].forEach(function (id) {
            document.getElementById(id).classList[selection.length === 0 ? "add" : "remove"]("disabled");
        });
        return false;
    }, false);
    
    document.addEventListener("mousedown", function(event) {
        document.getElementById("bpmnmenu").style.display = "none";
        if (event.which === 1 && event.target.localName === "svg") {
            if (!event.ctrlKey)
                clearSelection();
            selector.x = event.pageX, selector.y = event.pageY;
            selector.attr({x: selector.x, y: selector.y});
            selector.active = true;
        }
    });
    document.addEventListener("mousemove", function(event) {
        if (event.which === 1 && selector.active) {
            if (event.pageX < selector.x) selector.attr({x: event.pageX});
            if (event.pageY < selector.y) selector.attr({y: event.pageY});
            selector.attr({width: Math.abs(event.pageX - selector.x), height: Math.abs(event.pageY - selector.y)});
        }    
    });
    document.addEventListener("mouseup", function(event) {
        selector.attr({width: 0, height: 0});
        selector.active = false;   
    });
    
}

function createBPMNMenu() {
    var ul = document.getElementById("symbols");
    for (var symbol in symbols) {
        var li = document.createElement("li");
        li.setAttribute("data-type", symbol);
        li.appendChild(document.createTextNode(symbols[symbol].title));
        ul.appendChild(li);
    }
    ul.addEventListener("mousedown", function(event) {
        createSymbol(event.target.getAttribute("data-type"), event);
    });
}

function createSymbol(symbol, event) {
    if (symbol) {
        diagram.setStart();
        for (var i in symbols[symbol].set) {
            var subset = symbols[symbol].set[i];
            if (subset.path) diagram.path(subset.path).attr(subset.attr || { fill: '#FFFFFF' }).transform(subset.transform || "");
            else if (subset.text) diagram.text(subset.x || 0, subset.y || 0, subset.text).attr(subset.attr || {}).transform(subset.transform || "");
        }
        var set = diagram.setFinish();
        set.transform("...T" + [event.pageX, event.pageY]);
        set.forEach(function(subset) {
            subset.set = set;
        });
        if (symbols[symbol].container) { // Handle Raphael set.toBack() BUG
            var l = [];
            set.forEach(function(e) {
                l.push(e);
            });
            for (var e = l.pop(); e; e.toBack(), e = l.pop());
        }
        set.mouseover(function() {
            this.set.forEach(function(e) {
                e.node.classList.add("hovered");
            });
        });
        set.mouseout(function() {
            this.set.forEach(function(e) {
                e.node.classList.remove("hovered");
            });
        });
        set.drag(dragSymbol, dragSymbolStart, dragSymbolFinish);
        dragSymbolStart(event.pageX, event.pageY, event, set);
    }
}

function clearSelection() {
    selection.clear();
    var l = diagram.canvas.getElementsByClassName("selected");
    while (l.length > 0) {
        l[0].classList.remove("selected");
    }
}

function dragSymbol(dx, dy) {
    selection.transform("...T" + [dx - selection.dx, dy - selection.dy]);
    selection.dx = dx, selection.dy = dy;
    selection.toggle = false;
}
function dragSymbolStart(x, y, event, set) {
    var l;
    if (!event.ctrlKey) {
        l = diagram.canvas.getElementsByClassName("selected");
        while (l.length > 0) {
            l[0].classList.remove("selected");
        }
        selection.toggle = false;
    } else selection.toggle = this.node.classList.contains("selected");
    (set || this.set).forEach(function(e) {
        e.node.classList.add("selected");
    });
    selection.clear();
    l = diagram.canvas.getElementsByClassName("selected");
    for (var i = 0; i < l.length; ++i) {
        selection.push(diagram.getById(l[i].raphaelid));
    }
    selection.dx = 0, selection.dy = 0;
}
function dragSymbolFinish() {
    if (selection.toggle) {
        this.set.forEach(function(e) {
            selection.exclude(e);
            e.node.classList.remove("selected");
        });
    }
}
/*
var roles = [{
    name: "guests",
    guid: "",
    title: "Guest role"
}, {
    name: "manager",
    guid: "",
    title: "Manager"
}, {
    name: "bpmanager",
    guid: "",
    title: "Business process manager"
}];
var users = [{
    name: "guest",
    hash: "",
    password: "",
    roles: {}
}, {
    name: "admin",
    hash: "",
    password: "",
    roles: {}
}];

function loadSecurity() {
    var roles = document.getElementById("roles");
    for (var i in roles) {
        var li = document.createElement("li");
        li.setAttribute("data-guid", roles[i].guid);
        li.appendChild(document.createTextNode(roles[i].title));
        roles.appendChild(li);
    }
    roles.addEventListener("click", function(event) {});
}
*/

function log(txt) {
    document.getElementById("properties").innerHTML = txt;
}