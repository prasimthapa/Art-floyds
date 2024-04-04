from django.urls import path
from .views import *

urlpatterns = [
    path("all/", all),
    path("create/", create),
    path("delete/", delete),
    path("deleteReply/", deleteReply),
    path("byId/", byId),
    path("reply/", reply),
]
