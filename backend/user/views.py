from django.http import JsonResponse

from ArtFloyd.xata import xata

def updateBio(request):
    JsonResponse({})

def withId(request):
    res = xata.records().get("nextauth_users", request.GET.get("id"))
    return JsonResponse(res)

