

window.addEventListener('load' , ()=>{
    document.getElementById('date').value = new Date().toISOString().split('T')[0]
})





document.getElementById('expense-display').addEventListener('change', (e)=>{
    console.log(e.target.value)
    if(e.target.value == "daily"){
        document.getElementById('daily-form').classList.remove('hide')
        document.getElementById('monthly-form').classList.add('hide')
        document.getElementById('yearly-form').classList.add('hide')
    }
    else if(e.target.value == "monthly"){
        document.getElementById('monthly-form').classList.remove('hide')
        document.getElementById('daily-form').classList.add('hide')
        document.getElementById('yearly-form').classList.add('hide')
    }
    else if(e.target.value == "yearly"){
        document.getElementById('monthly-form').classList.add('hide')
        document.getElementById('daily-form').classList.add('hide')
        document.getElementById('yearly-form').classList.remove('hide')
    }else{
        
        document.getElementById('monthly-form').classList.add('hide')
        document.getElementById('daily-form').classList.add('hide')
        document.getElementById('yearly-form').classList.add('hide')
        displayWeekly()
    }
})

document.getElementById('daily-form').addEventListener('submit' , async(e)=>{
    e.preventDefault()
    console.log(e.target.date.value)
    const date = e.target.date.value
    try{
           const token=localStorage.getItem('token')
        const res = await axios.post('http://13.54.247.155:3000/getdate' , {date} ,{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            }
        })
        console.log(res)
        document.getElementById('daily').classList.remove('hide')
        document.getElementById('monthly').classList.add('hide')
        document.getElementById('yearly').classList.add('hide')
        document.getElementById('weekly').classList.add('hide')


        const tbody = document.querySelector('#daily table tbody')
       // console.log(tbody)
        let total =0
        tbody.innerHTML = ``
        document.querySelector('#daily h3 span').textContent = date
        res.data.forEach(elem => {
            console.log(elem)
            const tr = document.createElement('tr')
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')

            td1.textContent = elem.des
            td2.textContent = elem.exp

            total = total + +elem.exp
            tr.appendChild(td1)
            tr.appendChild(td2)

            tbody.appendChild(tr)

        })

        document.getElementById('daily-total').textContent = total
    }catch(e){
        console.log(e)
    }
})



document.getElementById('yearly-form').addEventListener('submit' , async(e)=>{
    e.preventDefault()
    console.log(e.target['year-picker'].value)
    const year = e.target['year-picker'].value
    try{
        const token=localStorage.getItem('token')
        const res = await axios.post('http://13.54.247.155:3000/getYearly' , {year},{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            }
        } )
       // console.log(res)
        document.getElementById('daily').classList.add('hide')
        document.getElementById('monthly').classList.add('hide')
        document.getElementById('yearly').classList.remove('hide')
        document.getElementById('weekly').classList.add('hide')


        const tbody = document.querySelector('#yearly table tbody')
      //  console.log(tbody)
        let total =0
        tbody.innerHTML = ``
        document.querySelector('#yearly h3 span').textContent = year
        res.data.forEach(elem => {
            console.log(elem)
            const tr = document.createElement('tr')
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')

            td1.textContent = elem.month
            td2.textContent = elem.totalExpenses

            total = total + +elem.totalExpenses
            tr.appendChild(td1)
            tr.appendChild(td2)

            tbody.appendChild(tr)

        })

        document.getElementById('yearly-total').textContent = total
    }catch(e){
        console.log(e)
    }
})

document.getElementById('monthly-form').addEventListener('submit' , async(e)=>{
    e.preventDefault()
    console.log(e.target['year-picker'].value)
    // const year = e.target['year-picker'].value
    // const month = e.target['month-picker'].value
    const month = e.target['year-picker'].value + "-" + e.target['month-picker'].value
    console.log(month)
    try{
        const token=localStorage.getItem('token')

        const res = await axios.post('http://13.54.247.155:3000/getMonthly' , {month},{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            }
        } )
       // console.log(res)
        document.getElementById('daily').classList.add('hide')
        document.getElementById('monthly').classList.remove('hide')
        document.getElementById('yearly').classList.add('hide')
        document.getElementById('weekly').classList.add('hide')


        const tbody = document.querySelector('#monthly table tbody')
        console.log(tbody)
        let total =0
        tbody.innerHTML = ``
        document.querySelector('#monthly h3 span').textContent = e.target['month-picker'].options[e.target['month-picker'].selectedIndex].text
        res.data.forEach(elem => {
            console.log(elem)
            const tr = document.createElement('tr')
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')

            td1.textContent = elem.date
            td2.textContent = elem.totalExpenses

            total = total + +elem.totalExpenses
            tr.appendChild(td1)
            tr.appendChild(td2)

            tbody.appendChild(tr)

        })

        document.getElementById('monthly-total').textContent = total
    }catch(e){
        console.log(e)
    }
})


async function displayWeekly(){
    
    try{
        const token=localStorage.getItem('token')
        const res = await axios.get('http://13.54.247.155:3000/getweekly',{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            }
        })
        console.log(res)
        document.getElementById('daily').classList.add('hide')
        document.getElementById('monthly').classList.add('hide')
        document.getElementById('yearly').classList.add('hide')
        document.getElementById('weekly').classList.remove('hide')


        const tbody = document.querySelector('#weekly table tbody')
       // console.log(tbody)
        let total =0
        tbody.innerHTML = ``
        // document.querySelector('#weekly h3 span').textContent = year
        res.data.forEach(elem => {
            console.log(elem)
            const tr = document.createElement('tr')
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')

            td1.textContent = elem.week
            td2.textContent = elem.totalExpenses

            total = total + +elem.totalExpenses
            tr.appendChild(td1)
            tr.appendChild(td2)

            tbody.appendChild(tr)

        })

        document.getElementById('weekly-total').textContent = total
    }catch(e){
        console.log(e)
    }
}