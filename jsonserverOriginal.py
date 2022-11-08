import json
from http.server import HTTPServer, BaseHTTPRequestHandler


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(d.encode())


d = json.loads(open('myquizdata.json').read())

httpd = HTTPServer(('localhost', 4000), SimpleHTTPRequestHandler)
print("Server running")
httpd.serve_forever()
