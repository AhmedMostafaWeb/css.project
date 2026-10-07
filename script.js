/*
===========================
     JavaScript Topics
===========================


JavaScript Basics

- ✅ window.alert()
- ✅ document.write()
- ✅ console.log()
- ✅ console.error()
- ✅ console.table()
- ✅ %c لتغيير لون النص في الـ Console
- ✅ Variables
- ✅ let / var
- ✅ الفرق بين اسم المتغير وقيمة المتغير
- ✅ typeof
  - String
  - Number
  - Decimal Number
  - Array
  - Object
  - Boolean
  - Undefined
  - Null
- ✅ Escape Character
- ✅ Escape Character + "\n"


===========================
          Number
===========================

- ✅ toString()
- ✅ toFixed()
- ✅ Number()
- ✅ parseInt()
- ✅ parseFloat()
- ✅ Number.isInteger()
- ✅ Number.isNaN()


===========================
           Math
===========================

- ✅ Math.round()
- ✅ Math.ceil()
- ✅ Math.floor()
- ✅ Math.min()
- ✅ Math.max()
- ✅ Math.pow()
- ✅ Math.random()
- ✅ Math.trunc()


===========================
          String
===========================

- ✅ Index
- ✅ charAt()
- ✅ length
- ✅ trim()
- ✅ toUpperCase()
- ✅ toLowerCase()
- ✅ Chain
- ✅ indexOf()
- ✅ lastIndexOf()
- ✅ repeat()
- ✅ slice()
- ✅ zfill()
- ✅ substring()
- ✅ substr()
- ✅ includes()
- ✅ startsWith()
- ✅ endsWith()


===========================
   Comparison Operators
===========================

- ✅ Equal (==)
- ✅ Not Equal (!=)
- ✅ Identical (===)
- ✅ Not Identical (!==)
- ✅ Greater Than (>)
- ✅ Less Than (<)
- ✅ Greater Than Or Equal (>=)
- ✅ Less Than Or Equal (<=)


===========================
     Logical Operators
===========================

- ✅ NOT (!)
- ✅ AND (&&)
- ✅ OR (||)


===========================
        Conditions
===========================

- ✅ Condition / true / false
- ✅ if
- ✅ else
- ✅ else if


===========================
          Array
===========================

- ✅ shift()
- ✅ push()
- ✅ unshift()
- ✅ pop()
- ✅ indexOf()
- ✅ lastIndexOf()
- ✅ includes()
- ✅ sort()
- ✅ reverse()
- ✅ slice()
- ✅ splice()
- ✅ join()
- ✅ concat()

*/


// جزء الـ Variables والـ console.log

console.log("coffee house");

let coffeename = "clasic coffee";
let price = 5;

console.log(coffeename);
console.log(price);


let coffeename2 = "espreso";
let price2 = 4;

console.log(coffeename2);
console.log(price2);


// جزء الـ Array + Loop + if / else if / else
// وربط اسم المنتج بالسعر عن طريق الـ index

{
  let coffeenames = ["clasic coffee ", "espresso", "captsheno", "latta"];
  let price = [5, 4, 7, 9];
  let search = "coffee";

  for (let i = 0; i < coffeenames.length; i++) {

    if (coffeenames[i] === "espresso") {
      console.log(coffeenames[i].toUpperCase(), price[i]);
    }

    else if (coffeenames[i] === "captsheno") {
      console.log("found captsheno ".toLowerCase());
    }

    else {
      console.log("not espresso & captsheno");
    }
  }
}


// جزء البحث داخل الـ Array باستخدام includes()
// هنا بندور على كلمة coffee داخل أسماء المنتجات

{
  let coffeenames = ["clasic coffee ", "espresso", "captsheno", "latta"];
  let price = [5, 4, 7, 9];
  let search = "coffee";

  for (let i = 0; i < coffeenames.length; i++) {

    if (coffeenames[i].includes(search)) {
      console.log(coffeenames[i], price[i]);
    }
  }
}


// جزء البحث عن Espresso باستخدام includes()

{
  let coffeenames = ["clasic coffee ", "espresso", "captsheno", "latta"];
  let price = [5, 4, 7, 9];
  let search = "espresso";

  for (let i = 0; i < coffeenames.length; i++) {

    if (coffeenames[i].includes(search)) {
      console.log(coffeenames[i], price[i]);
    }
  }
}


