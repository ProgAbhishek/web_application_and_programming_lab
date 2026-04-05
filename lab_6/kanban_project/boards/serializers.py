from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Column, Card, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # ✅ create_user hashes the password correctly
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model  = Comment
        fields = ['id', 'author', 'text', 'created_at']


class CardSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='assigned_to',
        write_only=True, required=False, allow_null=True
    )
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model  = Card
        fields = ['id', 'title', 'description', 'column', 'assigned_to',
                  'assigned_to_id', 'priority', 'due_date', 'order',
                  'created_at', 'comments']


class ColumnSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model  = Column
        fields = ['id', 'title', 'order', 'project', 'cards']


class ProjectSerializer(serializers.ModelSerializer):
    owner   = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    columns = ColumnSerializer(many=True, read_only=True)

    class Meta:
        model  = Project
        fields = ['id', 'name', 'description', 'owner',
                  'members', 'columns', 'created_at']