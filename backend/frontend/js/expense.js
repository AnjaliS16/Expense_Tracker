//const Razorpay = require("razorpay");

function handleFormSubmit(event) {
    event.preventDefault();
    const exp = event.target.exp.value;
    const des = event.target.des.value;
    const select = event.target.select.value;



    const obj = {
        exp: exp,
        des: des,
        select: select,
        //  userId:1


    }

    //post detail on crud
    const token = localStorage.getItem('token')
    console.log('token>', token)


    axios.post("http://13.54.247.155:3000/expense/add-expense", obj, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        }
    })
        .then((response) => {
            console.log('posted data')


            showUserOnScreen(response.data.newuser);
            console.log('Data posted successfully:', response.data);

            // console.log('Error from backend:', response.data.error);



        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + "<h4>Oops! something went wrong</h4>"
            console.log(err)
        })

    document.getElementById('exp').value = '';
    document.getElementById('des').value = '';

    const selectElement = document.getElementById('select');
    selectElement.selectedIndex = 0;

}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
//retrieve from crud
window.onload = async () => {
    const token = localStorage.getItem('token')
    const decodetoken = parseJwt(token)
    const ispremiumuser = decodetoken.ispremiumuser;
    if (ispremiumuser) {
        const messageElement = document.createElement('div');
        //  const button =document.createElement('button')
        //  button.innerText='leaderboard button'
        messageElement.setAttribute('id', 'message')
        messageElement.innerText = 'YOU ARE A PREMIUM MEMBER.';
        messageElement.style.color = 'white';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.position = 'absolute';
        messageElement.style.left = '1000px';
        messageElement.style.top = '8px';


        const parentElement = document.getElementById('rzp-button').parentNode;


        parentElement.replaceChild(messageElement, document.getElementById('rzp-button'));
        //  showLeaderboard();
    }
   // console.log(decodetoken, 'jwt token>>>>>>>>>>>>>>>')
   // console.log('token>>>', token)

    const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
    }

    try {
        const response = await axios.get("http://13.54.247.155:3000/expense/get-expense", {
            headers: headers
        })
        console.log('got our data')
        //console.log('headers>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', headers)


        console.log(response.data)

        for (var i = 0; i < response.data.alluser.length; i++) {
            showUserOnScreen(response.data.alluser[i])
        }
        renderElements() 
    }

    catch (err) {
        console.log(err)
    }

}

document.getElementById("logout").addEventListener('click', () => {
    localStorage.removeItem("token")
    localStorage.removeItem("ispremiumuser")
    window.location = "login.html"
})
async function renderElements() {
    const ul=document.getElementById('listofitems')
    if (localStorage.getItem('token') == undefined)
        window.location = "login.html";

    const token = localStorage.getItem('token');

    //console.log(localStorage.getItem("ispremiumuser"));

    let res = await axios.get('http://13.54.247.155:3000/premium/checkPremium', {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    });

    if (res.status == 200) {
        console.log(res.status);
        localStorage.setItem('ispremiumuser', res.data);
    }

    const ITEMS_PER_PAGE = +localStorage.getItem('totalItems') || 5;
   // console.log(ITEMS_PER_PAGE);

    document.getElementById('display-expenses').value = ITEMS_PER_PAGE;

    let result = await axios.post('http://13.54.247.155:3000/get-expense', { items: ITEMS_PER_PAGE }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    });

   // console.log(result);

    if (ITEMS_PER_PAGE > result.data.totalExpenses) {
        document.getElementById('next').classList.add('hide');
    } else {
        document.getElementById('next').classList.remove('hide');
    }

    let users = result.data.expenses;
    ul.innerHTML = ``;
    users.forEach((value) => {
        let li = showUserOnScreen(value);
        ul.appendChild(li);
    });
}
//print detail on screen
function showUserOnScreen(obj) {
    const tableBody = document.getElementById('listofitems');
    const currentDate = new Date().toLocaleDateString();
    //<td>${currentDate}</td>
    // Create HTML for a new row
    const newRow = document.createElement('tr');
    newRow.id = obj.id;
    newRow.innerHTML = `
        
            <td>${currentDate}</td>
            <td>${obj.exp}</td>
            <td>${obj.des}</td>
            <td>${obj.select}</td>
            <td><button style="color:white" onclick="DeleteUser('${obj.id}')">Delete expense</button></td>
            <td><button style="color:white" onclick="editUserDetails('${obj.id}','${obj.exp}','${obj.des}','${obj.select}')">Edit expense</button></td>
       
    `;

    // Append the new row HTML to the table body
    tableBody.appendChild(newRow);
    return newRow;
}

