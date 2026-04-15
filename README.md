## Task 1
  Contains JS script to manipulate JSON and format into human readable format.
## Task 2
  Contains python script to get and print the status codes of URLs from the given csv file

## PrototypeDuplicatechecker -: 
  A prototype to handle reference duplicates found in the same article. Gets reference input from the user, normalises, searches in the lookup table if found alerts the user.
  If not found, adds it to the InternalList and updates the Used Ref on the frontend side with the title and year.

Link: [link](https://ref-normalizer-duplicatechecker.vercel.app/)

### Functionalities:
- *cleanInputStrings()*:\
    Clean user input string -trimming off spaces on both ends and converting it to lowercase.
- *normalisedURL()*:\
    Normalises URL using regex , trims off prefixs like http,https and slashes
- *normalisedDOI()*:\
    Normalises DOI using regex, trims off prefix and stores only string beginning with 10. .
- *normalisedPMID()*:\
    Normalises PMID using regex, removes any character and stores only digits
- *normalisedISBN()*:\
    Normalises PMID using regex, removes any character and stores only digits and trailing x which represents 10, checks if it's a ISBN 10 or ISBN 13. If former,      passes it to convertISBN10to12()
- *convertISBN10To13()*:\
    Converting ISBN 10 to ISBN 13 by trimming off last digit,adding '978' as prefix multiplying the digits with 1 and 3 concurrently and summing up the score .        Then performing (10 - score % 10 )%10 to get a single digit which gets added to it as suffix. The final ISBN 13 will look like ''978-..(9 digits from ISBN         10)..-(newly computed digit)
- *searchRefInLookup()*\
     Searches for the Reference in the lookup table.
- *callCitoidAPI()*\
    Fetches metadata from citoid API and stores normalised processed IDs in the InternalList.
- *showToast()*\
    Alerts the user with a toast message if a duplicate is found
- *populateInternalRefList()*\
    Populates the frontend Used Reference list if it's not a duplicate.
