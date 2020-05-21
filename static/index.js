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
    
    

   



});










function load_chat(chat) {
    const request = new XMLHttpRequest();
    request.open('GET', `/${chat}`);
    request.onload = () => {
        document.querySelector('#chat').innerHTML = "";
        const response = JSON.parse(request.response);
        for(var i = 0; i < response.messages.length; i++ ){
            const li = document.createElement('li');
            li.innerHTML = response.messages[i];
            document.querySelector('#chat').append(li);
        }
    };
    localStorage.setItem('page', chat);
    request.send();
}