//edit users detail
function editUserDetails(id, exp, des, select) {

    document.getElementById('exp').value = exp;
    document.getElementById('des').value = des;
    document.getElementById('select').value = select;

    DeleteUser(id)

}

//delete from crud
async function DeleteUser(id) {

    console.log(typeof id)
    console.log(id)
    const token = localStorage.getItem('token');
    


    try {
        const res = await axios.delete(`http://13.54.247.155:3000/expense/delete-expense/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            }
        })
        console.log('deleted successfully')
       
        removeUserFromScreen(id)
    }
    catch (err) {
        console.log(err)
        console.log('cant delete')
    }
}

//delete from screen
function removeUserFromScreen(id) {
    console.log(typeof id)
    const parentNode = document.getElementById('listofitems')
    const ChildNodeToBeRemoved = document.getElementById(id)

    if (ChildNodeToBeRemoved) {
        parentNode.removeChild(ChildNodeToBeRemoved)

    }

}
document.getElementById('rzp-button').onclick = render;
//window.onload = render;

 async function render() {
    const token = localStorage.getItem('token');
   // console.log(token, 'token from razorpay>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    const response = await axios.get('http://13.54.247.155:3000/premiummember', {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        }
    })


    console.log(response);
    var options =
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('http://13.54.247.155:3000/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
            if (res.status === 202) {
                localStorage.setItem('ispremiumuser',true)
                alert('YOU ARE A PREMIUM MEMBER.');
                const messageElement = document.createElement('div');
                // const button =document.createElement('button')
                //  button.innerText='leaderboard button'
                messageElement.setAttribute('id', 'message')
                messageElement.innerText = 'YOU ARE A PREMIUM MEMBER.';
                messageElement.style.color = 'white';
                messageElement.style.fontWeight = 'bold';
                messageElement.style.position = 'absolute';
                messageElement.style.left = '1000px';
                messageElement.style.top = '8px';

                // messageElement.appendChild(button);

                const parentElement = document.getElementById('rzp-button').parentNode;


                parentElement.replaceChild(messageElement, document.getElementById('rzp-button'));
                localStorage.setItem('token', res.data.token)
                console.log(res.data.token, 'res recived from backend<<<<<')
                showLeaderboard();

                
            }
           


        }
    }
    
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();


}

    
    // alert('YOU ARE A PREMIUM USER NOW')


async function showLeaderboard() {

    const token = localStorage.getItem('token');
    const userleaderboardarray = await axios.get('http://13.54.247.155:3000/premium/showleaderboard', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const leaderboardModal = document.getElementById('leaderboard-modal');
    ///const leaderboardList = document.getElementById('leaderboard-list');

    const leaderboardList = document.getElementById('leaderboard-list')
    leaderboardList.innerHTML = '';
    let index = 0;
    userleaderboardarray.data.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.totalExpenses}</td>
            <hr>
        `;
        leaderboardList.appendChild(tr);
        index++;
    });


    leaderboardModal.style.display = 'block';
    leaderboardModal.style.color = 'black';
    leaderboardModal.style.borderColor = 'purple';
    leaderboardModal.style.width = '600px';
    leaderboardModal.style.height = '900px';
    leaderboardModal.style.position = 'fixed';
    leaderboardModal.style.transform = 'translate(-60%, 20%)';
    leaderboardModal.style.overflow = 'auto';

    leaderboardModal.style.top = '0';
    //leaderboardModal.style.right = '-300px';

    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.onclick = () => {
        leaderboardModal.style.display = 'none';


    };

    window.onclick = (event) => {
        if (event.target === leaderboardModal) {
            leaderboardModal.style.display = 'none';
        }
    };
    // leaderboardModal.style.transition = 'none';
}


