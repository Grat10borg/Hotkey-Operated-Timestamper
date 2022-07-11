/** the youtube connection also needs to be updated for security reasons */

/** Copies specific text areas and makes eventhandler for copy btns */
var Copy = document.querySelectorAll(".Copy");
for (let i = 0; i < Copy.length; i++) {
    Copy[i].addEventListener(
        "click",
        function(event) {
            copyText(event);
        },
        true
    );
}

function copyText(event) : void {
    console.log(event.target.value);
    var num = event.target.value;
    var copyText = document.getElementById(`myInput${num}`) as HTMLInputElement; // HTMLINPUTELEMENT does have the .select() method, the normal HtmlElement doesnt have it

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
}

// Makes Events for all Select btns and selects the correct text areas
let Select = document.querySelectorAll(".Select");
for (let i = 0; i < Select.length; i++) {
    Select[i].addEventListener(
        "click",
        function(event) {
            SelectText(event);
        },
        true
    );
}

function SelectText(event) : void {
    /* Get the text field */
    console.log(event.target.value);
    var num = event.target.value;
    var selectText = document.getElementById(`myInput${num}`) as HTMLInputElement;

    /* Select the text field */
    selectText.select();
    selectText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(selectText.value);
}

// Make btn event for Clearing button, only makes an alert
const Clear = document.querySelector(".Clear");
Clear?.addEventListener(
    "click",
    function() {
        alert("Clearing Timestamps");
    },
    true
);


let Textarea = document.querySelectorAll(".Textarea"); // gets array of Textarea elements
for (let i = 0; i < Textarea.length; i++) {
    Textarea[i].addEventListener("keyup", function(event) {
        let Charcount = CalcChars(event);
        let p = document.querySelector(`#CharCount${i}`) as HTMLElement;
        p.textContent = Charcount;
        
        // test by regex on if it contains Illigal Chars

        if (Charcount > 5000) {
            // timestamps likely wont work, and its over the Maximum the youtube description can handle
            p.setAttribute("class", "CharaRed");
        } else if (Charcount > 3000) {
            // timestamps may stop working. thumbnails may also lose graphics at this/a bit under size too
            p.setAttribute("class", "CharaYellow");
        } else {
            // become green, Prime Timestamp range.
            p.setAttribute("class", "CharaGreen");
        }
        //console.log(p);
    });
}

// make only once. then let the evenhandler do the rest of the work
let StartTextarea:any = document.querySelectorAll(".Textarea");
for (let i = 0; i < StartTextarea.length; i++) {
    let Charcount = StartTextarea[i].value;
    let p = document.querySelector(`#CharCount${i}`) as HTMLElement; // needs to be html element
    p.textContent = Charcount.length;
    if (Charcount > 5000) {
        // timestamps likely wont work, and its over the Maximum the youtube description can handle
        p.setAttribute("class", "CharaRed");
    } else if (Charcount > 3000) {
        // timestamps may stop working. thumbnails may also lose graphics at this/a bit under size too
        p.setAttribute("class", "CharaYellow");
    } else {
        // become green, Prime Timestamp range.
        p.setAttribute("class", "CharaGreen");
    }
}

function CalcChars(event) : any {
    let string = event.target.value;
   // console.log(string.length);
    return string.length;
}