// جزء البحث عن Captsheno باستخدام includes()

{
  let coffeenames = ["clasic coffee ", "espresso", "captsheno", "latta"];
  let price = [5, 4, 7, 9];
  let search = "captsheno";

  for (let i = 0; i < coffeenames.length; i++) {

    if (coffeenames[i].includes(search)) {
      console.log(coffeenames[i], price[i]);
    }
  }
}


//                Number                //

// toString
{
  let price = 5;
  price.toString();
  console.log(typeof price.toString()); // للتأكد إنه اتحول
}

// toFixed
{
  let price = 59.3443;
  console.log(price.toFixed(2));
}

// Number
{
  let price = "20";
  console.log(Number(price));
}

// parseInt
{
  let price = 40.9839298;
  console.log(parseInt(price));
}

// Number.isInteger
{
  let price = 65;
  console.log(Number.isInteger(price));
}

// Number.isNaN
{
  let price = "ahmed";
  console.log(Number.isNaN(Number(price)));
}


//                                MATH                       //

// Math.round
{
  let price = 4.6;
  console.log(Math.round(price));
}

// Math.ceil
{
  let price = 4.6;
  console.log(Math.ceil(price));
}

// Math.floor
{
  let price = 4.6;
  console.log(Math.floor(price));
}

// Math.min
{
  let price = [5, 4, 7, 9];

  console.log(Math.min(5, 4, 7, 9));
}

// Math.max
{
  let price = [5, 4, 7, 9];

  console.log(Math.max(5, 4, 7, 9));
}

// Math.pow
{
  console.log(Math.pow(2, 4));
}

// Math.random
{
  console.log(Math.random());
}

// Math.trunc
{
  let price = 4.78;
  console.log(Math.trunc(price));
}


//                         STRING                 //

// Index
{
  let coffee = "coffee";

  console.log(coffee[0]);
  console.log(coffee[1]);
  console.log(coffee[2]);
  console.log(coffee[3]);
  console.log(coffee[4]);
  console.log(coffee[5]);
}

// length
{
  let coffee = "coffee";
  console.log(coffee.length);
}

// trim
{
  let coffee = "  coffee  ";
  console.log(coffee.trim());
}

// toUpperCase
{
  let coffee = "coffee";
  console.log(coffee.toUpperCase());
}

// toLowerCase
{
  let coffee = "coffee";
  console.log(coffee.toLowerCase());
}

// Chain
{
  let coffee = "   coffee   ";
  console.log(coffee.trim().toUpperCase());
}

// indexOf
{
  let coffee = "coffee house";

  console.log(coffee.indexOf("house"));
  console.log(coffee.indexOf("h"));
  console.log(coffee.indexOf("f"));
}

// lastIndexOf
{
  let coffee = "coffee coffee";

  console.log(coffee.lastIndexOf("coffee"));
}

// repeat
{
  let coffee = "   coffee   ";

  console.log(coffee.repeat(2));
}

// slice, substring
{
  let coffee = "coffee kill ";

  console.log(coffee.slice(6, 11));
  console.log(coffee.slice(0, 6));
  console.log(coffee.substring(6, 11));
  console.log(coffee.substring(0, 6));
}

// includes
// جزء البحث عن Latta باستخدام includes()

{
  let coffeenames = ["clasic coffee ", "espresso", "captsheno", "latta"];
  let price = [5, 4, 7, 9];
  let search = "latta";

  for (let i = 0; i < coffeenames.length; i++) {

    if (coffeenames[i].includes(search)) {
      console.log(coffeenames[i], price[i]);
    }
  }
}


// جزء البحث باستخدام startsWith()
// بنشوف هل اسم المنتج بيبدأ بالنص اللي موجود في search ولا لأ

{
  let coffeenames = ["clasic coffee", "espresso", "captsheno", "latta"];
  let price = [5, 4, 7, 9];
  let search = "clasic coffee";

  for (let i = 0; i < coffeenames.length; i++) {

    if (coffeenames[i].startsWith(search)) {
      console.log(coffeenames[i], price[i]);
    }
  }
}


// جزء البحث باستخدام endsWith()
// بنشوف هل اسم المنتج بينتهي بالنص اللي موجود في search ولا لأ

