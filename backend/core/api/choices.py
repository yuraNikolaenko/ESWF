from rest_framework.views import APIView
from rest_framework.response import Response
from core.enums import CHOICE_MAP

class ChoiceListView(APIView):
    def get(self, request, code):
        choices = CHOICE_MAP.get(code)
        if not choices:
            return Response({"error": f"Unknown enum '{code}'"}, status=404)

        data = [{"value": v, "label": l} for v, l in choices]
        return Response(data)
