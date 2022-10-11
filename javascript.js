const screenInput = document.querySelector("#screenInput"); //Initialize variables for output screens
const screnResult = document.querySelector("#screnResult");

const numberButtons = document.querySelectorAll("button");  //Initialize array for all buttons, values read from HTML contents

activateButtons();

function activateButtons() {    //Add event listeners for each button

    numberButtons.forEach((button) =>
    button.addEventListener("click", (e) => {
    if (button.innerHTML == "CLEAR") {  //Empty the input field if CLEAR is pressed
        screenInput.innerHTML = "";
        return;
    }
    if (button.innerHTML == "DELETE") { //Remove the last element from input field, if DELETE is pressed
        screenInput.innerHTML = screenInput.innerHTML.slice(0, -1);
        return;
    }
    if (screenInput.innerHTML[screenInput.innerHTML.length-1] == "=") { //Empty the input field if new data is entered and the last char is =
        screenInput.innerHTML = "";
    }
    if (button.innerHTML == "=") {  //Perform calculations if = is pressed and if input field's content is suitable
        if (calculate() || calculate()==0) {
            screnResult.innerHTML = calculate();  //Result of calculations is shown on screen
        }
        else screnResult.innerHTML = "ERROR"    //In case of returned false show ERROR
    }
    screenInput.innerHTML = screenInput.innerHTML + button.innerHTML    //If nothing of above simply add contents of a button to the input field
    }
        )
    ) 

}



function calculate() {  //Perform calculations and return results of it as number, else return false
    
    const equation = parseString(screenInput.innerHTML);    //Build array for calculations out of data in input field
    let result = 0;
    let var1 = 0;
    let var2 = 0;

    if (equation.length==1) return Math.round((+equation[0] + Number.EPSILON) * 10000) / 10000; //If only single number in equation, return it as result

    for (let element in equation) { //Hadnle multiplication and division
        +element++                  //Go to the operator
        switch (equation[element]) {
            case "*":
                var1 = (+equation[+element-1]);
                var2 = (+equation[+element+1]);
                equation.splice(element-1, 3, var1*var2);
                break;
            case "/":
                var1 = (+equation[+element-1]);
                var2 = (+equation[+element+1]);
                equation.splice(element-1, 3, var1/var2);
                break;   
            default:
                break;
        }
    }

    for (let element in equation) { //Handle addition and subtraction
        +element++                  //Go to the operator
        switch (equation[element]) {
            case "+":
                var1 = (+equation[+element-1]);
                var2 = (+equation[+element+1]);
                equation.splice(element-1, 3, var1+var2);
                break;
            case "-":
                var1 = (+equation[+element-1]);
                var2 = (+equation[+element+1]);
                equation.splice(element-1, 3, var1-var2);
                break;
            default:
                break;
        }
    }

    return Math.round((equation[0] + Number.EPSILON) * 10000) / 10000;  //Return the result

}

function parseString(string) {  //Build array for calculations out of data in input field
    const equation = [];        //Final equation array
    let index = 0;             //Index for final equation array

    for (let i = 0; i < string.length; i++) {   //Process the string
        if(+string[i] || +string[i] == 0) {                //If char is number
            if (equation[index] == undefined) equation[index] = "";     //If current element is undefined, set to empty string
            equation[index] = equation[index] + string[i];              //Attach number to it
            continue;                                                   //Continue to the next step of the loop without increasing index
        }
        if (equation.length == 0) {                                     //If the first element is not a number, return false
            return false;
        }

        index++;    //Move to fill the next element
        
        if (+equation[index-1] || +equation[index-1] == 0) {    //Ensure previous element is a string
            equation[index] = string[i];                        //Assign operator sign to the current element of array
            index++;
            continue;
        }
        else {  //False if previous is operator as well
            return false;
        }
        
    }

    return mergeFloatingNumbers(equation);  //Return the equation array, but with floating point numbers properly arranged
}

function mergeFloatingNumbers(array) {  //Arrange floating point numbers

    for(let element in array) {
        if (array[+element]==".") {                                                 //Find a dot
            if (array[+element-2]=="." || array[+element+2]==".") return false;     //Return false if second neighbor is the dot too
            if (!(+array[+element-1]) || !(+array[+element+1])) {
                if (!(+array[+element-1]!=0 || +array[+element+1]!=0)) {
                    return false;                                                   //Return false if neighbors are not numbers
                }
            } 
            array.splice(+element-1, 3, array[+element-1] + array[+element] + array[+element+1]);   //Merge three elements in one floating point number
            +element--;
        }
    }

    return array;

}