from django.urls import path
from .views import *


urlpatterns = [
       path("create/", create),
       path("update/", update),
       path("all/", all),
       path("my/", my),
       path("by/", by),
       path("search/", search),
]
