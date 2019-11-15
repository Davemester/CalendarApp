
class Day {
    constructor(date){
        this.date = date;
        this.eventList = [];
    }

    getFullDate(){

        return `${this.date.getFullYear()}-${+this.date.getMonth()+1}-${this.date.getDate()}`;
    } 

    addEvent(event){

        if (Array.isArray(event)){
            event.forEach((item)=>{
                this.eventList.push(item);
            })
        }else
        {this.eventList.push(event);}
        
    }

    deleteEvent(event){
        this.eventList.forEach(e=>{
            if (e === event){
                this.eventList.splice(this.eventList.indexOf(e),1);
            }
        })
        event.deleteEventFromLs();
    }

    editEvent(newEvent,targetEvent){

        let targetEventname = targetEvent.children[0].textContent;
        let targetEventPeriod = targetEvent.children[1].textContent;
        let targetKey = this.getFullDate();
        let currentEvent = new userEvent(targetEventname,targetEventPeriod,targetKey);




        this.eventList.forEach(e=>{
            if (e.name === currentEvent.name && e.period === currentEvent.period ){
                this.eventList.splice(this.eventList.indexOf(e),1,newEvent);
              
            }
        })
       
        newEvent.editIteminLocalStorage(currentEvent);
        
    }

  

    getData(){

        let eventDate = this.getFullDate();
        let eventName= document.querySelector('#eventname').value;
        let eventPeriod = document.querySelector('#eventperiod').value;
        let userevent=new userEvent(eventName,eventPeriod,eventDate);
      
   
        return userevent;
    }

    getDataFromLocalStorage(){

        let data = localStorage.getItem(this.getFullDate());
        let eventArray = [];

        if (data) {
            let objectData = JSON.parse(data);
            if (Array.isArray(objectData)){
             
                objectData.forEach((event)=>{
                   
                    let eventDate = this.getFullDate();
                    let eventName = event.name;
                    let eventPeriod = event.period;
                    let userevent = new userEvent(eventName,eventPeriod,eventDate);
                    eventArray.push(userevent);


                })
               
                return eventArray;

            } else {
                let eventDate = this.getFullDate();
                let eventName = objectData.name;
                let eventPeriod = objectData.period;
                let userevent = new userEvent(eventName,eventPeriod,eventDate);
               
                return userevent;
            }
        }

    }
   

}


class Calendar{
    constructor() {
        this.daysOfMonth = [];
        this.daysOfPrevMonth = [];
        this.daysOfNextMonth = [];
        this.selectedMonth = Number(document.querySelector('#monthChoose').value);
        this.selectedYear = Number(document.querySelector('#year').value);
        this.editableDate = '';
       
    }



    addEditableDay(day){
        this.editableDate = day;
    }

    setYearMonthInputField(year,month){
        document.querySelector('#monthChoose').value = month;
        document.querySelector('#year').value = year;
    }

    makeMonthArray(date) {
        let newdate;
        let dateArray = [];
        let date2;
     
       
        for(let i = 1; i <= date.getDate(); i++) {
            date2 = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${i}`);
            newdate = new Day(date2);
            dateArray.push(newdate);
            
        }
      
         
        return dateArray ; 
    }

    setDaysOfMonth(){
    
        this.selectedYear = Number(document.querySelector('#year').value);
        this.selectedMonth = Number(document.querySelector('#monthChoose').value);
        this.daysOfMonth = this.makeMonthArray(new Date(this.selectedYear, this.selectedMonth + 1, 0));
       
        
        this.daysOfMonth.forEach((day)=>{
            if (localStorage.getItem(day.getFullDate())) {
                day.addEvent(day.getDataFromLocalStorage());
            }
        })
       

    }

    setDaysOfPrevMonth(){
        if (this.selectedMonth === "0") {
            this.daysOfPrevMonth = this.makeMonthArray(new Date(this.selectedYear - 1, this.selectedMonth + 12, 0));

            return;
        } 
        
        this.daysOfPrevMonth = this.makeMonthArray(new Date(this.selectedYear, this.selectedMonth, 0));
    }

    setDaysOfNextMonth(){
        if (this.selectedMonth === "11") {
            this.daysOfNextMonth = this.makeMonthArray(new Date(this.selectedYear + 1, 1, 0));

            return;
        }
        
        this.daysOfNextMonth = this.makeMonthArray(new Date(this.selectedYear, this.selectedMonth + 2, 0));
      
    }

    setYearMonth(){
        this.setDaysOfMonth();
        this.setDaysOfNextMonth();
        this.setDaysOfPrevMonth();
    }

    clear(){
        //addingEventButton.hidden=true;
        let row = 2;

        for(let i=0;i<6;i++){
            let array=document.querySelector(`#row${row}`).children;
            for(let day of array){
                day.textContent='';
                day.style.color='black';
                day.style.background='white';
                if(day.classList.contains('event-added')){
                    day.classList.remove('event-added');
                }
            }
            row++;
        }

        document.getElementById('eventcontainer').style.display='none';  
    }

