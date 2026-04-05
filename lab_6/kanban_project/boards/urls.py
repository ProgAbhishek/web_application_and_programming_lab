from django.urls import path, include
from rest_framework_nested import routers
from .views import ProjectViewSet, ColumnViewSet, CardViewSet, CommentViewSet

# pip install drf-nested-routers
router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

# /api/projects/{project_pk}/columns/
projects_router = routers.NestedDefaultRouter(router, r'projects',
                                              lookup='project')
projects_router.register(r'columns', ColumnViewSet, basename='project-columns')

# /api/projects/{project_pk}/columns/{column_pk}/cards/
columns_router = routers.NestedDefaultRouter(projects_router, r'columns',
                                             lookup='column')
columns_router.register(r'cards', CardViewSet, basename='column-cards')

# /api/projects/{project_pk}/columns/{column_pk}/cards/{card_pk}/comments/
cards_router = routers.NestedDefaultRouter(columns_router, r'cards',
                                           lookup='card')
cards_router.register(r'comments', CommentViewSet, basename='card-comments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(projects_router.urls)),
    path('', include(columns_router.urls)),
    path('', include(cards_router.urls)),
]