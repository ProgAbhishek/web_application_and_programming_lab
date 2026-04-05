from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from .models import Book, ReadingList
from .forms import BookForm, SearchForm

# ── Concept: Handling GET vs POST ────────────────────────────
def book_list(request):
    form  = SearchForm(request.GET)   # GET data for search
    books = Book.objects.select_related('genre').all()

    if form.is_valid():
        q = form.cleaned_data.get('query')
        if q:
            books = books.filter(title__icontains=q) | books.filter(author__icontains=q)
        if form.cleaned_data.get('available_only'):
            books = books.filter(available=True)

    # ── Concept: Sessions — track visit count ─────────────────
    request.session['visit_count'] = request.session.get('visit_count', 0) + 1

    return render(request, 'book_list.html', {
        'books': books,
        'form': form,
        'visit_count': request.session['visit_count'],
    })


def book_detail(request, pk):
    book = get_object_or_404(Book, pk=pk)
    return render(request, 'library/book_detail.html', {'book': book})


# ── Concept: @login_required — Authorization ─────────────────
@login_required
def book_create(request):
    if request.method == 'POST':
        form = BookForm(request.POST)
        if form.is_valid():
            book = form.save(commit=False)
            book.added_by = request.user        # set FK to current user
            book.save()
            messages.success(request, f'"{book.title}" added successfully!')
            return redirect('book_detail', pk=book.pk)
    else:
        form = BookForm()
    return render(request, 'library/book_form.html', {'form': form, 'action': 'Add'})


@login_required
def book_update(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if request.method == 'POST':
        form = BookForm(request.POST, instance=book)  # pre-populate form
        if form.is_valid():
            form.save()
            messages.success(request, 'Book updated!')
            return redirect('book_detail', pk=book.pk)
    else:
        form = BookForm(instance=book)
    return render(request, 'library/book_form.html', {'form': form, 'action': 'Edit'})


@login_required
def book_delete(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if request.method == 'POST':
        book.delete()
        messages.warning(request, 'Book deleted.')
        return redirect('book_list')
    return render(request, 'library/book_confirm_delete.html', {'book': book})


# ── Concept: Session-based reading list (like a cart) ────────
@login_required
def toggle_reading_list(request, pk):
    book = get_object_or_404(Book, pk=pk)
    reading_list, _ = ReadingList.objects.get_or_create(user=request.user)

    if book in reading_list.books.all():
        reading_list.books.remove(book)
        status = 'removed'
    else:
        reading_list.books.add(book)
        status = 'added'

    # Return JSON for AJAX calls
    return JsonResponse({'status': status, 'book': book.title})