{
  let coffeenames = ["clasic coffee", "espresso", "captsheno", "latta"];
  let price = [5, 4, 7, 9];
  let search = "latta";

  for (let i = 0; i < coffeenames.length; i++) {

    if (coffeenames[i].endsWith(search)) {
      console.log(coffeenames[i], price[i]);
    }
  }
}


//                                             ARRAY                                                                //

{
  let coffeenames = ["coffee", "latta", "capthsano", "nescafa", "tea", "milk"];

  console.log(coffeenames.shift());

  console.log(coffeenames.unshift("black"));

  console.log(coffeenames.push("milk check"));

  console.log(coffeenames.pop());

  console.log(coffeenames.sort());

  console.log(coffeenames.reverse());

  console.log(coffeenames.slice(1, 3));

  // حذف
  console.log(coffeenames.splice(0, 1));

  // إضافة
  coffeenames.splice(1, 0, "mocha");
  console.log(coffeenames);

  console.log(coffeenames.join(" @ "));

  // concat دمج 2
  console.log(coffeenames.concat("ahmed", "mahmed"));
}


//                FUNCTION                      //

{
  // السؤال: اكتب Function عادية لا تستقبل أي بيانات، وتطبع رسالة ترحيب.

  function welcome() {
    console.log("welcome yosef");
  }

  welcome();
}


{
  // السؤال: اكتب Function تستقبل اسم كـ Parameter، وتطبع رسالة ترحيب بالاسم.

  function welcome(username) {
    console.log("hello" + username);
  }

  welcome("yosef");
}


{
  // السؤال: اكتب Function تستقبل العمر كـ Parameter، وتطبع العمر.

  function showage(age) {
    console.log("your are is" + age);
  }

  showage(20);
}


{
  // السؤال: اكتب Function تستقبل اسم وعمر، وتطبع كل واحد منهم في سطر منفصل.

  function personinfo(username, age) {
    console.log("name " + username);
    console.log("age " + age);
  }

  personinfo("yossef", 22);
}


{
  // السؤال: اكتب Function تستقبل رقمين، وتجمعهما وتطبع الناتج.

  function calculate(num1, num2) {
    console.log(num1 + num2);
  }

  calculate(4, 3);
}


{
  // السؤال: اكتب Function تستقبل رقمين، وتضربهما باستخدام return، ثم خزّن الناتج في متغير واطبعه.

  function multable(num1, num2) {
    return num1 * num2;
  }

  let result = multable(6, 4);
  console.log(result);
}


{
  // السؤال: اكتب Function تستقبل السعر والخصم، وتستخدم return لإرجاع نتيجة العملية، ثم خزّن الناتج واطبعه.

  function calculaterprice(price, descount) {
    return descount - price;
  }

  let result = calculaterprice(100, 20);
  console.log(result);
}


{
  // السؤال: اكتب Function تستقبل رقمًا، إذا كان الرقم أكبر من أو يساوي 10 تطبع "Big Number"،
  // وإذا كان أقل من 10 تطبع "Small Number".

  function checknumper(age) {

    if (age >= 10) {
      console.log("big numper");
    }

    else {
      console.log("small numper");
    }
  }

  checknumper(10);
}


{
  // السؤال: اكتب Function تستخدم for وتطبع الأرقام الزوجية من 2 إلى 10.

  function printevennumpers() {

    for (let i = 2; i <= 10; i += 2) {
      // i += 2 بتزود اتنين كل مرة عشان تبقى زوجي

      console.log(i);
    }
  }

  printevennumpers();
}


// السؤال: اكتب Function اسمها showCoffees تستقبل Array فيها أسماء مشروبات،
// وتطبع كل عنصر موجود داخل الـArray.

{
  function showcoffees(names) {

    for (let i = 0; i < names.length; i++) {
      console.log(names[i]);
    }
  }

  let namecoffee = ["coffee", "latta", "captshno", " espreso"];

  showcoffees(namecoffee);
}


// السؤال: اكتب Function تستقبل اسمًا كنص،
// وتتحقق هل الاسم يحتوي على الحرف "a" أم لا.
// إذا كان موجودًا اطبع "Found"
// وإذا لم يكن موجودًا اطبع "Not Found".

{
  function vcname(name) {

    if (name.includes("A")) {
      console.log("found");
    }

    else {
      console.log("not found");
    }
  }

  vcname("Ahmed");
}


