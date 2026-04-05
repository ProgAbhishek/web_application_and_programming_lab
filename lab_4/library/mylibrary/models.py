from django.db import models
from django.contrib.auth.models import User

# ── Concept: ORM Model = DB Table ────────────────────────────
class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Book(models.Model):
    title       = models.CharField(max_length=200)
    author      = models.CharField(max_length=150)
    isbn        = models.CharField(max_length=13, unique=True)
    published   = models.DateField()
    genre       = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True)
    description = models.TextField(blank=True)
    available   = models.BooleanField(default=True)
    added_by    = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.author}"


# ── Concept: Many-to-Many relationship ───────────────────────
class ReadingList(models.Model):
    user  = models.OneToOneField(User, on_delete=models.CASCADE)
    books = models.ManyToManyField(Book, blank=True)

    def __str__(self):
        return f"{self.user.username}'s reading list"