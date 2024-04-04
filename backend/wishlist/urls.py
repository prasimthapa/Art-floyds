from django.urls import path
from .views import *

urlpatterns = [
    path("add/", add),
    path("remove/", remove),
    path("search/", search),
]
