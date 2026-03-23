import requests,csv

#formattedData=[]

filename="Task 2 - intern.csv"

with open(filename,mode='r') as csvfile:
    csvreader=csv.reader(csvfile)
    next(csvreader)
    for url in csvreader:
        #print(url[0])

        try:
            response = requests.get(url[0],timeout=1)
            print('('+f"({response.status_code})"+') '+url[0])

        except requests.exceptions.RequestException as err:
          print(f"{err}+{url}")
            

        

