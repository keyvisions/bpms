var paper = null;
var selectedPath = null;
var bpmn = {
    "event": { name: "Event", set: ["M-25,0a25,25 0 1,0 50,0a25,25 0 1,0 -50,0"] },
    "action": { name: "Action", set: ["M-75,-50l150,0l0,100l-150,0Z"] },
    "gateway": { name: "Gateway", set: ["M0,-25l25,25l-25,25l-25,-25Z"] },
    "lane": { name: "Lane", set: ["M0,-75l400,0l0,150l-400,0l0,-150m30,0l0,150"] },
    "pool": { name: "Pool", set: ["M0,-75l400,0l0,150l-400,0l0,-150m24,0l0,150"] },
    "text": { name: "Text", set: ["M20,-50l-20,0l0,100l20,0"] }
};

function init() {
    paper = Raphael(0, 0, "100%", "100%");
    
    paper.canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        var menu = document.getElementById("bpmnmenu");
        menu.style.display = "block";
        menu.style.left = e.clientX + "px";
        menu.style.top = e.clientY + "px";
        return false;
    }, false);
    
    createBPMNMenu();
}

function createBPMNMenu() {
    var ul = document.getElementById("symbols");
    for (var symbol in bpmn) {
        var li = document.createElement("li");
        li.setAttribute("data-type", symbol);
        li.appendChild(document.createTextNode(bpmn[symbol].name));
        li.addEventListener("click", function(e) {
            createSymbol(e.target.getAttribute("data-type"));
        });
        ul.appendChild(li);
    }
}

function createSymbol(symbol) {
    paper.setStart();
    for (var path in bpmn[symbol].set) {
        paper.path(bpmn[symbol].set[path]).attr({ 'fill':'#FFFFFF' });
    }
    var symbolSet = paper.setFinish();
    symbolSet.drag(move, start, up);
    return symbolSet;
}

var start = function() {
        this.lastdx ? this.odx += this.lastdx : this.odx = 0;
        this.lastdy ? this.ody += this.lastdy : this.ody = 0;
        this.animate({
            "fill-opacity": 0.2
        }, 500);
    },
    move = function(dx, dy) {
        this.transform("T" + (dx + this.odx) + "," + (dy + this.ody));
        this.lastdx = dx;
        this.lastdy = dy;
    },
    up = function() {
        this.animate({
            "fill-opacity": 1
        }, 500);
    };

function setPath(newPath) {
    if (selectedPath && newPath) selectedPath.attr("path", newPath);
}
