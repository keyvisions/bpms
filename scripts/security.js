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
