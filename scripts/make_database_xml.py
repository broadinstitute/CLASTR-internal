import xml.etree.ElementTree as ET
import pandas as pd
import numpy as np
import copy
import os
from apiclient import discovery
from google.oauth2 import service_account

tree = ET.parse('../resources/cellosaurus.xml')

scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
secret_file = '../resources/client_secret.json'

spreadsheet_id = '134zxrQ77yMdDL4hLYybJJQN6pxLZIVLz-hORXIpid50'
range_name = 'Approved Reference STR'

credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)
service = discovery.build('sheets', 'v4', credentials=credentials)

sheet = service.spreadsheets()
result = sheet.values().get(spreadsheetId=spreadsheet_id,
                            range=range_name).execute()
values = result.get('values', [])
df = pd.DataFrame(values[1:], columns=values[0])

sites = ["D3S1358","TH01","D21S11","D18S51","Penta E","D5S818","D13S317","D7S820", \
         "D16S539","CSF1PO","Penta D","vWA","D8S1179","TPOX","FGA","Amelogenin"]
df["Stripped Name"] = df["Stripped Name"].fillna("")
df["Arxspan ID"] = df["Arxspan ID"].fillna("")
for site in sites:
    df[site] = df[site].replace(np.nan, "")

root = tree.getroot()
cell_line_list = root.findall('cell-line-list')[0]

for cell_line in cell_line_list.findall('cell-line'):
    source = ET.SubElement(cell_line,'str_from',attrib = {'type': 'identifier'})
    source.text = "Cellosaurus"

root = tree.getroot()
cell_line_list = ET.SubElement(root,'cell-line-list')

for i in range(0,df.shape[0]):
    cell_line = ET.Element("cell-line",attrib = {'category': 'Cancer cell line'})
    cell_line_list.append(cell_line)

    accession_list = ET.SubElement(cell_line,'accession-list')
    accession = ET.Element("accession",attrib = {'type': 'primary'})
    accession.text = df.loc[i,"Arxspan ID"]
    accession_list.append(accession)

    name_list = ET.SubElement(cell_line,'name-list')
    name = ET.Element("name",attrib = {'type': 'identifier'})
    name.text = df.loc[i,"Stripped Name"]
    name_list.append(name)

    source = ET.SubElement(cell_line,'str_from',attrib = {'type': 'identifier'})
    source.text = df.loc[i,"Source"]

    #only using one accession
    #arxspan_list = ET.SubElement(cell_line,'arxspan-list')
    #arxspan = ET.Element("arxspan",attrib = {'type': 'identifier'})
    #arxspan.text = df.loc[i,"Arxspan ID"]
    #arxspan_list.append(arxspan)

    str_list = ET.SubElement(cell_line,'str-list')
    source_list = ET.SubElement(str_list,'source-list')
    #Might need to add source
    marker_list = ET.SubElement(str_list,'marker-list')

    for site in sites:
        marker = ET.Element("marker",attrib = {'id': site,'conflict': 'false'})
        marker_data_list = ET.SubElement(marker,'marker-data-list')
        marker_data = ET.Element("marker-data")
        alleles = ET.SubElement(marker_data,"alleles")
        alleles.text = df.loc[i,site].replace(", ",",")
        marker_data_list.append(marker_data)
        marker_list.append(marker)

    species_list = ET.SubElement(cell_line,'species-list')
    cv_term = ET.Element("cv-term",attrib = {'terminology':'NCBI-Taxonomy', 'accession' : '9606'})
    cv_term.text = "Homo sapiens"
    species_list.append(cv_term)

def indent(elem, level=0):
    i = "\n" + level*"  "
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = i + "  "
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
        for elem in elem:
            indent(elem, level+1)
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
    else:
        if level and (not elem.tail or not elem.tail.strip()):
            elem.tail = i

indent(root)

tree.write('../resources/database.xml')
