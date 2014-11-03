var diagram = null;
var selection = null;
var bpmn = {
    event: { title: "Event", set: [{ path: "M-25,0a25,25 0 1,0 50,0a25,25 0 1,0 -50,0" }, { text: "*", attr: { "font-size": "25px" } } ] },
    activity: { title: "Activity", set: [{ path: "M-65,-40h130a10,10 0 0 1 10,10v80a-10,10 0 0 1 -10,10h-130a-10,-10 0 0 1 -10,-10v-80a10,-10 0 0 1 10,-10Z" }] },
    gateway: { title: "Gateway", set: [{ path: "M0,-30l30,30l-30,30l-30,-30Z" }] },
    flow: { title: "Flow", set: [{ path: "M0,0l200,0l0,-5l10,5l-10,5l0,-5", attr: { fill: "#000000" } }] },
    data: { title: "Data", set: [{ path: "M10,-30l15,15v45h-50v-60h35v15h15" }] },
    artifact: { title: "Artifact", set: [{ path: "M20,-50h-20v100h20" }, { text: "Text Annotation" }] },
    swimlane: { title: "Swimlane", container: true, set: [{ path: "M0,-75h400v150h-400v-150Z" }, { text: "Lane", attr: { contenteditable: true }, transform: "t10,0r-90" }] }
//    mail: { title: "Mail", set: [{ path: "M20,-15l-20,15l-20,-15l40,0l0,30l-40,0l0,-30" }] }
};

function init() {
    diagram = Raphael(0, 0, "100%", "100%");
    selection = diagram.set();
    
    createBPMNMenu();
    //loadSecurity();

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
    ul.addEventListener("click", function(event) {
        createSymbol(event.target.getAttribute("data-type"), event.clientX, event.clientY);
    });
}

function createSymbol(symbol, x, y) {
    if (symbol) {
        diagram.setStart();
        for (var i in bpmn[symbol].set) {
            var subset = bpmn[symbol].set[i];
            if (subset.path)
                diagram.path(subset.path).attr(subset.attr || { fill: '#FFFFFF' }).transform(subset.transform || "");
            else if (subset.text)
                diagram.text(subset.x || 0, subset.y || 0, subset.text).attr(subset.attr || {}).transform(subset.transform || "");
        }
        var set = diagram.setFinish();
        set.forEach(function(subset) { subset.set = set; });

        if (bpmn[symbol].container) { // Handle Raphael set.toBack() BUG
            var l = [];
            set.forEach(function (e) { l.push(e); });
            for (var e = l.pop(); e; e.toBack(), e = l.pop());
        }

        set.drag(move, start, finish);
        set.transform("...T" + [x,y]);
    }
}

function move(dx, dy, x, y, event) {
    var set = selection; // this.set;
    set.transform("...T"+[dx-set.dx,dy-set.dy]);
    set.dx = dx, set.dy = dy;
}
function start(x, y, event) {
    var l;
    if (!event.ctrlKey) {
        l = diagram.canvas.getElementsByClassName("selected");
        while (l.length > 0) { 
            l[0].classList.remove("selected"); 
        }
    }
    var set = this.set;
    set.forEach(function(e) { e.node.classList.toggle("selected"); });

    selection.clear();
    l = diagram.canvas.getElementsByClassName("selected");
    for (var i = 0; i < l.length; ++i) { 
        selection.push(diagram.getById(l[i].raphaelid)); 
    }
    selection.dx = 0, selection.dy = 0;
}
function finish(event) {

}

var roles = [
    { name: "guests", guid: "", title: "Guest role" },
    { name: "manager", guid: "", title: "Manager" },
    { name: "bpmanager", guid: "", title: "Business process manager" }
];
var users = [
    { name: "guest", hash: "", password: "", roles: {} },
    { name: "admin", hash: "", password: "", roles: {} }
];
function loadSecurity() {
    var roles = document.getElementById("roles");
    for (var i in roles) {
        var li = document.createElement("li");
        li.setAttribute("data-guid", roles[i].guid);
        li.appendChild(document.createTextNode(roles[i].title));
        roles.appendChild(li);
    }
    roles.addEventListener("click", function (event) {
        
    });
}