# from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('artwork/', include("artwork.urls")),
    path('cart/', include("cart.urls")),
    path('dashboard/', include("dashboard.urls")),
    path('forum/', include("forum.urls")),
    path('order/', include("order.urls")),
    path('user/', include("user.urls")),
    path('wishlist/', include("wishlist.urls")),
]

