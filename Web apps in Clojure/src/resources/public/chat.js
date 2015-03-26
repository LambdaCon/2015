function appendMessage(table, msg) {
    const tr = $("<tr class='" + (msg["private"] === true ? "message private" : "message") + "'>");
    tr.append($("<td class='timestamp'>").text(msg["timestamp"]));
    tr.append($("<td class='username'>").text(msg["username"]));
    tr.append($("<td class='message'>").text(msg["message-string"]));
    $(table).append(tr);
}

function refreshChat() {
    $.get("/messages").done(function(data) {
        const c = $("#chat");
        const table = $("<table>");
        c.html("");
        c.append(table);
        $(data).each(function(_, e) {
            appendMessage(table, e);
        });
        c.scrollTop(c.prop("scrollHeight"));
    });
}

function sendMessagePOST(msg) {
    $("#error").text("");
    $.post("/send", {"message":msg}).done(function() {
        $("#message").val("");
    }).fail(function(data) {
        $("#error").text("[" + data.status + "] " + data.responseText);
    });
}

function sendPrivateMessagePOST(to, msg) {
    $("#error").text("");
    $.post("/send-private", {"to": to, "message":msg}).done(function() {
        $("#message").val("");
    }).fail(function(data) {
        $("#error").text("[" + data.status + "] " + data.responseText);
    });
}

// Initial Registering
function registerUsername() {
    $.post("/register").fail(function (e) {
        $.post("/register", {"username":prompt("choose your username!")});
    });
}

// Periodic Refresh
var refreshHandle = null;
function periodicRefresh() {
    refreshChat();
    refreshHandle = setTimeout(periodicRefresh, 500);
}

$(function() {
    $("#submit").submit(function (e) {
        const msg = $("#message").val().trim();
        if (msg != "") {
            if (msg.indexOf("!") === 0) {
                const idx = msg.indexOf(" ");
                const username = msg.substring(1, idx);
                const text = msg.substring(idx+1);
                sendPrivateMessagePOST(username, text);
            }
            else {
                sendMessagePOST(msg);
            }
        }
        e.preventDefault();
    });
    registerUsername();
    periodicRefresh();
    $("#message").focus();
});
