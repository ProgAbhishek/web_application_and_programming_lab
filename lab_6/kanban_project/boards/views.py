from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import Project, Column, Card, Comment
from .serializers import (ProjectSerializer, ColumnSerializer, CardSerializer,
                          CommentSerializer, RegisterSerializer, UserSerializer)
from .permissions import IsProjectMember


# ── Auth ──────────────────────────────────────────────────────
class RegisterView(generics.CreateAPIView):
    queryset         = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# ── Projects ──────────────────────────────────────────────────
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class   = ProjectSerializer
    permission_classes = [IsProjectMember]

    def get_queryset(self):
        # Users only see projects they own or are a member of
        user = self.request.user
        return Project.objects.filter(
            owner=user
        ).union(
            Project.objects.filter(members=user)
        )

    def perform_create(self, serializer):
        # Auto-set owner to the logged-in user
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(pk=user_id)
            project.members.add(user)
            return Response({'status': 'member added'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'},
                            status=status.HTTP_404_NOT_FOUND)


# ── Columns ───────────────────────────────────────────────────
class ColumnViewSet(viewsets.ModelViewSet):
    serializer_class   = ColumnSerializer
    permission_classes = [IsProjectMember]

    def get_queryset(self):
        return Column.objects.filter(
            project__id=self.kwargs['project_pk']
        )

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs['project_pk'])
        serializer.save(project=project)

    @action(detail=False, methods=['patch'])
    def reorder(self, request, project_pk=None):
        # Expects: [{ id: 1, order: 0 }, { id: 2, order: 1 }, ...]
        for item in request.data:
            Column.objects.filter(pk=item['id']).update(order=item['order'])
        return Response({'status': 'reordered'})


# ── Cards ─────────────────────────────────────────────────────
class CardViewSet(viewsets.ModelViewSet):
    serializer_class   = CardSerializer
    permission_classes = [IsProjectMember]

    def get_queryset(self):
        return Card.objects.filter(
            column__id=self.kwargs['column_pk']
        )

    def perform_create(self, serializer):
        column = Column.objects.get(pk=self.kwargs['column_pk'])
        serializer.save(column=column)

    @action(detail=True, methods=['patch'])
    def move(self, request, pk=None, **kwargs):
        """Move a card to a different column."""
        card          = self.get_object()
        new_column_id = request.data.get('column_id')
        new_order     = request.data.get('order', 0)
        card.column   = Column.objects.get(pk=new_column_id)
        card.order    = new_order
        card.save()
        return Response(CardSerializer(card).data)


# ── Comments ──────────────────────────────────────────────────
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class   = CommentSerializer
    permission_classes = [IsProjectMember]

    def get_queryset(self):
        return Comment.objects.filter(card__id=self.kwargs['card_pk'])

    def perform_create(self, serializer):
        card = Card.objects.get(pk=self.kwargs['card_pk'])
        serializer.save(author=self.request.user, card=card)