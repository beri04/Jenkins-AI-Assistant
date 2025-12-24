import logging
import time 

def execute_query(cur, query, params = None):
    logging.info(f"[SQL] Executing:{query} | Params:{params}")
    
    start = time.time()

    try:
        cur.execute(query, params)
        duration = (time.time() - start) * 1000
        logging.info(f"[SQL] Succcess | Duration:{duration:.2f}ms")
    except Exception as e:
        logging.error(f"[SQL ERROR] Query failed: {query} | Params={params} | Error={str(e)}")
        raise e