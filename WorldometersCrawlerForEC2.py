#!/usr/bin/env python
# coding: utf-8

# In[1]:


import requests
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
import datetime
from pprint import pprint

fileDay = datetime.date.today().strftime('%Y%m%d')
fileYear = datetime.date.today().strftime('%Y')

country = []
totCase = []
continent = [] # append continent index in 2020. 5. 22.

nationLink = [] # www.worldometers.info/coronavirus/ + 'country/name'


def scrapingWorldometers():
    url = "http://www.worldometers.info/coronavirus/"
    html = requests.get(url).text
    soup = BeautifulSoup(html, 'html.parser')
    colList = []
    dateList = []
    caseDataList = []
    deathDataList = []
    df = None
    
    #if yda:
        #table = soup.select_one('table#main_table_countries_yesterday')
    #else:    
    table = soup.select_one('table#main_table_countries_today')
    #pprint(table)

    columns = table.select('tr')
    isCol = True

    for col in columns:
        if isCol:
            cols = col.select('th')
            for c in cols:
                colList.append(c.text)
            isCol = False
        else:
            rows = col.select('td') # '#' [0] column was added, so that index changed in 5. 15.
            cases = int(rows[2].text.strip().replace(',',''))
            if (cases >= 1000) and rows[1].a: 
                country.append(rows[1].text.strip())
                nationLink.append(rows[1].a["href"])
                totCase.append(cases)
                continent.append(rows[14].text.strip()) # newRecov column was added, so that index changed in 5. 29. # newRecov was removed in 5. 30.
            else:
                continue
                
    # Réunion, Curaçao => Reunion, Curacao
    if "Réunion" in country:
        idx = country.index("Réunion")
        country[idx] = "Reunion"
    
    if "Curaçao" in country:
        idx = country.index("Curaçao")
        country[idx] = "Curacao"       

    for link in nationLink:
        html = requests.get(url + link).text
        soup = BeautifulSoup(html, 'html.parser')
        jsList = soup.find_all('script', attrs={'type' : "text/javascript"})
        for js in jsList:
            #js.string <- only works
            if js.string is None: continue
            if js.string.find("Highcharts") != -1:
                if js.string.find("'coronavirus-cases-linear'") != -1:
                    caseScript = js.string
                    frontCut = caseScript[caseScript.find("categories:"):]
                    caseDaysStartIdx = frontCut.find("[") + 1 # start from inside of []
                    caseDaysEndIdx = frontCut.find("]")
                    caseDaysList = frontCut[caseDaysStartIdx:caseDaysEndIdx].split(",")
                    
                    startDate = datetime.datetime.strptime(caseDaysList[0].strip('"') + ' 2020', "%b %d %Y")
                    endDate = datetime.datetime.strptime(caseDaysList[-1].strip('"') + ' ' + fileYear, "%b %d %Y")
                    dateList = pd.date_range(startDate, endDate)
                    
                    frontCut = frontCut[frontCut.find("data:"):]
                    caseDataStartIdx = frontCut.find("[") + 1 # start from inside of []
                    caseDataEndIdx = frontCut.find("]")
                    caseDataList = frontCut[caseDataStartIdx:caseDataEndIdx].split(",")
                    
                elif js.string.find("coronavirus-deaths-linear") != -1:
                    deathScript = js.string
                    frontCut = deathScript[deathScript.find("data:"):]
                    deathDataStartIdx = frontCut.find("[") + 1 # start from inside of []
                    deathDataEndIdx = frontCut.find("]")
                    deathDataList = frontCut[deathDataStartIdx:deathDataEndIdx].split(",")
        
        nationDict = {"Country": country[nationLink.index(link)], "Date":dateList, "Continent": continent[nationLink.index(link)], "TotalCases":caseDataList, "TotalDeaths":deathDataList}
        dfByNation = pd.DataFrame(nationDict)
        df = pd.concat([df, dfByNation])
        
    df["Date"] = df["Date"].astype(str) # datetime64[ns] -> str
    df = df.set_index(["Country", "Date", "Continent"]) # append continent index in 2020. 5. 22.
    return df


# In[2]:


def toCSV(df):
    csvFile = '/opt/tomcat/webapps/CoronaGraph/' + fileDay + 'CoronaWorld.csv' # set directory properly
    df.to_csv(csvFile)
    print(fileDay, "today csv complete")
    
def toJSON(df, orient='split'):
    jsonFile = '/opt/tomcat/webapps/CoronaGraph/' + fileDay + 'CoronaWorld.json'
    df.to_json(jsonFile, orient)
    print(fileDay, "today json complete")


# In[3]:


covidDataFrame = scrapingWorldometers()
#covidDataFrame.tail() # only china start from 2020-01-22


# In[4]:


toCSV(covidDataFrame)
toJSON(covidDataFrame)

