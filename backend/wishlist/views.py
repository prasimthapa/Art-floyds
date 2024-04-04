from django.http import JsonResponse

from ArtFloyd.xata import xata
from artwork.views import protected

def add(request):
    JsonResponse({})

def remove(request):
    JsonResponse({})

@protected
def search(request, user):
    q = request.GET.get("q")
    sort = request.GET.get("sort") or '-'
    price, order = sort.split('-')

    def all():
        return xata.data().query("wishlist", {
            "columns": ["artwork.*", "user.*"],
            "filter": {
                "user.id": user["id"],
            },
            "sort": {
                price, order,
            },
        })["records"]

    if not q:
        result  = all()
    else:
        search = xata.data().search_table("artwork", {
            "query": q,
            "target": ["size", "price", "style", "name"],
            "fuzziness": 2,
        })
        wishlist = all()
        search = [l for l in wishlist if l["artwork"] and l["artwork"]["id"] in [r["id"] for r in search["records"]]]
        if len(search) == 0:
            result = all()
        else:
            result = search

    result = [
            r["artwork"] 
            for r in result 
            if r["artwork"] and
                r["user"] and 
                r["user"]["id"] == user["id"]
    ]
    return JsonResponse(result, safe=False)

