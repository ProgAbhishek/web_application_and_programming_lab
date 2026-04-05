from django.contrib import admin
from .models import Book, Genre, ReadingList

# Register your models here.

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display  = ['title', 'author', 'genre', 'available', 'added_by']
    list_filter   = ['genre', 'available']
    search_fields = ['title', 'author', 'isbn']

admin.site.register(Genre)
admin.site.register(ReadingList)