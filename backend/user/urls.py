from django.urls import path
from .views import *

urlpatterns = [
    path("updateBio/", updateBio),
    path("withId/", withId),
]
