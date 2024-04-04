from django.urls import path
from .views import *


urlpatterns = [
    path("get/", get),
    path("add/", add),
    path("remove/", remove),
    path("deleteArtwork/", deleteArtwork),
    path("clear/", clear),
]
