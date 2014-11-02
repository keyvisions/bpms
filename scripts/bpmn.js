var diagram = null;
var selectedPath = null;
var bpmn = {
    event: { title: "Event", set: [{ path: "M-25,0a25,25 0 1,0 50,0a25,25 0 1,0 -50,0" }] },
    action: { title: "Action", set: [{ path: "M-75,-50l150,0l0,100l-150,0Z" }] },
    gateway: { title: "Gateway", set: [{ path: "M0,-25l25,25l-25,25l-25,-25Z" }] },
    lane: { title: "Lane", set: [{ path: "M0,-75l400,0l0,150l-400,0l0,-150m30,0l0,150" }, { text: "Lane", transform: "t10,0r90" }] },
    pool: { title: "Pool", set: [{ path: "M0,-75l400,0l0,150l-400,0l0,-150m24,0l0,150" }, { path: "M0,-25l25,25l-25,25l-25,-25Z" }] },
    textAnnotation: { title: "Text Annotation", set: [{ path: "M20,-50l-20,0l0,100l20,0" }, { text: "Annotation" }] },
    flow: { title: "Flow", set: [{ path: "M0,0l200,0l0,-5l10,5l-10,5l0,-5", style: { fill: "#000000" } }] },
    mail: { title: "Mail", set: [{ path: "M20,-15l-20,15l-20,-15l40,0l0,30l-40,0l0,-30" }] }
};

function init() {
    diagram = Raphael(0, 0, "100%", "100%");
    
    createBPMNMenu();

    diagram.canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        var menu = document.getElementById("bpmnmenu");
        menu.style.display = "block";
        menu.style.left = e.clientX + "px";
        menu.style.top = e.clientY + "px";
        return false;
    }, false);
    document.body.addEventListener("click", function (e) {
        document.getElementById("bpmnmenu").style.display = "none";
    });
}

function createBPMNMenu() {
    var ul = document.getElementById("symbols");
    for (var symbol in bpmn) {
        var li = document.createElement("li");
        li.setAttribute("data-type", symbol);
        li.appendChild(document.createTextNode(bpmn[symbol].title));
        ul.appendChild(li);
    }
    ul.addEventListener("click", function(e) {
        createSymbol(e.target.getAttribute("data-type"));
    });
}

function createSymbol(symbol) {
    if (symbol) {
        diagram.setStart();
        for (var i in bpmn[symbol].set) {
            var subset = bpmn[symbol].set[i];
            if (subset.path)
                diagram.path(subset.path).attr(subset.style || { fill: '#FFFFFF' }).transform(subset.transform || "");
            else if (subset.text)
                diagram.text(subset.x || 0, subset.y || 0, subset.text).transform(subset.transform || "");
        }
        var set = diagram.setFinish();
        set.forEach(function(subset) { subset.set = set; });
        set.drag(move, start, up);
    }
}

function start() {
    var set = this.set;
    set.dx = 0, set.dy = 0;
    set.animate({ "fill-opacity": 0.2 }, 500);
}
function move(dx, dy) {
    var set = this.set;
    set.transform("...T"+-set.dx+","+-set.dy);
    set.transform("...T"+dx+","+dy);
    set.dx = dx, set.dy = dy;
}
function up() {
    var set = this.set;
set.animate({ "fill-opacity": 1 }, 500);
}

function setPath(newPath) {
    if (selectedPath && newPath) selectedPath.attr("path", newPath);
}
