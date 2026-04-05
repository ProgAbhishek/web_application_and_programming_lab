from rest_framework.permissions import BasePermission


class IsProjectMember(BasePermission):
    """Allow access only to the project owner or members."""

    def has_object_permission(self, request, view, obj):
        # obj could be a Project, Column, Card, or Comment
        # Walk up to find the project
        if hasattr(obj, 'owner'):           # Project
            project = obj
        elif hasattr(obj, 'project'):       # Column
            project = obj.project
        elif hasattr(obj, 'column'):        # Card
            project = obj.column.project
        elif hasattr(obj, 'card'):          # Comment
            project = obj.card.column.project
        else:
            return False

        return (project.owner == request.user or
                request.user in project.members.all())