/*
  شرح أوامر الـ DOM
  =========================


  أولًا: التعامل مع محتوى العنصر
  =========================

  innerHTML
  بتستخدمها عشان تجيب المحتوى الموجود جوه العنصر أو تغيّره.
  وبتفهم أكواد HTML اللي بتحطها جوه المحتوى.
  يعني لو كتبت وسم معين، هيتعامل معاه كعنصر حقيقي.


  textContent
  بتستخدمها عشان تجيب النص الموجود جوه العنصر أو تغيّره.
  ولو كتبت كود HTML جوه النص، هيتعامل معاه على إنه كلام عادي،
  ومش هيحوّله لعنصر.


  innerText
  بتستخدمها عشان تتعامل مع النص الظاهر للمستخدم جوه العنصر.
  يعني بتركّز على الكلام اللي ظاهر فعلًا في الصفحة.



  ثانيًا: التعامل مع صفات العنصر
  =========================

  getAttribute
  بتستخدمها عشان تجيب قيمة صفة معينة موجودة في العنصر.
  يعني لو العنصر عنده صفة معينة، تقدر تعرف القيمة الموجودة فيها.


  setAttribute
  بتستخدمها عشان تغيّر قيمة صفة موجودة،
  أو تضيف صفة جديدة للعنصر لو الصفة دي مش موجودة.


  attributes
  بتجيب كل الصفات الموجودة في العنصر مرة واحدة.
  يعني بدل ما تسأل عن كل صفة لوحدها،
  بتجيبلك جميع الصفات الموجودة في العنصر.


  hasAttribute
  بتسأل هل العنصر عنده صفة معينة ولا لأ.
  يعني بتحدد صفة واحدة وتسأل:
  هل الصفة دي موجودة؟
  لو موجودة النتيجة بتكون صحيح،
  ولو مش موجودة النتيجة بتكون خطأ.


  hasAttributes
  بتسأل هل العنصر عنده أي صفات أصلًا ولا لأ.
  هنا مش بتحدد صفة معينة،
  إنت بس بتسأل هل العنصر عليه صفات أم لا.


  removeAttribute
  بتستخدمها عشان تحذف صفة معينة من العنصر.
  يعني لو فيه صفة موجودة على العنصر،
  تقدر تشيلها بالكامل.



  ثالثًا: إنشاء حاجات جديدة
  =========================

  createElement
  بتستخدمها عشان تعمل عنصر جديد من خلال جافاسكريبت.
  يعني تقدر تعمل فقرة جديدة،
  أو زرار جديد،
  أو حاوية جديدة،
  من غير ما تكون كاتبها من البداية في صفحة HTML.


  createComment
  بتستخدمها عشان تعمل تعليق جديد من خلال جافاسكريبت.
  يعني تعمل تعليق زي التعليقات اللي بنكتبها في صفحة HTML.


  createTextNode
  بتستخدمها عشان تعمل نص جديد من خلال جافاسكريبت.
  وبعد كده تقدر تحط النص ده جوه عنصر معين.


  createAttribute
  بتستخدمها عشان تعمل صفة جديدة من خلال جافاسكريبت.
  يعني تقدر تنشئ صفة جديدة وبعدين تربطها بعنصر.



  رابعًا: إضافة حاجة داخل حاجة
  =========================

  appendChild
  بتستخدمها عشان تضيف حاجة جوه عنصر تاني.
  يعني لو عملت عنصر جديد،
  تقدر تحطه جوه عنصر موجود بالفعل.



  خامسًا: الحاجات الموجودة جوه العنصر
  =========================

  children
  بتجيب العناصر الموجودة جوه العنصر.
  يعني بتجيب العناصر نفسها فقط،
  ومبتجيبش النصوص أو التعليقات.


  childNodes
  بتجيب كل الحاجات الموجودة جوه العنصر.
  يعني ممكن تجيب العناصر،
  وممكن تجيب النصوص،
  وممكن تجيب التعليقات.


  firstChild
  بتجيب أول حاجة موجودة جوه العنصر.
  وممكن تكون عنصر،
  أو نص،
  أو تعليق.


  lastChild
  بتجيب آخر حاجة موجودة جوه العنصر.
  وممكن تكون عنصر،
  أو نص،
  أو تعليق.


  firstElementChild
  بتجيب أول عنصر موجود جوه العنصر.
  وبتتجاهل النصوص والتعليقات.


  lastElementChild
  بتجيب آخر عنصر موجود جوه العنصر.
  وبتتجاهل النصوص والتعليقات.



  الفرق المهم بينهم
  =========================

  children
  = العناصر الموجودة جوه العنصر فقط.


  childNodes
  = كل الحاجات الموجودة جوه العنصر.


  firstChild
  = أول حاجة موجودة جوه العنصر.


  firstElementChild
  = أول عنصر موجود جوه العنصر.


  lastChild
  = آخر حاجة موجودة جوه العنصر.


  lastElementChild
  = آخر عنصر موجود جوه العنصر.
*/

