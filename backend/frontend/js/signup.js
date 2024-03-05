
function handleFormSubmit(event){
    event.preventDefault();
    const email = event.target.email.value;
     const username = event.target.username.value; 
    const password = event.target.password.value;

    const obj = {
        username: username,
        email: email,
        password: password
      };


      axios.post("http://13.54.247.155:3000/add-details", obj)
        .then((response) => {
            if(response.data.exists){
                console.log('already have bro>>>>>>')
            }
           
            console.log('posted data')
            
           // showUserOnScreen(response.data.newuser)
         console.log(response.data)
        

        })
        .catch((err) => {
            
          document.body.innerHTML = document.body.innerHTML + "<h4>Oops! something went wrong</h4>"
           console.log(err)
            
            
        })

    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

  window.location = "login.html"

    

}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await axios.get("http://13.54.247.155:3000/get-details")
        console.log('got our data')

       
       console.log(response)
       
       
    }
    catch (err) {
        console.log(err)
    }
})
