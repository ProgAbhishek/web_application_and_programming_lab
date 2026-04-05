from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Project(models.Model):
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner       = models.ForeignKey(User, on_delete=models.CASCADE,
                                    related_name='owned_projects')
    members     = models.ManyToManyField(User, blank=True,
                                         related_name='projects')
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Column(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE,
                                related_name='columns')
    title   = models.CharField(max_length=100)
    order   = models.PositiveIntegerField(default=0)  # for drag-drop reorder

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.project.name} → {self.title}'


class Card(models.Model):
    PRIORITY_CHOICES = [
        ('low',    'Low'),
        ('medium', 'Medium'),
        ('high',   'High'),
    ]

    column      = models.ForeignKey(Column, on_delete=models.CASCADE,
                                    related_name='cards')
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL,
                                    null=True, blank=True,
                                    related_name='assigned_cards')
    priority    = models.CharField(max_length=10, choices=PRIORITY_CHOICES,
                                   default='medium')
    due_date    = models.DateField(null=True, blank=True)
    order       = models.PositiveIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Comment(models.Model):
    card       = models.ForeignKey(Card, on_delete=models.CASCADE,
                                   related_name='comments')
    author     = models.ForeignKey(User, on_delete=models.CASCADE)
    text       = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']