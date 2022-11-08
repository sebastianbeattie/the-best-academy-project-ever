import http.client
import json

conn = http.client.HTTPConnection('localhost', 4000)
conn.request('GET', '/return', '{}')
mydata = conn.getresponse().read()
print("Python client running")
print(json.loads(mydata))
