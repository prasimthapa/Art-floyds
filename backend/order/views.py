from django.http import JsonResponse
from itertools import groupby
from functools import reduce

from ArtFloyd.xata import xata

def my(request):
    orders = xata.data().query("orderArtwork", {
        "columns": ["order.*", "artwork.*", "order.user.*"]
    })["records"]

    res = [
            {
                **o["order"], 
                "user": o["order"]["user"], 
                "artworkName": o["artwork"]["name"],
                "oId": o["order"]["id"], 
                "total": o["artwork"]["price"]
            } for o in orders if o["artwork"] and o["order"] and o["order"]["user"]
    ]

    result = {k: list(v) for k, v in groupby(sorted(res, key=lambda x: x["oId"]), key=lambda x: x["oId"])}

    def combine_orders(p, c):
        return {
            "artworkName": f"{p['artworkName']}, {c['artworkName']}",
            "total": p["total"] + c["total"],
        }

    initial_value = {"artworkName": "", "total": 0}

    flattened_orders = [item for sublist in result.values() for item in sublist]

    result = reduce(combine_orders, flattened_orders, initial_value)
    print(list(groupby(res, key=lambda x: x["oId"])))

    return JsonResponse(result, safe=False)

