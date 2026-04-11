import os,requests,csv


cur_dir = os.path.dirname(os.path.abspath(__file__))
filename = os.path.join(cur_dir, "Task2-Intern.csv")


with open(filename,mode='r') as csvfile:
    csvreader=csv.reader(csvfile)
    next(csvreader)
    for url in csvreader:
       

        try:
            response = requests.head(url[0],timeout=1)
            print(f"({response.status_code}) "+url[0])

        except requests.exceptions.ConnectionError:
            print('(DNS ERROR) '+ url[0])
        
        except requests.exceptions.Timeout:
            print('(TIMEOUT ERROR) '+ url[0])

        except requests.exceptions.InvalidURL:
            print('(INVALID URL ERROR) '+ url[0])
        
        except requests.exceptions.MissingSchema:
            print('(MISSING SCHEMA ERROR) '+ url[0])

        except requests.exceptions.RequestException as err:
             print('(NETWORK ERROR) '+ url[0])
         

        