// DOM 86 //
{
    /*
      DOM Selectors

      1) getElementById
      2) getElementsByTagName
      3) getElementsByClassName
      4) querySelector
      5) querySelectorAll
      6) document.title
      7) document.body
      8) document.forms
      9) document.links
    */


    // 1) Find Element By ID
    let myIdElement = document.getElementById("dom86-div");

    console.log(myIdElement);


    // 2) Find Elements By Tag Name
    let myTagElements = document.getElementsByTagName("p");

    console.log(myTagElements[0]);
    console.log(myTagElements[1]);
    console.log(myTagElements[2]);


    // 3) Find Elements By Class Name
    let myClassElements = document.getElementsByClassName("dom86-span");

    console.log(myClassElements[0]);
    console.log(myClassElements[1]);
    console.log(myClassElements[2]);


    // 4) Find Element By CSS Selector
    let myQueryElement = document.querySelector(".dom86-span");

     console.log(myQueryElement);


    
    // 6) Get Page Title
    console.log(document.title);


    // 7) Get Body
    console.log(document.body);


    // 8) Get First Form And Input Value
    console.log(document.forms[0].one.value);


    // 9) Get Second Link
    console.log(document.links[1].href);
}


// DOM 87 //
{
    /*
      DOM [Get / Set Elements Content And Attributes]

      - innerHTML
      - textContent
      - Change Attributes Directly
      - Change Attributes With Methods
      --- getAttribute
      --- setAttribute

      Search
      - innerText
    */


    // Get Element
    let myElement = document.querySelector(".dom87-js");


    // Get Content
    console.log(myElement.innerHTML);
    console.log(myElement.textContent);


    // Set Content
    myElement.innerHTML = "Text From <span>Main.js</span> File";

   myElement.textContent = "Text From <span>Main.js</span> File";

    // Change Image Attributes Directly
    
document.images[0].src = "https://placehold.co/500x300";
document.images[0].alt = "Alternate";
document.images[0].title = "Picture";
document.images[0].id = "pic";
document.images[0].className = "img";
    // Get Link
    let myLink = document.querySelector(".dom87-link");


    // Get Attributes
    console.log(myLink.getAttribute("class"));
    console.log(myLink.getAttribute("href"));


    // Set Attributes
    myLink.setAttribute("href", "https://twitter.com");
    myLink.setAttribute("title", "Twitter");
}


// DOM 88 //
{
    /*
      DOM [Check Attributes]

      - Element.attributes
      - Element.hasAttribute
      - Element.hasAttributes
      - Element.removeAttribute
    */


    // 1) attributes
    console.log(document.querySelector(".dom88-p").attributes);


    // Get The P Element
    let myP = document.querySelector(".dom88-p");


    // 2) hasAttribute
    if (myP.hasAttribute("data-src")) {

        if (myP.getAttribute("data-src") === "") {

            myP.removeAttribute("data-src");

        } else {

            myP.setAttribute("data-src", "New Value");

        }

    } else {

        console.log(`Not Found`);
    }


    // 3) hasAttributes
    if (myP.hasAttributes()) {

        console.log(`Has Attributes`);

    }


    // Check Div Attributes
    if (document.getElementById("dom88-div").hasAttributes()) {

        console.log(`Has Attributes`);

    } else {

        console.log(`Div Has No Attributes`);
    }
}
//DOM 89//
{
  /*
  DOM [Create Elements]
  - createElement
  - createComment
  - createTextNode
  - createAttribute
  - appendChild
*/

let myElement = document.createElement("div");
let myAttr = document.createAttribute("data-custom");
let myText = document.createTextNode("Product One");
let myComment = document.createComment("This Is Div");

myElement.className = "product";
myElement.setAttributeNode(myAttr);
myElement.setAttribute("data-test", "Testing");

// Append Text To Element
myElement.appendChild(myText);



// Append Comment To Element
myElement.appendChild(myComment);


// Append Element To Body
document.body.appendChild(myElement);
}
//dom 90//
{
  /*
  DOM [Create Elements]
  - Practice Product With Heading And Paragraph
*/

let myMainElement = document.createElement("div");
let myHeading = document.createElement("h2");
let myParagraph = document.createElement("p");

let myHeadingText = document.createTextNode("Product Title");
let myParagraphText = document.createTextNode("Product Description");

// Add Heading Text
myHeading.appendChild(myHeadingText);

// Add Heading To Main Element
myMainElement.appendChild(myHeading);

// Add Paragraph Text
myParagraph.appendChild(myParagraphText);

// Add Paragraph To Main Element
myMainElement.appendChild(myParagraph);

myMainElement.className = "product";

document.body.appendChild(myMainElement);
}

