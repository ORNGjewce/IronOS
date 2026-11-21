#!/usr/bin/env python3
"""Convert an official USDA FoodData Central CSV export ZIP into an offline IRON//OS catalog.
Usage: python tools/import_usda.py path/to/FoodData_Central_..._csv_....zip
No network access or extra Python packages required.
"""
import csv, io, json, sys, zipfile
from pathlib import Path

NUTRIENTS = {'1008':'calories','2047':'calories','2048':'calories','1003':'protein','1005':'carbs','1004':'fat','1079':'fiber','1093':'sodium','208':'calories','203':'protein','205':'carbs','204':'fat','291':'fiber','307':'sodium'}
FIELDS = ('calories','protein','carbs','fat','fiber','sodium')

def main():
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python tools/import_usda.py <USDA FoodData Central CSV ZIP>')
    archive = Path(sys.argv[1]); dest = Path(__file__).resolve().parents[1] / 'src' / 'usdaFoods.json'
    with zipfile.ZipFile(archive) as z:
        names = {Path(n).name.lower():n for n in z.namelist()}
        def rows(name):
            if name not in names: raise SystemExit(f'Missing {name} in USDA archive. Choose a CSV-format FoodData Central download.')
            with z.open(names[name]) as f:
                yield from csv.DictReader(io.TextIOWrapper(f, encoding='utf-8-sig', newline=''))
        foods = {}
        for row in rows('food.csv'):
            fid = row.get('fdc_id','').strip()
            desc = row.get('description','').strip()
            if not fid or not desc: continue
            typ = row.get('data_type','')
            if typ == 'Branded': continue  # Branded dataset can be enormous; optional later
            foods[fid] = {'id':'usda-'+fid, 'name':desc, 'portion':'100 g', 'calories':0,'protein':0,'carbs':0,'fat':0,'fiber':0,'sodium':0,'source':'USDA FoodData Central','servingVerified':True}
        print(f'Reading nutrients for {len(foods):,} foods...', flush=True)
        energy_priority = {}
        for row in rows('food_nutrient.csv'):
            fid=row.get('fdc_id',''); food=foods.get(fid)
            if food is None: continue
            nutrient=row.get('nutrient_id',''); field=NUTRIENTS.get(nutrient)
            if not field: continue
            try: value=float(row.get('amount',''))
            except ValueError: continue
            if not 0 <= value <= 100000: continue
            if field == 'calories':
                priority = {'2047':3,'2048':2,'1008':1,'208':1}.get(nutrient,0)
                if priority < energy_priority.get(fid,0): continue
                energy_priority[fid] = priority
            food[field] = round(value,2)
        # USDA nutrient values above are per 100 g. Sodium is given in mg.
        # Avoid inventing portion conversions when the dataset has no verified weight.
        portions = {}
        if 'food_portion.csv' in names:
            for row in rows('food_portion.csv'):
                fid=row.get('fdc_id','')
                if fid not in foods or fid in portions: continue
                try: grams=float(row.get('gram_weight',''))
                except ValueError: continue
                if not 0 < grams <= 2000: continue
                text=(row.get('portion_description') or row.get('modifier') or '').strip()
                if text and len(text)<90:
                    portions[fid]=(text,grams)
        # Use only complete foods; otherwise a zero could be mistaken for a real measured value.
        output=[]
        for fid,food in foods.items():
            if food['calories']==0 and food['protein']==0 and food['carbs']==0 and food['fat']==0: continue
            # Keep nutrition values per 100 g; display portions as 100 g to preserve exact scaling.
            # USDA portion descriptions are not applied here because they require scaling nutrients.
            output.append(food)
        output.sort(key=lambda x:(x['name'].casefold(),x['id']))
        dest.write_text(json.dumps(output,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
        print(f'Wrote {len(output):,} searchable USDA foods to {dest} ({dest.stat().st_size/1024/1024:.1f} MiB).')
        if len(output)<1000: print('WARNING: This dataset contains relatively few foods; try SR Legacy or FNDDS CSV.')

if __name__=='__main__': main()
