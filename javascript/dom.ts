
// Shorthand Dom versions
const $ = document;
const $$ = {
dom: document,

// document methods
id: $.getElementById.bind($),
class: $.getElementsByClassName.bind($),
make: $.createElement.bind($),
query: $.querySelector.bind($),
query_all: $.querySelectorAll.bind($),

// custome methods bellow this
txt: fetchTXT.bind($), //async
btnchar: AddBTNCharcounters.bind($),

// just here to help me out when working.
log: console.log,
} 

// // Code methods custome

// a little wonky but the response promise did not want to play along..
async function fetchTXT(Url:string) {
  await fetch(Url)
  .then(response => response.text())
  .then((txt) => {    
    //return txt;
    let textarea = $$.make("textarea");
    textarea.textContent = txt;
    textarea.id = Url;
    textarea.hidden = true;
    $.body.append(textarea);
  })
  let text = $$.id(Url).innerHTML;
  $$.id(Url).outerHTML = ""; // remove textarea again
  return text;
}

// should only be ran once everything else is complete.
function AddBTNCharcounters() {
  // ALL the text areas on the page.
  let StartTextareas = $$.query_all(".Charcounts") as NodeListOf<HTMLTextAreaElement>;
  let Select = $$.query_all(".Select") as NodeListOf<HTMLElement>;
  let Copy = $$.query_all(".Copy") as NodeListOf<HTMLElement>;
  let Clear = $$.query(".Clear") as HTMLElement; // gets clear button if it's there

  // Add Selectbutton Events
  for (let i = 0; i < Select.length; i++) {
  Select[i].addEventListener("click", function (event: any) {
  StartTextareas[event.target.value].select(); /* Select the text field */
  StartTextareas[event.target.value].setSelectionRange(0, 99999); /* For mobile devices */
  navigator.clipboard.writeText(StartTextareas[event.target.value].value); /* Select the text inside the text field */
  },true);}

  // Add Copybutton Events
  for (let i = 0; i < Copy.length; i++) {
  Copy[i].addEventListener("click", function (event: any) {
  StartTextareas[event.target.value].select(); /* Select the text field */
  StartTextareas[event.target.value].setSelectionRange(0, 99999); /* For mobile devices */
  navigator.clipboard.writeText(StartTextareas[event.target.value].value);/* Copy the text inside the text field */
  },true);}
  
  // Add Character Limitor
  for (let i = 0; i < StartTextareas.length; i++) {
    let p = $$.query(`#CharCount${i}`) as any;
    // pre-event handler values
    p.innerHTML = StartTextareas[i].innerHTML.length;
    if (StartTextareas[i].innerHTML.length > 5000)  p.setAttribute("class", "CharaRed");
    else if (StartTextareas[i].innerHTML.length > 3000) p.setAttribute("class", "CharaYellow");
    else p.setAttribute("class", "CharaGreen");
    
    StartTextareas[i].addEventListener("keyup", function (event: any) {
    p.textContent = event.target.value.length;

    // test by regex on if it contains Illigal Chars
    
    if (event.target.value.length > 5000) p.setAttribute("class", "CharaRed"); // timestamps likely wont work, and its over the Maximum the youtube description can handle
    else if (event.target.value.length > 3000) p.setAttribute("class", "CharaYellow"); // timestamps may stop working. thumbnails may also lose graphics at this/a bit under size too
    else p.setAttribute("class", "CharaGreen"); // become green, Prime Timestamp range.
    });
  }

   // Add ClearButton event. (desc-maker only)
  if (Clear != null) { // Make btn event for Clearing button, only makes an alert
    Clear.addEventListener("click",function () {alert("Clearing Timestamps");window.location.href = "clear.php";},true);
  }
}