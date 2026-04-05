from django import forms
from .models import Book

# ── Concept: ModelForm auto-generates fields from model ───────
class BookForm(forms.ModelForm):
    class Meta:
        model  = Book
        fields = ['title', 'author', 'isbn', 'published', 'genre', 'description']
        widgets = {
            'published': forms.DateInput(attrs={'type': 'date'}),
        }

    # Custom field-level validation
    def clean_isbn(self):
        isbn = self.cleaned_data['isbn']
        if not isbn.isdigit():
            raise forms.ValidationError("ISBN must contain only digits.")
        return isbn


# ── Concept: Plain Form (not tied to a model) ────────────────
class SearchForm(forms.Form):
    query = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Search books...'})
    )
    available_only = forms.BooleanField(required=False)