//dom 91 //
{
  /*
  DOM [Deal With Childrens]
  - children
  - childNodes
  - firstChild
  - lastChild
  - firstElementChild
  - lastElementChild
*/

let myElement = document.querySelector("div");

console.log(myElement);
console.log(myElement.children);
console.log(myElement.children[0]);
console.log(myElement.childNodes);
console.log(myElement.childNodes[0]);

console.log(myElement.firstChild);
console.log(myElement.lastChild);

console.log(myElement.firstElementChild);
console.log(myElement.lastElementChild);
}
//dom 92 //
{
  /*
  DOM [Events]
  - onclick       = عند الضغط على العنصر
                    بيشتغل لما تضغط على العنصر.

  - oncontextmenu = عند الضغط بزر الفأرة الأيمن
                    بيشتغل لما تدوس كليك يمين على العنصر.

  - onmouseenter  = عند دخول الفأرة
                    بيشتغل لما الماوس يدخل على العنصر.

  - onmouseleave  = عند خروج الفأرة
                    بيشتغل لما الماوس يخرج من العنصر.


  - onload        = عند اكتمال التحميل
                    بيشتغل لما الصفحة تخلص تحميل.

  - onscroll      = عند التمرير
                    بيشتغل لما تعمل سكرول في الصفحة.

  - onresize      = عند تغيير الحجم
                    بيشتغل لما تغيّر حجم نافذة المتصفح.


  - onfocus       = عند تحديد العنصر
                    بيشتغل لما تدخل وتحدد خانة الكتابة.

  - onblur        = عند فقدان التحديد
                    بيشتغل لما تخرج من خانة الكتابة.

  - onsubmit      = عند إرسال النموذج
                    بيشتغل لما تعمل إرسال للنموذج.
*/


// onclick = عند الضغط على العنصر
let myBtn = document.getElementById("btn");

myBtn.onclick = function () {
    console.log("تم الضغط على الزرار");
};


// oncontextmenu = عند الضغط بزر الفأرة الأيمن
let myBox = document.getElementById("box");

myBox.oncontextmenu = function () {
    console.log("تم الضغط كليك يمين");
};


// onmouseenter = عند دخول الفأرة
myBtn.onmouseenter = function () {
    console.log("الماوس دخل على الزرار");
};


// onmouseleave = عند خروج الفأرة
myBtn.onmouseleave = function () {
    console.log("الماوس خرج من الزرار");
};


// onload = عند اكتمال التحميل
window.onload = function () {
    console.log("الصفحة خلصت تحميل");
};


// onscroll = عند التمرير
window.onscroll = function () {
    console.log("حصل سكرول");
};


// onresize = عند تغيير الحجم
window.onresize = function () {
    console.log("حجم النافذة اتغير");
};


// onfocus = عند تحديد العنصر
let myInput = document.getElementById("name");

myInput.onfocus = function () {
    console.log("الخانة اتحددت");
};


// onblur = عند فقدان التحديد
myInput.onblur = function () {
    console.log("خرجنا من الخانة");
};


// onsubmit = عند إرسال النموذج
let myForm = document.getElementById("myForm");

myForm.onsubmit = function () {
    console.log("الفورم اتبعت");
};
}
//dom 93//
{
  /*
  DOM [Events]
  - Validate Form Practice
  - Prevent Default
*/


document.links[0].onclick = function (event) {

  console.log(event);

  event.preventDefault();
  // تمنع التصرف الطبيعي للحدث
  // هنا تمنع الرابط من فتح الصفحة الموجودة في href
  // يعني لما أضغط على الرابط، مش هينتقل للموقع
};


let userInput = document.querySelector("[name='username']");
let ageInput = document.querySelector("[name='age']");


document.forms[0].onsubmit = function (e) {

  let userValid = false;
  let ageValid = false;


  if (userInput.value !== "" && userInput.value.length <= 10) {
    userValid = true;
  }


  if (ageInput.value !== "") {
    ageValid = true;
  }


  if (userValid === false || ageValid === false) {

    e.preventDefault();
    // تمنع التصرف الطبيعي للحدث
    // هنا تمنع الفورم من الإرسال لو البيانات غير صحيحة

  }

};
}
// dom 94 //
{
  /*
  DOM [Events Simulation]
  - click = ينفّذ أمر عند الضغط على العنصر
  - focus = يجعل العنصر محددًا وجاهزًا للاستخدام
  - blur = يحدث عندما يخرج التركيز من العنصر
*/

let one = document.querySelector(".one");

let two = document.querySelector(".two");

window.onload = function () {
  two.focus();
};
}
//dom 95 //
{
/*
  DOM [Class List]
  - classList = التعامل مع الـ Classes الموجودة على العنصر
  --- length = عدد الـ Classes الموجودة
  --- contains = التحقق هل الـ Class موجود
  --- item(index) = الحصول على الـ Class حسب رقمه
  --- add = إضافة Class
  --- remove = حذف Class
  --- toggle = إضافة Class لو مش موجود، وحذفه لو موجود
*/

let element = document.getElementById("my-div");

console.log(element.classList);
console.log(typeof element.classList);
console.log(element.classList.contains("osama"));
console.log(element.classList.contains("show"));
console.log(element.classList.item("1"));

element.classList.add("show");

console.log(element.classList);

element.classList.remove("show");

console.log(element.classList);}