    colorizeSundays() {
        document.querySelectorAll('.col.day-col.sunday').forEach(e=>{
            e.style.background='rgb(253, 236, 239)';   //a vasárnapok ugyanolyan színűek legyenek
        });
    }

    drawCurrentMonth() {

        let rowCounter=2;
        let currentDay;
        
        this.daysOfMonth.forEach(day => {
            let currentDayHtml = document.querySelector(`#row${rowCounter}`).children
            currentDay = day.date.getDay() === 0 ? 6 : day.date.getDay()-1;  //a getDay()-nél a 0 vasárnapot jelent, ezért kell ez
            currentDayHtml[currentDay].textContent = day.date.getDate().toString();

        //ellenőrzi hogy van e egyezés az adott nappal a hónapban a Local Storegban:
            for (let i of Object.entries(localStorage)) {
                
                let storageDay = `${day.date.getFullYear()}-${+day.date.getMonth()+1}-${day.date.getDate()}`;
                
                if (storageDay === `${i[0]}`) {
                    currentDayHtml[currentDay].style.background='gold';
                    currentDayHtml[currentDay].classList.add('event-added');
                }
            } 
            if (day.date.getDay() === 0) {
                rowCounter++;
            }   
        });
    }

    drawMutedDays()  {
        let emptyDayBefore = 0;
        let emptyDayAfter = 0; 
        
        let firstWeek = document.querySelector(`#row2`);
        let row6=document.querySelector('#row6');
        let row7= document.querySelector('#row7');
    
        let nextMonthArrayFirstDays=[];


       

        for(let i=0;i<firstWeek.children.length;i++){      
            if(firstWeek.children[i].textContent === ''){   
                emptyDayBefore++;
            } 
        }

        for(let y=0; y<row6.children.length; y++){     
            if (row6.children[y].textContent==='') { 
                emptyDayAfter++;
                nextMonthArrayFirstDays.push(row6.children[y]);
            } 
        }
        for(let z=0;z<row7.children.length;z++){      
            if(row7.children[z].textContent===''){    
                emptyDayAfter++;
                nextMonthArrayFirstDays.push(row7.children[z]);
            } 
        }
        
        for(let d=0; d< nextMonthArrayFirstDays.length;d++){  
            nextMonthArrayFirstDays[d].textContent=`${this.daysOfNextMonth.shift().date.getDate()}`;  
            nextMonthArrayFirstDays[d].style.color= '#c1c6c7';
            nextMonthArrayFirstDays[d].classList.add('muted-day');
        };
    
        for(let x = emptyDayBefore-1; x>=0; x--){
            firstWeek.children[x].textContent=`${this.daysOfPrevMonth.pop().date.getDate()}`; 
            firstWeek.children[x].style.color= '#c1c6c7';
            firstWeek.children[x].classList.add('muted-day');
        }
    }


    draw(){
        this.clear();
        this.setYearMonth();
        this.drawCurrentMonth();
        this.colorizeSundays();
        this.drawMutedDays();
        let row7= document.querySelector('#row7');
        row7.style.display = +row7.children[0].textContent < 15 ? 'none' : 'flex';
        this.setDaysOfNextMonth(); 
        this.setDaysOfPrevMonth();
        this.setDaysOfMonth(); 
    }

    redraw() {
        this.setYearMonth();
        this.draw();
    }
    
    displayEvents(date){
        
        document.getElementById('eventcontainer').style.display='block';
        let eventList=document.getElementById('eventlist');
        let storageObject=JSON.parse(localStorage.getItem(date));
        eventList.innerHTML='';

        if (Array.isArray(storageObject)) {
            for(let i of storageObject){
                eventList.innerHTML+=`
                <div class="row edit-row">
                <span class="col event-col-name">${i.name}</span>
                <div class="col event-col-period">${i.period}</div>
                <div class="col"><i class="far fa-calendar-times"></i></div>
                <div class="col"><i class="far fa-edit"></i></div>
                </div>

                                    `
            }
        } else {
            eventList.innerHTML=`
            <div class="row edit-row">
            <span class="col event-col-name">${storageObject.name}</span>
            <div class="col event-col-period">${storageObject.period}</div>
            <div class="col"><i class="far fa-calendar-times"></i></div>
            <div class="col"><i class="far fa-edit"></i></div>
            </div>
                `
        }
        
    }

