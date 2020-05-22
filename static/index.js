document.addEventListener('DOMContentLoaded', () =>{
    
    if(!localStorage.getItem('user')){
        document.querySelector('.username').style.display = "block";
        document.querySelector('.container').style.display = "none";
    }
    else {
        document.querySelector('h5').innerHTML = localStorage.getItem('user');
        const chat = localStorage.getItem('page');
        load_chat(chat);
    }
    
    document.querySelector('#newuser').onsubmit = function() {
        const name = document.querySelector('#name').value;
        console.log(name);
        localStorage.setItem('user', name);
    };
    
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = () => {
            load_chat(link.dataset.page);
            return false;
        };
    });
    
    document.querySelector('#newchannel').onsubmit = function() {
        const channel = document.querySelector('#channel').value;   
        new_channel(channel);
        return false;
    };
 
});


document.addEventListener('DOMContentLoaded', () => {


    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
              
        document.querySelector('#newmessage').onsubmit = function() {
            const message = document.querySelector('#message').value;
            const page = localStorage.getItem('page');
            const user = localStorage.getItem('user');
            console.log(page);
            console.log(message);
            socket.emit('submit message', {'message': message ,'page': page ,'user': user });    
            return false;
        };
    });
    
    socket.on('message sent', data => {
        if(localStorage.getItem('page') === data){
            load_chat(data);
        }  
        else {
            load_chat(localStorage.getItem('page'));
        }
    });
});




function new_channel(channel){
    const data = new FormData();
    data.append('channel', channel);
    const request = new XMLHttpRequest();
    request.open('POST', '/newchannel');
    request.onload = () =>{
        const response = request.responseText;
        if( response === "false"){
            document.querySelector('#warn').innerHTML = "Chat already exists";
        }
        else{
            window.location.href = "http://127.0.0.1:5000/";
        }
    };
    request.send(data);
}
      

function load_chat(chat) {
    const request = new XMLHttpRequest();
    request.open('GET', `/${chat}`);
    request.onload = () => {
        document.querySelector('#chat').innerHTML = "";
        const response = JSON.parse(request.response);
        for(var i = response.messages.length-1; i >= 0 ; i-- ){
            const li = document.createElement('li');
            li.id = "messages"
            li.innerHTML = response.messages[i];
            document.querySelector('#chat').append(li);
        }
    };
    localStorage.setItem('page', chat);
    request.send();
}