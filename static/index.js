document.addEventListener('DOMContentLoaded', () =>{
    
    if(!localStorage.getItem('user')){
        document.querySelector('.username').style.display = "block";
        document.querySelector('.container').style.display = "none";
    }
    else {
        document.querySelector('h5').innerHTML = localStorage.getItem('user');
        const chat = localStorage.getItem('page');
        load_chat(chat);
        document.querySelector('#current').innerHTML = chat;
    }
    
    if(!localStorage.getItem('page')){
        const chat = 'main';
        load_chat(chat);
        document.querySelector('#current').innerHTML = chat;
    }
    
    document.querySelector('#newuser').onsubmit = function() {
        const name = document.querySelector('#name').value;
        console.log(name);
        localStorage.setItem('user', name);
    };
    
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = () => {
            load_chat(link.dataset.page);
            document.querySelector('#current').innerHTML = localStorage.getItem('page');
            return false;
        };
    });
    
    document.querySelector('#newchannel').onsubmit = function() {
        const channel = document.querySelector('#channel').value;   
        new_channel(channel);
        return false;
    };
    
    document.querySelector('#newmessage').onsubmit = function() {
        document.querySelector('#message').clear();
        return false;
    };
    
    document.querySelector('#showpic').onclick = function() {
        if(document.querySelector('#picarea').style.display === "none"){
            document.querySelector('#picarea').style.display = "block";
            document.querySelector('#showpic').innerHTML = "Hide";
        } 
        else {
            document.querySelector('#picarea').style.display = "none";
            document.querySelector('#showpic').innerHTML = "Send drawing";
        }
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
            document.querySelector('#message').value = '';
            return false;
        };
        
        
        
        document.querySelector('#sendpic').onclick = function() {
            const svgtosend = document.querySelector('#svgtosend').innerHTML;
            const page = localStorage.getItem('page');
            socket.emit('newsvg', {'svg': svgtosend ,'page': page });
            document.querySelector('#svgtosend').innerHTML = '';
        };
        
        document.querySelector('#erase').onclick = function() {
            document.querySelector('#svgtosend').innerHTML = '';
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
            if( response.messages[i].charAt(0) === "<" ){
                const li = document.createElement('li');
                li.id = "messages";
                const text = response.messages[i];
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " +today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                namedate = localStorage.getItem('user') + " at " + date;
                li.innerHTML = `<svg style="width:100%; height:100px>${text}<\svg><p>${namedate}<\p>`;
                document.querySelector('#chat').append(li); 
            }
            else {
                const li = document.createElement('li');
                li.id = "messages"
                li.innerHTML = response.messages[i];
                document.querySelector('#chat').append(li);     
            } 
        }
    };
    localStorage.setItem('page', chat);
    request.send();
}