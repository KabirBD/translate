console.log('Hello from dictionary');
// ---------- Function area for dictionary --------+-

//------- fetch WordListLite -------
fetch('WordListLite.json')
.then(function (response) {
  return response.json();
})
.then(function (data) {
  wordlist = data;
});

//------- fetch VerbForms -------
fetch('VerbForms.json')
.then(function (response) {
  return response.json();
})
.then(function (data) {
  verbForms = data;
});


// ---------- Global Variables ----------
let paragraph, wordList, verbForms, allMeaning, meaning, meaningArr, wordsArr, loop, enWord, bnWord, vb, vt, vp, vpp, ving, tempWord;


// ------ The function which will translate every English words into Bangla --------
async function translate(text) {
  // ------ translate finalWord into english -----
  function enToBn() {
    for (var wordObj of wordlist) {
      enWord = wordObj.English;
      bnWord = wordObj.Bangla;
      if (enWord == finalWord.toLowerCase()) {
        if (meaningArr.includes(bnWord)) {} else {
          meaningArr.push(bnWord);
          if (loop == true) {
            meaning = `${finalWord} : ${bnWord}`;
            loop = false;
          } else {
            meaning = `${meaning}, ${bnWord}`;
          }
        }
      }
    }
  }

  //-------- processing paragraph --------
  paragraph = paragraph.replace(/-/g, ' ');
  paragraph = paragraph.replace(/\n/g, ' <br> ');
  wordsArr = paragraph.split(" ");
  allMeaning = "";

  // -------- Run a function for each words of the paragraph --------
  for (var word of wordsArr) {
    meaning = word;
    meaningArr = [];
    finalWord = word;
    // --------- if the word start with " or ' then remove it ----------
    if (finalWord.indexOf("'") == 0 || finalWord.indexOf('"') == 0) {
      finalWord = finalWord.substring(1, finalWord.length)
    }
    //--------- if there is an ' in a word then remove letters after ' ---------
    else if (finalWord.includes("'")) {
      finalWord = finalWord.substring(0, finalWord.indexOf("'"))
    }
    // --------- remove special characters from word --------
    finalWord = finalWord.replace(/[&\/\\#,+()$~%!.„'":]/, '');
    finalWord = finalWord.replace(/[^a-zA-Z]/, '');
    // if the word can be translated simply
    loop = true;
    enToBn();

    // -------- If simply can not translate --–----
    // -------- check the word if it is in another verb form --------
    if (!meaningArr.length) {
      for (var formObj of verbForms) {
        vb = formObj.vb;
        vt = formObj.vt;
        vp = formObj.vp;
        vpp = formObj.vpp;
        ving = formObj.ving;
        if (finalWord.toLowerCase() == vt || finalWord.toLowerCase() == vp || finalWord.toLowerCase() == vpp || finalWord.toLowerCase() == ving) {
          // -------- translate the base form of the verb --------
          finalWord = vb;
          enToBn();
        }
      }

      // -------- check the word if it is in plural form --------
      // -------- if last letter is s then remove it and try again -------
      if (!meaningArr.length) {
        if (finalWord.substring(finalWord.length-1, finalWord.length) == "s") {
          tempWord = finalWord;
          finalWord = finalWord.substring(0, finalWord.length-1);
          enToBn();
          finalWord = tempWord;
        }
      }
      //--------- if last letters are es then remove it and  try again ---------
      if (!meaningArr.length) {
        if (finalWord.substring(finalWord.length-2, finalWord.length) == "es") {
          tempWord = finalWord;
          finalWord = finalWord.substring(0, finalWord.length-2);
          enToBn();
          finalWord = tempWord;
        }
      }
      // -------- if last letters are ies ther replece it with y and try again ----------
      if (!meaningArr.length) {
        if (finalWord.substring(finalWord.length-3, finalWord.length) == "ies") {
          tempWord = finalWord;
          finalWord = finalWord.substring(0, finalWord.length-3) +"y";
          enToBn();
          finalWord = tempWord;
        }
      }
      // --------- check the word if it is in superlative or comparative degree -------–
      // -------- if last letters are est then remove it and try again ----–--
      if (!meaningArr.length) {
        if (finalWord.substring(finalWord.length-3, finalWord.length) == "est") {
          tempWord = finalWord;
          finalWord = finalWord.substring(0, finalWord.length-3);
          enToBn();
          finalWord = tempWord;
        }
      }
      //---------- if last letters are er then remove it and try again ---------
      if (!meaningArr.length) {
        if (finalWord.substring(finalWord.length-2, finalWord.length) == "er") {
          tempWord = finalWord;
          finalWord = finalWord.substring(0, finalWord.length-2);
          enToBn();
          finalWord = tempWord;
        }
      }
    }
    //------–- The final translated result container -----------
    allMeaning = allMeaning + `<span data-toggle="tooltip" title="${meaning}"> ${word} </span>\n`;
  }
  // --------- print final result on console --------
  //console.log(allMeaning);
}

// ------------------ DOM manipulation ---------------
function manipulate() {
  // ------- the element which will contain the paragraph fron user input -------
  paragraph = document.getElementById("text").value;

  translate();
  // -------- show output to the user ------–
  document.getElementById("output").innerHTML = allMeaning;
  document.getElementById("outputCode").value = allMeaning;
  //-------- enable tooltip ---------
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
}
//-----–----- To show after editing result to output -----------
function edit() {
  document.getElementById("output").innerHTML = document.getElementById("outputCode").value;
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
}