    paginateTo(value) {
       
        


        if ((this.selectedMonth === 0 && value === -1 ) || (this.selectedMonth===11 && value === 1 )) {
            
            this.selectedMonth = (Number(this.selectedMonth + (11 *  Number(value) * -1))).toString();
            this.selectedYear = (Number(this.selectedYear) + Number(value)).toString();
            
 
        } else {
          
            this.selectedMonth = (Number(this.selectedMonth) + Number(value)).toString();
            this.selectedYear = (Number(this.selectedYear )).toString();  // váltpozás itt
        }
       
        this.setYearMonthInputField(this.selectedYear,this.selectedMonth);
       
        this.redraw();
      
       
    }

    handlePaginateEvent(event) {
        let value
        if (event.target.classList.contains("fa-arrow-left")) {
           
            this.paginateTo(-1);
          
        }
    
        if (event.target.classList.contains("fa-arrow-right")) {
            
            this.paginateTo(1);  
           
        }
    }
}


class userEvent{
    constructor(name, period, key) {
        this.name = name;
        this.period = period;
        this.key = key;
    }

    toJSON() {
        let object={
            name:this.name,
            period: this.period
        };
        return JSON.stringify(object);
    }

    toObject(){
        let object={
            name:this.name,
            period: this.period
        };
        return object;
    }

    saveToLocalStorage(){
        
        let currentStorageEvents = localStorage.getItem(this.key);
        let currentStorageObjects = JSON.parse(currentStorageEvents)
      


        if (!currentStorageEvents) { 
            
            localStorage.setItem(this.key,this.toJSON());
            return;
        }
        if (!Array.isArray(currentStorageObjects)){ 
            let array = [currentStorageObjects];
            array.push(this.toObject());
            localStorage.setItem(this.key,JSON.stringify(array));
            return;
        }
            
        currentStorageObjects = currentStorageObjects.reduce(function(a,b){  
                                                
            return a.concat(b);
        },[]);
       
        currentStorageObjects.push(this.toObject());
        localStorage.setItem(this.key,JSON.stringify(currentStorageObjects));
      
    }

    deleteEventFromLs(){
        let storageItem = JSON.parse(localStorage.getItem(this.key));

        if (!Array.isArray(storageItem)){
            localStorage.removeItem(this.key);
            
        }
        else{
            let storageArray=[];
            storageItem.forEach((item)=>{
                if (item.name !== this.name && item.period !== this.period){
                    storageArray.push(item);
                }
            })
            localStorage.setItem(this.key,JSON.stringify(storageArray));
            if (localStorage.getItem(this.key)==='[]'){
                localStorage.removeItem(this.key);
            } 
        }

    }

    editIteminLocalStorage(currentEvent) { 

        let currentStorageEvents = JSON.parse(localStorage.getItem(this.key));

        if ( !Array.isArray(currentStorageEvents)){
            this.saveToLocalStorage();
            return;
        }

        currentStorageEvents.forEach(e=>{
            if (e.name === currentEvent.name && e.period === currentEvent.period) {
                currentStorageEvents.splice(currentStorageEvents.indexOf(e),1,this.toObject());
            }
        })
        localStorage.setItem(this.key,JSON.stringify(currentStorageEvents));                         
    }
}

class Main {

    

    isDayOfPrevMonth(htmlElement, currentRow) {
        return htmlElement.classList.contains('muted-day') && currentRow === 'row2';
    }
    
     isDayOfNextMonth(htmlElement, currentRow) {
        return htmlElement.classList.contains('muted-day') && (currentRow === 'row6' || currentRow === 'row7');
    }
    
     isDayOfCurrentMonth(htmlElement) {
        return !htmlElement.classList.contains('muted-day');
    }
    
     setEditableDay(days,calendar) {
        
        days.forEach(day => {
            if (day.date.getDate().toString() === event.target.textContent) {
                 calendar.addEditableDay(day);
            }
        });
    }
    
     dayHasEvents(htmlElement) {
        return htmlElement.classList.contains('event-added');
    }
    
    setDayBackgroundAndShowAddButton(htmlElement) {
    
        const addingEventButton = document.querySelector(".add-event");
        if (htmlElement.style.background === 'lightblue') {
            htmlElement.style.background = 'white';
            addingEventButton.hidden = true;
            return;
        }
        htmlElement.style.background = 'lightblue';
        addingEventButton.hidden = false;
    }
    
