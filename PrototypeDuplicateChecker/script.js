//mockup data for internal list with essential metadata 

let internalRefListForthisArticle={
  "ArticleUIDRef1":{
    "DOI" : "10.1371/journal.pcbi.1002947",
    "ISSN" : ["1553-7358"],
    "PMID" : "23555203",
    "author" : [ [ "Erik M.",
          "Volz"
        ],
        [ "Katia",
          "Koelle"
        ],
        [ "Trevor",
          "Bedford"
        ]
      ],
      "date" : "2013",
      "title" : "Viral phylodynamics",                 
    "url" : "http://www.ncbi.nlm.nih.gov/pubmed/23555203",

  }
  

}

//lookup table for references 
//check if key present in this list
//  if not send API req to citoid then retrieve needed info
//normalise and add it to the internal list
let lookupTableForRef={
  "10.1371/journal.pcbi.1002947":"ArticleUIDRef1",
  "23555203":"ArticleUIDRef1",
  "ncbi.nlm.nih.gov/pubmed/23555203":"ArticleUIDRef1",
  


}

//const originalInpVal=document.querySelector('#reference-id').value;
const submitBtn=document.querySelector('#submit-btn')
const toastOverlay = document.getElementById('toast-overlay');
const ulList=document.querySelector('.li-item-used-refs')

let inpVal="";

submitBtn.addEventListener('click', async(event)=>{
  event.preventDefault(); 
  inpVal=document.querySelector('#reference-id').value
  document.querySelector('#reference-id').value="";
  let inputRef=cleanInputStrings(inpVal)


  const fnNames=[normalisedDOI,normalisedISBN,normalisedPMID,normalisedURL]

  for(fn of fnNames){
      if(fn(inputRef)===true){break;}
  }
    
  


 

})






//let inputRef="10.1371/journal.pcbi.1002947"

function cleanInputStrings(inputVal){
  //remove whitespace ,convert to lowercase
 
  inputRef=inputVal.trim().toLowerCase();
  
  return inputRef;
  // console.log(normalisedPMID(inputRef))
  // console.log(normalisedISBN(inputRef));
  // console.log(normalisedDOI(inputRef));
  // console.log(normalisedURL(inputRef));

}

function normalisedURL(inputRef){
  //remove https,https,www,trailing /,tracking queries?need to be done
  let nURL;
   nURL=inputRef.replace(/^(?:https?:\/\/)?(?:www\.)?/,"").replace(/\/+$/,"")
   
   return !searchRefInLookup(nURL)?callCitoidAPI(inpVal):true
 
}

function normalisedDOI(inputRef){
  //remove prefix
   let nDOI;
   nDOI=inputRef.replace(/^.*?(?=10\.)/,"")
   
   return !searchRefInLookup(nDOI)?nDOI:true

}

function normalisedPMID(inputRef){
  //remove prefix,keep digits only
  let nPMID;
   nPMID=inputRef.replace(/\D/g, "")
   
   return !searchRefInLookup(nPMID)?nPMID:true
}

function normalisedISBN(inputRef){
  //remove -,spaces, and convert 10 to 13 
  let nISBN;
  nISBN=inputRef.replace(/[^0-9x]/g, "")
  //console.log(nISBN)
  if(nISBN.length===10)return convertISBN10To13(nISBN)
  
  return !searchRefInLookup(nISBN)?nISBN:true;
}

function convertISBN10To13(nISBN){
  //converting ISBN 10 to ISBN 13
  let newNISBN=nISBN.replace(/x$/,"")
  newNISBN="978"+newNISBN
  let sumISBN10=0;
  for(let i=0;i<newNISBN.length;i++) i%2!=0? sumISBN10+=Number(newNISBN[i])*3: sumISBN10+=Number(newNISBN[i])
  //console.log(sumISBN10)
  sumISBN10=(10-(sumISBN10%10))%10
  //console.log(sumISBN10)
  newNISBN+=sumISBN10
  //console.log(newNISBN)
  return newNISBN;
}

function searchRefInLookup(inp){
  //console.log(lookupTableForRef[inp])
  if(lookupTableForRef[inp]){
    let {title,date}=internalRefListForthisArticle[lookupTableForRef[inp]]
    console.log(title+date)
    showToast(`This Reference(${title}, ${date} is already in use in this Article!`)
    return true
  }
  return false
}


async function callCitoidAPI(reference){
  //console.log(inpVal)
  const citoidUrl=`https://en.wikipedia.org/api/rest_v1/data/citation/mediawiki/${reference}`

  try{
      const response=await fetch(citoidUrl,{
        method:'GET',
        headers:{
          'Accept':'application/json'
        }
      });

      if(!response.ok)throw new Error('API Request failed')

      const data = await response.json();
      //the first result contain the metadata we want
      let ndata=data[0];
      console.log(ndata)

      const reqFields=['DOI','ISBN','PMID','URL','ISSN','author','title','date']
      const refinedData={};
      const nUID=`ArticleUIDRef${Object.keys(internalRefListForthisArticle).length + 1}`
      for(let i=0;i<reqFields.length;i++){
        //normalise just the first four fields and store the rest as it is.
        let key=reqFields[i];
        if(i<4){
            
            if(ndata[key]){
              (key=='ISBN' && Array.isArray(ndata[key]))?val=cleanInputStrings(ndata[key][0])
              : val=cleanInputStrings(String(ndata[key]));
              refinedData[key]=window[`normalised${key}`](val);

              Array.isArray(refinedData[key])?lookupTableForRef[refinedData[key][0]]=nUID:lookupTableForRef[refinedData[key]]=nUID
            
            }

        }
        else{
          refinedData[key]=ndata[key]
        }
      }
     
      
      internalRefListForthisArticle[nUID]=refinedData;
      console.log(internalRefListForthisArticle)
      console.log(lookupTableForRef)
      populateInternalRefList();

}
catch(error){
  console.error(error)
}

}


function showToast(message) {
    const toast = document.createElement('div');
    
    toast.textContent = message;

    toastOverlay.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}


function populateInternalRefList(){
   ulList.innerHTML = ""; 
    Object.values(internalRefListForthisArticle).forEach(article => {
        const li = document.createElement('li');
        li.textContent = `${article.title}, (${article.date})`;
        ulList.appendChild(li);
    });
}

//cleanInputStrings(inpVal)