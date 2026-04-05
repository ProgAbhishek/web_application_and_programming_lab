from django.urls import path
from . import views

# ── Concept: Named URL patterns (use in templates with {% url %}) ──
urlpatterns = [
    path('',                views.book_list,          name='book_list'),
    path('book/<int:pk>/',  views.book_detail,        name='book_detail'),
    path('book/add/',       views.book_create,        name='book_create'),
    path('book/<int:pk>/edit/',   views.book_update,  name='book_update'),
    path('book/<int:pk>/delete/', views.book_delete,  name='book_delete'),
    path('book/<int:pk>/reading-list/', views.toggle_reading_list, name='toggle_reading_list'),
]