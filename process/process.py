'''
This python module contains functions to process the data
'''


import pandas as pd
from datetime import date
import json


def extract_useful_fields(orig_dat_name, out_dat_name):
    '''
    Given the original data, produce a processed data
    which contains only the fields we are interested in
    '''
    df = pd.read_csv(orig_dat_name, encoding='ISO-8859-1')
    interested_fields = [
        'eventid', 
        # When
        'iyear', 'imonth', 'iday',
        # Where
        'country', 'country_txt', 'region', 'region_txt',
        'provstate', 'city', 'latitude', 'longitude',
        # What
        'summary', 'suicide', 'attacktype1', 'attacktype1_txt',
        'targtype1', 'targtype1_txt', 'targsubtype1', 'targsubtype1_txt',
        'corp1', 'target1', 'natlty1', 'natlty1_txt',
        'weaptype1', 'weaptype1_txt', 'weapsubtype1', 'weapsubtype1_txt',
        'weapdetail',
        # Who
        'gname',
        # Why
        'motive',
        # Outcome
        'success', 'nkill', 'nwound',
    ]
    df[interested_fields].to_csv(out_dat_name)


def dist_to_1970_1_1_death_and_harm(dat_name, file_name):
    '''
    Generate a list of pairs: [[days, cnt]]
    And store into file
    '''
    df = pd.read_csv(dat_name)
    res = []
    for _, row in df.iterrows():
        try:
            cnt = int(row['nkill'] + row['nwound'])
            days = (date(row['iyear'], row['imonth'], row['iday']) - date(1970, 1, 1)).days
            res.append((days, cnt))
        except:
            pass
    with open(file_name, 'w+') as f:
        json.dump(res, f)
