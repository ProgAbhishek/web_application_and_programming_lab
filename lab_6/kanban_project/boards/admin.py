from django.contrib import admin
from .models import Project, Column, Card, Comment

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ['name', 'owner', 'created_at']
    filter_horizontal = ['members']

@admin.register(Column)
class ColumnAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'order']

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display  = ['title', 'column', 'priority', 'due_date', 'assigned_to']
    list_filter   = ['priority']

admin.site.register(Comment)