// dom 96 //
{
/*
  DOM [CSS]
  - style = تغيير تنسيقات العنصر مباشرة
  - cssText = كتابة أكثر من تنسيق مرة واحدة
  - removeProperty(propertyName) = حذف تنسيق معين
  - setProperty(propertyName, value, priority) = إضافة أو تغيير تنسيق مع تحديد الأولوية
*/

let element = document.getElementById("my-div");

element.style.color = "red";
element.style.fontWeight = "bold";

element.style.cssText = "font-weight: bold; color: green; opacity: 0.9";

element.style.removeProperty("color");
element.style.setProperty("font-size", "40px", "important");
}
// dom 97//
{
  /*
  DOM [Deal With Elements]

  - before [Element || String] = إضافة عنصر أو نص قبل العنصر
  - after [Element || String] = إضافة عنصر أو نص بعد العنصر
  - append [Element || String] = إضافة عنصر أو نص في نهاية العنصر
  - prepend [Element || String] = إضافة عنصر أو نص في بداية العنصر
  - remove = حذف العنصر نفسه
*/


// ========================================
// before
// ========================================

let element = document.getElementById("my-div");

let createdP = document.createElement("p");

createdP.textContent = "Before";

element.before(createdP);


// ========================================
// after
// ========================================

let element2 = document.getElementById("my-div");

let createdP2 = document.createElement("p");

createdP2.textContent = "After";

element2.after(createdP2);


// ========================================
// append
// ========================================

let element3 = document.getElementById("my-div");

let createdP3 = document.createElement("p");

createdP3.textContent = "Append";

element3.append(createdP3);


// ========================================
// prepend
// ========================================

let element4 = document.getElementById("my-div");

let createdP4 = document.createElement("p");

createdP4.textContent = "Prepend";

element4.prepend(createdP4);


// ========================================
// remove
// ========================================

let element5 = document.getElementById("my-div");

element5.remove();
}
//dom 98//
{
  /*
  DOM [Traversing]

  - nextSibling = الانتقال إلى العنصر أو الـ Node اللي بعد العنصر
  - previousSibling = الانتقال إلى العنصر أو الـ Node اللي قبل العنصر
  - nextElementSibling = الانتقال إلى العنصر اللي بعد العنصر
  - previousElementSibling = الانتقال إلى العنصر اللي قبل العنصر
  - parentElement = الوصول إلى العنصر الأب
*/


// ========================================
// nextSibling
// ========================================

let span = document.querySelector(".two");

console.log(span.nextSibling);


// ========================================
// previousSibling
// ========================================

let span2 = document.querySelector(".two");

console.log(span2.previousSibling);


// ========================================
// nextElementSibling
// ========================================

let span3 = document.querySelector(".two");

console.log(span3.nextElementSibling);


// ========================================
// previousElementSibling
// ========================================

let span4 = document.querySelector(".two");

console.log(span4.previousElementSibling);


// ========================================
// parentElement
// ========================================

let span5 = document.querySelector(".two");

console.log(span5.parentElement);

span5.onclick = function () {
    span5.parentElement.remove();
};
}







