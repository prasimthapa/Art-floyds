from django.http import JsonResponse

from ArtFloyd.xata import xata

def protected(fn):
    def wrapper(request, *args, **kwargs):
        token = request.headers.get("Authorization")
        token = str(token).replace("Bearer ", "")
        user = xata.records().get("nextauth_users", token)
        if not user:
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        return fn(request, user, *args, **kwargs)
    return wrapper

def create(request):
    JsonResponse({})

def update(request):
    JsonResponse({})

def all(request):
    limit = request.GET.get("limit")
    print(request)
    if not limit:
        res = xata.data().query("artwork", {
            "columns": ["name", "price", "style", "artist.*", "image.url"]
        })
    else:
        print(request)
        res = xata.data().query("artwork", {
            "page": {
                "size": int(limit)
            },
        })
    return JsonResponse(res["records"], safe=False)

@protected
def my(request, user):
    sort = request.GET.get("sort") or '-'
    price, order = sort.split('-')
    sort_val = [
        {"xata.updatedAt": "desc"},
        {"xata.createdAt": "desc"},
    ]
    if len(price) > 0 or len(order) > 0:
        sort_val = [{price: order}]
    res = xata.data().query("artwork", {
        "columns": ["name", "price", "style", "size", "artist.*", "image.url", "availableQuantity", "category"],
        "filter": {"artist.id": user["id"]},
        "sort": sort_val,
    })["records"]
    return JsonResponse(res, safe=False)

def by(request):
    res = xata.data().query("artwork", {
        "columns": ["name", "price", "style", "size", "artist.*", "image.url"],
        "sort": [
            {"xata.updatedAt": "desc"},
            {"xata.createdAt": "desc"},
        ],
        "filter": {
            "artist.id": request.GET.get("userId"),
        },
    })["records"]
    return JsonResponse(res, safe=False)


'''queryparam q: str'''
@protected
def search(request, user):
    input_search = request.GET.get('q', None)
    print(input_search)
    user_id = user["id"]
    sort = request.GET.get("sort")
    style = request.GET.get("style")
    price = order = ''
    if sort:
        price, order = sort.split('-')
    sort_val = [
        {"xata.updatedAt": "desc"},
        {"xata.createdAt": "desc"},
    ]
    has_sort = price is not None and order is not None and len(price) > 0 or len(order) > 0
    if has_sort:
        sort_val = [{price: order}]


    def all_artworks():
        print('anzjdnm')
        return xata.data().query("artwork", {"sort": sort_val})["records"]

    if not input_search and not has_sort:
        result = all_artworks()
    else:
        search_result = xata.data().search_table("artwork", {
            "query": input_search,
            "target": ["size", "price", "style", "name"],
            "fuzziness": 2
        }).get("records")
        if has_sort:
            search_result = sorted(search_result, key=lambda x: x["price"], reverse=order=="desc")
        result = search_result or all_artworks()

    wishlists = xata.data().query("wishlist", {
        "filter": {
            "user.id": user_id,
        },
    })

    for artwork in result:
        artwork["isInWishlist"] = any(wishlist["artwork"]["id"] == artwork["id"] for wishlist in wishlists["records"])

    return JsonResponse(result, safe=False)

