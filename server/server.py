from flask import Flask, jsonify
import requests

from gradio_client import Client



app = Flask(__name__)

@app.route("/members")
def members(): 
    return "Sample code"


@app.route("/apitest")
def apiTest():

    url = (
        f"https://hf.space/embed/sayalioak/blip-api/api/predict/"
    )
    
    client = Client("sayalioak/blip-api")
    result = client.predict(
            input="https://entertainment.time.com/wp-content/uploads/sites/3/2014/01/140123-labor-day-2.jpg",
            api_name="/predict"
    )
    print(result)
    return result   


if __name__ == "__main__":
    app.run()