const inputelement = document.createElement('button');
inputelement.innerText = 'LEADERBOARD';
inputelement.status = 'show leaderboard';
inputelement.onclick = showLeaderboard;

inputelement.style.position = 'fixed';
inputelement.style.top = '8px';
inputelement.style.left = '240px';
inputelement.style.background = 'transparent'


document.body.appendChild(inputelement)

document.getElementById('download-expense').addEventListener('click', async () => {
    console.log('click')
    const token = localStorage.getItem('token')

    try {
        const result = await axios.get('http://13.54.247.155:3000/download', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const a = document.createElement('a')
        a.href = result.data.fileUrl
        a.download = 'myexpense.txt'

        a.click()
        showDownloadUrls()

    } catch (e) {
        console.log(e)
    }

})


async function showDownloadUrls() {
    try {
        const token = localStorage.getItem('token')
        const getUrls = await axios.get('http://13.54.247.155:3000/get-all-urls', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log(getUrls)
        let urls = getUrls.data.urls;
        const showDownloadUrls = document.getElementById('download-urls')
        if (urls.length > 0) {
            showDownloadUrls.classList.remove('hide')
            const ul = showDownloadUrls.querySelector('ul')
            const li0 = document.createElement('li')
            li0.textContent = 'Click here to download previous reports!'
            li0.style.color = 'white'
            ul.appendChild(li0)
            urls.forEach(elem => {

                const li = document.createElement('li')
                const a = document.createElement('a')
                a.href = elem.url
                a.download = elem.createdAt + '-expense.txt'
                a.textContent = elem.createdAt + '-expense.txt'
                li.appendChild(a)


                ul.appendChild(li)
            })
        }
    } catch (e) {
        console.log(e)
    }
}



document.querySelector('.page').addEventListener('click', async (e) => {
    try {
        const ul=document.getElementById('listofitems')
    const token=localStorage.getItem('token')
        const items = +localStorage.getItem('totalItems') || 5
        if (e.target.classList.contains('page-btn')) {
            console.log('clicked')
            console.log(e.target.id == 'next')
            const page = e.target.value
            const result = await axios.post(`http://13.54.247.155:3000/get-expense?page=${page}`, { items }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        }})
           // console.log(result)
            let users = result.data.expenses;
            ul.innerHTML = ``
            users.forEach((value) => {

               // console.log(value,'>>>>>>>')
                let li = showUserOnScreen(value)
               // console.log(li,'li>>>>>>>>>')
                ul.appendChild(li)
            })
            let prev = document.getElementById('prev')
            let curr = document.getElementById('curr')
            let next = document.getElementById('next')

            if (e.target.id == 'next') {


                prev.classList.remove('hide')
                prev.textContent = curr.textContent
                prev.value = curr.value

                curr.textContent = next.textContent
                curr.value = next.value

                if (result.data.totalExpenses > items * page) {
                    next.value = +page + 1
                    next.textContent = +page + 1
                    // next.classList.remove('hide')
                } else {

                    next.classList.add('hide')
                }
            } else if (e.target.id == 'prev') {
                if (page > 1) {
                    next.classList.remove('hide')
                    prev.textContent = page - 1
                    prev.value = page - 1

                    curr.textContent = page
                    curr.value = page

                    next.textContent = +page + 1
                    next.value = +page + 1
                } else {
                    prev.classList.add('hide')
                    curr.textContent = 1
                    curr.value = 1
                    if (result.data.totalExpenses > items * page) {
                        next.value = 2
                        next.textContent = 2
                        next.classList.remove('hide')
                    } else {

                        next.classList.add('hide')
                    }
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
})
document.getElementById('display-expenses').addEventListener('change' , (e)=>{
    console.log(e.target.value)
    
   
    localStorage.setItem('totalItems' , e.target.value)
    renderElements();
})

