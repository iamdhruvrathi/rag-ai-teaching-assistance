import pandas as pd
import requests
import os
import json
import numpy as np
import joblib

def create_embeddings(text_list):
    r = requests.post("http://localhost:11434/api/embed", json={
        "model": "bge-m3",
        "input": text_list
    })
    if r.status_code != 200:
        return [] # Return empty so the loop knows to skip
    return r.json().get("embeddings", [])

jsons = os.listdir("jsons")
my_dicts = []
chunk_id = 0

for json_file in jsons:
    with open(f"jsons/{json_file}", encoding='utf-8') as f:
        content = json.load(f)
    
    chunks_to_process = content['chunks']
    print(f"Processing {json_file}: {len(chunks_to_process)} chunks")
    
    for i, chunk in enumerate(chunks_to_process):
        text = chunk.get('text', "").strip()
        
        # Skip if text is empty or too short to be meaningful
        if len(text) < 2:
            continue
            
        # Try to embed each chunk individually
        try:
            # We wrap the single text in a list [text] because the API expects a list
            embedding_result = create_embeddings([text])
            
            if embedding_result:
                chunk["chunk_id"] = chunk_id
                chunk["embedding"] = embedding_result[0] # Take the first (and only) result
                chunk_id += 1
                my_dicts.append(chunk)
            else:
                print(f"  - Skipping chunk {i} due to empty embedding")
                
        except Exception as e:
            print(f"  - Error on chunk {i}: {e}")
            continue

# Save the successful ones
df2 = pd.DataFrame.from_records(my_dicts)
joblib.dump(df2, 'embeddings.joblib')
print(f"Done! Saved {len(df2)} chunks to embeddings.joblib")