//                      BOM                    //
//  BOM  103//
{
  /*
  BOM [Browser Object Model]

  - alert(Message)
    = عرض رسالة للمستخدم في نافذة منبثقة.
    المستخدم يقدر يضغط OK فقط، ومفيش قيمة بترجع من alert.

  - confirm(Message)
    = عرض رسالة للمستخدم مع اختيارين: OK أو Cancel.
    لو ضغط OK ترجع true.
    لو ضغط Cancel ترجع false.
    نقدر نستخدم القيمة دي في if لاتخاذ قرار.

  - prompt(Message, Default Message)
    = عرض رسالة للمستخدم وطلب منه كتابة بيانات.
    Message = الرسالة التي تظهر للمستخدم.
    Default Message = النص الموجود داخل خانة الكتابة بشكل افتراضي.
    لو المستخدم كتب قيمة وضغط OK، ترجع القيمة التي كتبها.
    لو ضغط Cancel، ترجع null.
*/


// alert

alert("Test");

console.log("Test");


// confirm

let confirmMsg = confirm("Are You Sure?");

console.log(confirmMsg);

if (confirmMsg === true) {
  console.log("Item Deleted");
} else {
  console.log("Item Not Deleted");
}


// prompt

let promptMsg = prompt("Good Day To You?", "Write Day With 3 Characters");

console.log(promptMsg);
}

// BOM 104 //
{
  /*
  BOM [Browser Object Model]

  - setTimeout(Function, Timeout, Additional Params)
    = تنفيذ دالة مرة واحدة بعد مرور وقت معين.

    Function = الدالة التي سيتم تنفيذها.
    Timeout = الوقت بالـ Milliseconds قبل تنفيذ الدالة.
    Additional Params = قيم إضافية يتم إرسالها للدالة.

    1000 Milliseconds = 1 Second
*/


// ========================================
// setTimeout مع Function مباشرة
// ========================================

setTimeout(function () {
  console.log("Msg");
}, 3000);


// ========================================
// setTimeout مع Function لها اسم
// ========================================

setTimeout(sayMsg, 3000);

function sayMsg() {
  console.log(`Iam Message`);
}


// ========================================
// setTimeout مع Parameters
// ========================================

setTimeout(sayMsgWithData, 3000, "Osama", 38);

function sayMsgWithData(user, age) {
  console.log(`Iam Message For ${user} Age Is : ${age}`);
}
}
// bom 105 //
{
  /*
  BOM [Browser Object Model]

  - setInterval(Function, Milliseconds, Additional Params)
    = تنفيذ دالة بشكل متكرر كل مدة زمنية محددة.

    Function = الدالة التي سيتم تنفيذها.
    Milliseconds = المدة بين كل تنفيذ وتنفيذ بالـ Milliseconds.
    Additional Params = قيم إضافية يتم إرسالها للدالة.

    1000 Milliseconds = 1 Second

    الفرق بين setTimeout و setInterval:
    - setTimeout = ينفّذ مرة واحدة بعد الوقت المحدد.
    - setInterval = ينفّذ بشكل متكرر كل الوقت المحدد.
*/


// ========================================
// setInterval مع Function مباشرة
// ========================================

setInterval(function () {
  console.log(`Msg`);
}, 1000);


// ========================================
// setInterval مع Function لها اسم
// ========================================

setInterval(sayMsg, 1000);

function sayMsg() {
  console.log(`Iam Message`);
}


// ========================================
// setInterval مع Parameters
// ========================================

setInterval(sayMsgWithData, 1000, "Osama", 38);

function sayMsgWithData(user, age) {
  console.log(`Iam Message For ${user} His Age Is: ${age}`);
}
}
