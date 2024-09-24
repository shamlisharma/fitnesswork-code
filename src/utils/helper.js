export const dayNamefromDay=(day)=>{

    switch (day) {
        case "Monday":
            return "Day 1"
        case "Tuesday":
            return "Day 2"
        case "Wednesday":
            return "Day 3"
        case "Thursday":
            return "Day 4"
        case "Friday":
            return "Day 5"
        case "Saturday":
            return "Day 6"
        case "Sunday":
            return "Day 7"
            
    
        default:
            return day
    }
}
export const fromDayToDayName=(day)=>{
console.log({day});
    switch (day) {
        
        case 2:
            return "Mo"
        case 3:
            return "Tu"
        case 4:
            return "We"
        case 5:
            return "Th"
        case 6:
            return "Fr"
        case 7:
            return "Sa"
        case 1:
            return "Su"
            
    
        default:
            return day
    }
}

export function getCurrentWeek(current=new Date()) {
    var week= new Array(); 
    // Starting Monday not Sunday
    current.setDate((current.getDate() - current.getDay() +1));
    for (var i = 0; i < 7; i++) {
        week.push(
            new Date(current).toISOString()
        ); 
        current.setDate(current.getDate() +1)
    }
    return week; 
}
export const kgToLbs=(value,unit)=>{
    if(unit==="LBS"){
        return (value*2.2).toFixed()
    }
    else return Number(value).toFixed()
}
export const LbsToKg=(value,unit)=>{
    if(unit==="LBS"){
        return (Number(value)*0.45359237)
    }
    else return Number(value)
}

export const secondsToTime=(time=0)=>{
    const minutes = Math.floor(time / 60);

const seconds = time - minutes * 60;

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

const finalTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
return finalTime
}