    handleDayClick(event, calendar) {
        const monthSelector = document.querySelector('#monthChoose');
        const yearSelector = document.querySelector('#year');
       
        let htmlElement = event.target;
        
        if (event.target.classList.contains('day-col') && !yearSelector.value) {
           
            return;
        }
        const currentRow = htmlElement.closest('.row').id;
        calendar.redraw();
        this.setDayBackgroundAndShowAddButton(event.target);
    
        if (this.isDayOfPrevMonth(event.target, currentRow)) {
           
            this.setEditableDay(calendar.daysOfPrevMonth,calendar);
        }
    
        if (this.isDayOfNextMonth(event.target, currentRow)) {
            
           this.setEditableDay(calendar.daysOfNextMonth,calendar);
        }
    
        if (this.isDayOfCurrentMonth(event.target)) {
          
            this.setEditableDay(calendar.daysOfMonth,calendar);
        }
    
        if (this.dayHasEvents(event.target)) {
            calendar.displayEvents(calendar.editableDate.getFullDate());
        }
    }
    
     handleOkClickEvent(event,calendar){
    
        if (event.target === document.getElementById('ok') &&     // külön functionbe tenni amikor az okra kattint,                                                     // külön amikot a cancelre és külön a két iconra
            (!document.querySelector('#eventname').value ||  
            !document.querySelector('#eventperiod').value)) {
    
                document.getElementById('error').style.display='flex';
                document.getElementById('error').textContent='Kérlek tölts ki minden adatot!';
                setTimeout(()=>{document.getElementById('error').style.display='none'},2000);
                return
                        }
    
        if(document.querySelector('.new-event-container').classList.contains('editing')){
         
            let currentEventRow  = document.querySelector('.editable-row');
            calendar.editableDate.editEvent(calendar.editableDate.getData(),currentEventRow);
            document.querySelector('.new-event-container').classList.remove('editing');
            
        }else{
        let newEvent = calendar.editableDate.getData(); //változás!!!!!
        calendar.editableDate.addEvent(newEvent);
        
        newEvent.saveToLocalStorage();
    
    }
        document.querySelector('#eventname').value='';
        document.querySelector('#eventperiod').value='';
        calendar.draw()
        calendar.displayEvents(calendar.editableDate.getFullDate());
    }
    
     handleCancelClickEvent(){
         
        document.querySelector('#eventname').value='';
        document.querySelector('#eventperiod').value='';
        document.querySelector('.new-event-container').style.display='none';
    }
    
     handleDeleteEvent(event,calendar) {
        let currentElemList = event.target.closest('.row').children;
        if (calendar.editableDate.eventList.length === 1) {
            
            calendar.editableDate.deleteEvent(calendar.editableDate.eventList[0]);
            event.target.closest('.row').remove();
            return;
        }
    
        calendar.editableDate.eventList.forEach((elem)=>{
            if (elem.name === currentElemList[0].textContent &&
                elem.period === currentElemList[1].textContent) {
                    
                    calendar.editableDate.deleteEvent(elem);
                    event.target.closest('.row').remove();
                }
        }) 
    }
    
     handleEditEvent (event) {
         
        document.querySelector(".new-event-container").style.display='block';
        document.querySelector('.new-event-container').classList.add('editing');
        event.target.closest('.row').classList.add('editable-row');
    }
    
    mainScript(){
        let monthSelector = document.querySelector('#monthChoose');
        let yearSelector = document.querySelector('#year');
        let addingEventButton= document.querySelector(".add-event");
        yearSelector.value='2019';
        monthSelector.value='9'; 
        let calendar= new Calendar();
        calendar.draw(); 
    
        monthSelector.addEventListener('change',function(event){
    
            console.clear(); 
            
            calendar.redraw(); 
            
        })
    
        document.addEventListener('click',(event)=>{
            
            if (event.target.classList.contains('fas')) {
                calendar.handlePaginateEvent(event);}
           
            if (event.target.classList.contains('day-col')){
                
                this.handleDayClick(event, calendar); 
               
            }
           
            if(event.target === addingEventButton && calendar.editableDate){
                document.querySelector(".new-event-container").style.display='block';
            }
    
            if (event.target === document.getElementById('ok')){
                this.handleOkClickEvent(event,calendar);
            }
    
            if(event.target===document.getElementById('cancel')){
               this.handleCancelClickEvent();
            }
    
            if(event.target.classList.contains('fa-calendar-times')){   // ezt tesztelni az új functionok fényében
                this.handleDeleteEvent(event,calendar);
            }
    
            if(event.target.classList.contains('fa-edit')){
                this.handleEditEvent(event);
              
            }
        })
    } 
}

let main = new Main();
main.mainScript(); 

