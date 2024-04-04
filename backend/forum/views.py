from django.http import JsonResponse

from ArtFloyd.xata import xata

def all(request):
    records = xata.data().query("chat", {
        "columns": ["*", "owner.*"],
        "filter": { "type": "forum" },
        "sort": { "xata.createdAt": "desc" }
    })["records"]
    return JsonResponse(records, safe=False)

def create(request):
    JsonResponse({})

def delete(request):
    JsonResponse({})

def deleteReply(request):
    JsonResponse({})

def byId(request):
    chat_id = request.GET.get("id")
    records = xata.data().query("chatMessage", {
        "columns": ["*", "sender.*"],
        "filter": { "chat.id": chat_id },
        "sort": { "xata.createdAt": "desc" }
    })["records"]
    chat = xata.data().query("chat", {
        "columns": ["*", "owner.*"],
        "filter": { "id": chat_id }
    })["records"][0]

    res = {
        **chat,
        "replies": records,
    }
    print(res)
    return JsonResponse(res)

def reply(request):
    JsonResponse({})

